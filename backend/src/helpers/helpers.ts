import { Profile } from "@/entities/Profile";
import { ContextType } from "@/types";
import * as argon2 from "argon2";
import Cookies from "cookies";
import * as jsonwebtoken from "jsonwebtoken";
import crypto, { randomUUID } from "crypto";
import { User } from "@/entities/User";
import { dataSource } from "@/config/db";

export const formattedDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const formattedDate = `${year}` + "-" + `${month}` + "-" + `${day}`;
  return formattedDate;
};

export const normalizeString = (string: string) => {
  const normalizedStr = string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const cleanedStr = normalizedStr
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/[ªº]/g, "")
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'")
    .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"')
    .replace(/[^\w\s-]/g, "")
    .replace(/[_\s]+/g, "-")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim();

  return cleanedStr.toLowerCase();
};

export const secureHash = (input: string): string => {
  const SECRET_KEY = process.env.EMAIL_HASH_SECRET;
  return crypto.createHmac("sha256", SECRET_KEY).update(input).digest("hex");
};

export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await argon2.hash(password);
  } catch (err) {
    console.error("Error hashing password:", err);
    throw new Error("Password hashing failed.");
  }
};

export const verifyPassword = async (
  hash: string,
  password: string
): Promise<boolean> => {
  try {
    return await argon2.verify(hash, password);
  } catch (err) {
    console.error("Error verifying password:", err);
    throw new Error("Password verification failed.");
  }
};

export const getUserFromContext = async (
  context: ContextType
): Promise<Profile | null> => {
  const cookies = new Cookies(context.req, context.res);
  const token = cookies.get("token");

  if (!token) {
    console.log("No token, Access denied");
    return null;
  }
  try {
    const payload = jsonwebtoken.verify(
      token,
      process.env.JWT_SECRET_KEY
    ) as unknown as {
      id: number;
      iat: Date;
    };
    console.log("Access authorized");

    const user = await Profile.findOneBy({ id: payload.id });

    return user;
  } catch {
    console.log("Invalid token");
    return null;
  }
};

export const getUserAndProfile = async (
  userId: number
): Promise<{ user: User; profile: Profile }> => {
  const profileRepository = dataSource.getRepository(Profile);
  const userRepository = dataSource.getRepository(User);

  const profile = await profileRepository.findOne({
    where: { id: userId },
    relations: ["user"],
  });
  if (!profile) throw new Error("Profile not found");

  const user = await userRepository.findOne({
    where: { id: profile.id },
  });
  if (!user) throw new Error("User not found");

  return { user, profile };
};

export const randomizeProfileAndUser = async (
  profile: Profile,
  user: User
): Promise<void> => {
  const email = randomUUID();
  const firstname = randomUUID();
  const lastname = randomUUID();

  profile.email = email;
  profile.firstname = firstname;
  profile.lastname = lastname;
  profile.deletedAt = new Date();

  user.email = email;
  user.firstname = firstname;
  user.lastname = lastname;
  user.password = randomUUID();
  user.deletedAt = new Date();

  await dataSource.getRepository(Profile).save(profile);
  await dataSource.getRepository(User).save(user);
};

export const anonymizeProfileAndUser = async (
  profile: Profile,
  user: User
): Promise<void> => {
  profile.email = secureHash(profile.email);
  profile.firstname = "DELETED";
  profile.lastname = "DELETED";
  profile.deletedAt = new Date();

  user.email = secureHash(user.email);
  user.firstname = "DELETED";
  user.lastname = "DELETED";
  user.deletedAt = new Date();

  await dataSource.getRepository(Profile).save(profile);
  await dataSource.getRepository(User).save(user);
};

// export const hasRole = (
//   user: AuthContextType["user"],
//   roles: Role[]
// ): boolean => {
//   return roles.includes(user.role);
// };
