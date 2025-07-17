import { dataSource } from "@/config/db";
import { Profile } from "@/entities/Profile";
import {
  ChangeEmailInput,
  ConfirmNewEmailInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  SignInInput,
  User,
  UserCreateInput,
  UserUpdateProfileInput,
} from "@/entities/User";
import { UserToken } from "@/entities/UserToken";
import { hashPassword, verifyPassword } from "@/helpers/helpers";
import { validateInput } from "@/helpers/validateInput";
import { sendRecoverEmail } from "@/lib/email/recoverPassword";
import {
  sendConfirmEmail,
  sendConfirmNewEmail,
} from "@/lib/email/validationEmail";
import { ErrorCatcher } from "@/middlewares/errorHandler";
import { AuthContextType, ContextType, RoleType } from "@/types";
import { UserInputError } from "apollo-server-errors";
import { ValidationError } from "class-validator";
import Cookies from "cookies";
import { GraphQLError } from "graphql";
import * as jsonwebtoken from "jsonwebtoken";
import {
  Arg,
  Authorized,
  Ctx,
  Mutation,
  Resolver,
  UseMiddleware,
} from "type-graphql";

@Resolver(User)
export class UserResolver {
  @Mutation(() => User)
  async createUser(
    @Arg("data", () => UserCreateInput) data: UserCreateInput
  ): Promise<User | ValidationError[]> {
    if (data.password !== data.confirmPassword) {
      throw new GraphQLError("Passwords don't match", {
        extensions: {
          code: "PASSWORDS_DONT_MATCH",
          http: { status: 400 },
        },
      });
    }

    await validateInput(data);

    const existingUser = await User.findOne({ where: { email: data.email } });

    if (existingUser) {
      throw new GraphQLError("User with this email already exists", {
        extensions: {
          code: "EMAIL_ALREADY_EXIST",
          http: { status: 409 },
        },
      });
    }

    try {
      const hashedPassword = await hashPassword(data.password);
      const newUser = new User();
      newUser.email = data.email;
      newUser.password = hashedPassword;
      newUser.firstname = data.firstname;
      newUser.lastname = data.lastname;
      newUser.role = RoleType.user;

      await dataSource.manager.transaction(async () => {
        await newUser.save();

        const profile = new Profile();
        profile.email = newUser.email;
        profile.firstname = newUser.firstname;
        profile.lastname = newUser.lastname;
        profile.id = newUser.id;
        profile.role = newUser.role;
        const confirmToken = jsonwebtoken.sign(
          { id: newUser.id },
          process.env.JWT_SECRET_RECOVER_KEY,
          { expiresIn: "24h" }
        );
        newUser.emailToken = confirmToken;
        newUser.emailSentAt = new Date();
        await newUser.save();
        await profile.save();
        await sendConfirmEmail(newUser.email, confirmToken);
      });

      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Unable to create user. Please try again.");
    }
  }

