import { Profile } from "@/entities/Profile";
import { ContextType } from "@/types";
import * as argon2 from "argon2";
import Cookies from "cookies";
import { GraphQLError } from "graphql";
import * as jsonwebtoken from "jsonwebtoken";

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

export const hashPassword = async (password: string): Promise<string> => {
  try {
    return await argon2.hash(password);
  } catch (err) {
    console.error("Error hashing password:", err);
    throw new GraphQLError(
      "Une erreur est survenue lors de la création du mot de passe",
      {
        extensions: {
          code: "PASSWORD_HASHING_FAILED",
          http: { status: 500 },
        },
      }
    );
  }
};

export const verifyPassword = async (
  hash: string,
  password: string,
  type: "sign_in" | "change_password" = "sign_in"
): Promise<void> => {
  try {
    const isValid = await argon2.verify(hash, password);
    if (!isValid) {
      throw new GraphQLError(
        type === "sign_in"
          ? "Email ou mot de passe incorrect"
          : "Mot de passe actuel incorrect",
        {
          extensions: {
            code: "INVALID_CREDENTIALS",
            http: { status: 401 },
          },
        }
      );
    }
  } catch (err) {
    console.error("Error verifying password:", err);
    throw new GraphQLError("Email ou mot de passe incorrect", {
      extensions: {
        code: "INVALID_CREDENTIALS",
        http: { status: 401 },
      },
    });
  }
};

export const getUserFromContext = async (
  context: ContextType
): Promise<Profile | null> => {
  const cookies = new Cookies(context.req, context.res);
  const token = cookies.get("token");

  if (!token) {
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

    const user = await Profile.findOneBy({ id: payload.id });

    return user;
  } catch {
    return null;
  }
};

// export const hasRole = (
//   user: AuthContextType["user"],
//   roles: Role[]
// ): boolean => {
//   return roles.includes(user.role);
// };
