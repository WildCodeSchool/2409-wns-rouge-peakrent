import { dataSource } from "@/config/db";
import { Profile } from "@/entities/Profile";
import {
  ChangeEmailInput,
  ChangePasswordInput,
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
import {
  cleanupUserTokens,
  clearCookies,
  generateAccessToken,
  generateEmailChangeToken,
  generateEmailToken,
  generateRecoverToken,
  generateRefreshToken,
  saveUserToken,
  setCookies,
  verifyToken,
} from "@/services/TokenService";
import {
  validateEmailAlreadyVerified,
  validateEmailNotExists,
  validateEmailNotRecentlySent,
  validateEmailNotSame,
  validatePasswordMatch,
  validateRecoverEmailNotRecentlySent,
  validateToken,
  validateUserExists,
} from "@/services/ValidationService";
import { AuthContextType, ContextType, RoleType } from "@/types";
import { UserInputError } from "apollo-server-errors";
import * as argon2 from "argon2";
import { ValidationError } from "class-validator";
import { GraphQLError } from "graphql";
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
    validatePasswordMatch(data.password, data.confirmPassword);

    await validateInput(data);

    await validateEmailNotExists(data.email);

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
        const confirmToken = generateEmailToken(newUser.id);
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

      validateUserExists(user, "invalid_credentials");

      await verifyPassword(user.password, password);

      if (!user.emailVerifiedAt) {
        validateEmailNotRecentlySent(user.emailSentAt);
        const confirmToken = generateEmailToken(user.id);
        user.emailToken = confirmToken;
        user.emailSentAt = new Date();
        await sendConfirmEmail(user.email, confirmToken);
        await user.save();
        throw new GraphQLError("Email not verified", {
          extensions: { code: "EMAIL_NOT_VERIFIED", http: { status: 401 } },
        });
      }

      const token = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      await saveUserToken(user, token, refreshToken);

      setCookies(context, token, refreshToken);

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
    clearCookies(context);
    return true;
  }

  @Authorized(RoleType.admin, RoleType.user, RoleType.superadmin)
  @Mutation(() => Profile)
  @UseMiddleware(ErrorCatcher)
  async updateUserProfile(
    @Arg("data", () => UserUpdateProfileInput) data: UserUpdateProfileInput,
    @Ctx() context: AuthContextType
  ): Promise<Profile> {
    const user = await User.findOne({ where: { id: context.user.id } });

    validateUserExists(user);

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
    validateUserExists(user);

    validateRecoverEmailNotRecentlySent(user.recoverSentAt);

    const recoverToken = generateRecoverToken(user.id);

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
    validatePasswordMatch(data.password, data.confirmPassword);

    const decoded = verifyToken(
      data.token,
      process.env.JWT_SECRET_RECOVER_KEY
    ) as { id: number };

    const user = await User.findOne({ where: { id: decoded.id } });
    validateUserExists(user);

    validateToken(user.recoverToken, data.token);

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
    const decoded = verifyToken(token, process.env.JWT_SECRET_RECOVER_KEY) as {
      id: number;
    };

    const user = await User.findOne({ where: { id: decoded.id } });
    validateUserExists(user);

    validateToken(user.recoverToken, token);

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(ErrorCatcher)
  async verifyConfirmEmailToken(@Arg("token") token: string): Promise<boolean> {
    const decoded = verifyToken(token, process.env.JWT_SECRET_RECOVER_KEY) as {
      id: number;
    };

    const user = await User.findOne({ where: { id: decoded.id } });

    validateUserExists(user);
    validateEmailAlreadyVerified(user?.emailVerifiedAt);
    validateToken(user.emailToken, token);

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

    validateUserExists(user);

    await verifyPassword(user.password, data.password);

    const existingUser = await User.findOne({
      where: { email: data.newEmail },
    });
    if (existingUser && existingUser.id !== user.id) {
      throw new GraphQLError("Cette adresse email est déjà utilisée", {
        extensions: { code: "EMAIL_ALREADY_EXIST", http: { status: 409 } },
      });
    }

    validateEmailNotSame(user.email, data.newEmail);

    validateEmailNotRecentlySent(user.newEmailSentAt);

    const confirmToken = generateEmailChangeToken(user.id, data.newEmail);

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
    const decoded = verifyToken(
      data.token,
      process.env.JWT_SECRET_RECOVER_KEY
    ) as { id: number; newEmail: string };

    const user = await User.findOne({ where: { id: decoded.id } });
    validateUserExists(user);

    validateToken(user.newEmailToken, data.token);

    if (!user.newEmail || user.newEmail !== decoded.newEmail) {
      throw new GraphQLError("Adresse email invalide", {
        extensions: { code: "INVALID_EMAIL", http: { status: 400 } },
      });
    }

    await validateEmailNotExists(user.newEmail, user.id);

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

      const token = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);

      await saveUserToken(user, token, refreshToken);
      setCookies(context, token, refreshToken);
    }

    return true;
  }

  @Authorized(RoleType.admin, RoleType.user, RoleType.superadmin)
  @Mutation(() => Boolean)
  @UseMiddleware(ErrorCatcher)
  async changePassword(
    @Ctx() context: AuthContextType,
    @Arg("data", () => ChangePasswordInput) data: ChangePasswordInput
  ): Promise<boolean> {
    const profileId = context.user.id;
    const user = await User.findOne({ where: { id: profileId } });

    validateUserExists(user);

    await verifyPassword(
      user.password,
      data.currentPassword,
      "change_password"
    );

    if (data.newPassword !== data.confirmNewPassword) {
      throw new GraphQLError(
        "Les nouveaux mots de passe ne correspondent pas",
        {
          extensions: { code: "PASSWORDS_DONT_MATCH", http: { status: 400 } },
        }
      );
    }

    const newPasswordMatch = await argon2.verify(
      user.password,
      data.newPassword
    );

    if (newPasswordMatch) {
      throw new GraphQLError(
        "Le nouveau mot de passe doit être différent de l'actuel",
        {
          extensions: { code: "SAME_PASSWORD", http: { status: 400 } },
        }
      );
    }

    const hashedNewPassword = await hashPassword(data.newPassword);
    user.password = hashedNewPassword;
    await user.save();

    if (process.env.NODE_ENV !== "testing") {
      await cleanupUserTokens(user.id, context);
    }

    return true;
  }
}
