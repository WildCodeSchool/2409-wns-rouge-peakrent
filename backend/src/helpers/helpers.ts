import * as argon2 from "argon2";
import Cookies from "cookies";
import * as jsonwebtoken from "jsonwebtoken";
import { Profile } from "../entities/Profile";
import { ContextType } from "../types";

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
    .trim();

  return cleanedStr.toLowerCase();
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
    console.log("User found:", user);

    return user;
  } catch {
    console.log("Invalid token");
    return null;
  }
};

// export const hasRole = (
//   user: AuthContextType["user"],
//   roles: Role[]
// ): boolean => {
//   return roles.includes(user.role);
// };