  @Mutation(() => User, { nullable: true })
  async signIn(
    @Arg("datas") datas: SignInInput,
    @Ctx() context: ContextType
  ): Promise<User | null> {
    try {
      await validateInput(datas);

      const { email, password } = datas;
      const user: User | null = await User.findOneBy({ email });

      if (!user) {
        throw new GraphQLError("Invalid email or password", {
          extensions: {
            code: "INVALID_CREDENTIALS",
            http: { status: 401 },
          },
        });
      }

      const passwordMatch = await verifyPassword(user.password, password);

      if (!passwordMatch) {
        throw new GraphQLError("Invalid email or password", {
          extensions: {
            code: "INVALID_CREDENTIALS",
            http: { status: 401 },
          },
        });
      }

      if (!user.emailVerifiedAt) {
        if (
          user.emailSentAt &&
          user.emailSentAt > new Date(Date.now() - 1000 * 60 * 60 * 24)
        ) {
          throw new GraphQLError("Email already sent", {
            extensions: { code: "EMAIL_ALREADY_SENT", http: { status: 401 } },
          });
        }
        const confirmToken = jsonwebtoken.sign(
          { id: user.id },
          process.env.JWT_SECRET_RECOVER_KEY,
          { expiresIn: "24h" }
        );
        user.emailToken = confirmToken;
        user.emailSentAt = new Date();
        await sendConfirmEmail(user.email, confirmToken);
        await user.save();
        throw new GraphQLError("Email not verified", {
          extensions: { code: "EMAIL_NOT_VERIFIED", http: { status: 401 } },
        });
      }

      //TODO replace 3d per 1h when refresh token is fully implemented
      const token = jsonwebtoken.sign(
        { id: user.id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "3d" }
      );

      const refreshToken = jsonwebtoken.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET_KEY,
        { expiresIn: "7d" }
      );

      const userToken = new UserToken();
      userToken.token = token;
      userToken.refreshToken = refreshToken;
      userToken.user = user;
      await userToken.save();
      if (process.env.NODE_ENV !== "testing") {
        const cookies = new Cookies(context.req, context.res);
        //TODO remove 24 * 3 when refresh token is fully implemented
        cookies.set("token", token, {
          secure: process.env.NODE_ENV === "production",
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 3,
        });

        cookies.set("refresh_token", refreshToken, {
          secure: process.env.NODE_ENV === "production",
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });
      }

      return user;
    } catch (err) {
      if (err instanceof GraphQLError || err instanceof UserInputError) {
        throw err;
      }
      console.error("Sign-in error:", err);
      throw new Error("Unable to sign in. Please try again.");
    }
  }

  @Mutation(() => Boolean)
  async signOut(@Ctx() context: ContextType): Promise<boolean> {
    const cookies = new Cookies(context.req, context.res);
    cookies.set("token", "", { maxAge: 0 });
    return true;
  }

  @Authorized()
  @Mutation(() => Profile)
  @UseMiddleware(ErrorCatcher)
  async updateUserProfile(
    @Arg("data", () => UserUpdateProfileInput) data: UserUpdateProfileInput,
    @Ctx() context: ContextType
  ): Promise<Profile> {
    if (!context.user?.id) {
      throw new GraphQLError("Non authentifié", {
        extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
      });
    }
    const user = await User.findOne({ where: { id: context.user.id } });
    if (!user) {
      throw new GraphQLError("Utilisateur introuvable", {
        extensions: { code: "USER_NOT_FOUND", http: { status: 404 } },
      });
    }
    user.firstname = data.firstname;
    user.lastname = data.lastname;
    let profile: Profile | null = null;
    await dataSource.manager.transaction(async () => {
      await user.save();
      profile = await Profile.findOne({ where: { id: user.id } });
      if (profile) {
        profile.firstname = user.firstname;
        profile.lastname = user.lastname;
        await profile.save();
      }
    });
    if (!profile) {
      throw new GraphQLError("Profil introuvable", {
        extensions: { code: "PROFILE_NOT_FOUND", http: { status: 404 } },
      });
    }
    return profile;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(ErrorCatcher)
  async forgotPassword(
    @Arg("data", () => ForgotPasswordInput) data: ForgotPasswordInput
  ): Promise<boolean> {
    const user = await User.findOne({ where: { email: data.email } });
    if (!user) {
      throw new GraphQLError("Utilisateur introuvable", {
        extensions: { code: "USER_NOT_FOUND", http: { status: 404 } },
      });
    }

    if (
      user.recoverSentAt &&
      user.recoverSentAt > new Date(Date.now() - 1000 * 60 * 60)
    ) {
      throw new GraphQLError("Email déjà envoyé", {
        extensions: { code: "EMAIL_ALREADY_SENT", http: { status: 400 } },
      });
    }

    const recoverToken = jsonwebtoken.sign(
      { id: user.id },
      process.env.JWT_SECRET_RECOVER_KEY,
      { expiresIn: "1h" }
    );

    user.recoverToken = recoverToken;
    user.recoverSentAt = new Date();
    await user.save();

    await sendRecoverEmail(user.email, recoverToken);

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(ErrorCatcher)
  async resetPassword(
    @Arg("data", () => ResetPasswordInput) data: ResetPasswordInput
  ): Promise<boolean> {
    if (data.password !== data.confirmPassword) {
      throw new GraphQLError("Les mots de passe ne correspondent pas", {
        extensions: { code: "PASSWORDS_DONT_MATCH", http: { status: 400 } },
      });
    }

    const decoded = jsonwebtoken.verify(
      data.token,
      process.env.JWT_SECRET_RECOVER_KEY
    ) as { id: number };

    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) {
      throw new GraphQLError("Utilisateur introuvable", {
        extensions: { code: "USER_NOT_FOUND", http: { status: 404 } },
      });
    }

    if (user.recoverToken !== data.token) {
      throw new GraphQLError("Token invalide", {
        extensions: { code: "INVALID_TOKEN", http: { status: 400 } },
      });
    }

    const hashedPassword = await hashPassword(data.password);
    user.password = hashedPassword;
    user.recoverToken = null;
    user.recoverSentAt = null;
    await user.save();

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(ErrorCatcher)
  async verifyResetToken(@Arg("token") token: string): Promise<boolean> {
    const decoded = jsonwebtoken.verify(
      token,
      process.env.JWT_SECRET_RECOVER_KEY
    ) as { id: number };

    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) {
      throw new GraphQLError("Utilisateur introuvable", {
        extensions: { code: "USER_NOT_FOUND", http: { status: 404 } },
      });
    }

    if (user.recoverToken !== token) {
      throw new GraphQLError("Token invalide", {
        extensions: { code: "INVALID_TOKEN", http: { status: 400 } },
      });
    }

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(ErrorCatcher)
  async verifyConfirmEmailToken(@Arg("token") token: string): Promise<boolean> {
    const decoded = jsonwebtoken.verify(
      token,
      process.env.JWT_SECRET_RECOVER_KEY
    ) as { id: number };

    const user = await User.findOne({ where: { id: decoded.id } });

    if (user?.emailVerifiedAt) {
      throw new GraphQLError("Email déjà validé", {
        extensions: { code: "EMAIL_ALREADY_VERIFIED", http: { status: 400 } },
      });
    }

    if (!user) {
      throw new GraphQLError("Utilisateur introuvable", {
        extensions: { code: "USER_NOT_FOUND", http: { status: 404 } },
      });
    }

    if (user.emailToken !== token) {
      throw new GraphQLError("Token invalide", {
        extensions: { code: "INVALID_TOKEN", http: { status: 400 } },
      });
    }

    user.emailToken = null;
    user.emailSentAt = null;
    user.emailVerifiedAt = new Date();
    await user.save();

    return true;
  }

  @Authorized(RoleType.admin, RoleType.user, RoleType.superadmin)
  @Mutation(() => Boolean)
  @UseMiddleware(ErrorCatcher)
  async changeEmail(
    @Ctx() context: AuthContextType,
    @Arg("data", () => ChangeEmailInput) data: ChangeEmailInput
  ): Promise<boolean> {
    const profileId = context.user.id;
    const user = await User.findOne({ where: { id: profileId } });

    if (!user) {
      throw new GraphQLError("Utilisateur introuvable", {
        extensions: { code: "USER_NOT_FOUND", http: { status: 404 } },
      });
    }

    const passwordMatch = await verifyPassword(user.password, data.password);

    if (!passwordMatch) {
      throw new GraphQLError("Mot de passe incorrect", {
        extensions: { code: "INVALID_PASSWORD", http: { status: 401 } },
      });
    }

    const existingUser = await User.findOne({
      where: { email: data.newEmail },
    });
    if (existingUser && existingUser.id !== user.id) {
      throw new GraphQLError("Cette adresse email est déjà utilisée", {
        extensions: { code: "EMAIL_ALREADY_EXIST", http: { status: 409 } },
      });
    }

    if (user.email === data.newEmail) {
      throw new GraphQLError(
        "La nouvelle adresse email est identique à l'actuelle",
        {
          extensions: { code: "SAME_EMAIL", http: { status: 400 } },
        }
      );
    }

    if (
      user.newEmailSentAt &&
      user.newEmailSentAt > new Date(Date.now() - 1000 * 60 * 15)
    ) {
      throw new GraphQLError("Un email de confirmation a déjà été envoyé", {
        extensions: { code: "EMAIL_ALREADY_SENT", http: { status: 400 } },
      });
    }

    const confirmToken = jsonwebtoken.sign(
      { id: user.id, newEmail: data.newEmail },
      process.env.JWT_SECRET_RECOVER_KEY,
      { expiresIn: "15m" }
    );

    user.newEmail = data.newEmail;
    user.newEmailToken = confirmToken;
    user.newEmailSentAt = new Date();
    await user.save();

    await sendConfirmNewEmail(data.newEmail, confirmToken);

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(ErrorCatcher)
  async confirmNewEmail(
    @Ctx() context: ContextType,
    @Arg("data", () => ConfirmNewEmailInput) data: ConfirmNewEmailInput
  ): Promise<boolean> {
    const decoded = jsonwebtoken.verify(
      data.token,
      process.env.JWT_SECRET_RECOVER_KEY
    ) as { id: number; newEmail: string };

    const user = await User.findOne({ where: { id: decoded.id } });
    if (!user) {
      throw new GraphQLError("Utilisateur introuvable", {
        extensions: { code: "USER_NOT_FOUND", http: { status: 404 } },
      });
    }

    if (user.newEmailToken !== data.token) {
      throw new GraphQLError("Token invalide", {
        extensions: { code: "INVALID_TOKEN", http: { status: 400 } },
      });
    }

    if (!user.newEmail || user.newEmail !== decoded.newEmail) {
      throw new GraphQLError("Adresse email invalide", {
        extensions: { code: "INVALID_EMAIL", http: { status: 400 } },
      });
    }

    const existingUser = await User.findOne({
      where: { email: user.newEmail },
    });
    if (existingUser && existingUser.id !== user.id) {
      throw new GraphQLError("Cette adresse email est déjà utilisée", {
        extensions: { code: "EMAIL_ALREADY_EXIST", http: { status: 409 } },
      });
    }

    await dataSource.manager.transaction(async () => {
      user.email = user.newEmail;
      user.newEmail = null;
      user.newEmailToken = null;
      user.newEmailSentAt = null;
      await user.save();

      const profile = await Profile.findOne({ where: { id: user.id } });
      if (profile) {
        profile.email = user.email;
        await profile.save();
      }
    });

    if (process.env.NODE_ENV !== "testing") {
      await UserToken.delete({ user: { id: user.id } });

      const token = jsonwebtoken.sign(
        { id: user.id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "3d" }
      );

      const refreshToken = jsonwebtoken.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET_KEY,
        { expiresIn: "7d" }
      );

      const userToken = new UserToken();
      userToken.token = token;
      userToken.refreshToken = refreshToken;
      userToken.user = user;
      await userToken.save();

      const cookies = new Cookies(context.req, context.res);
      cookies.set("token", token, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 3,
      });

      cookies.set("refresh_token", refreshToken, {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
    }

    return true;
  }
}
