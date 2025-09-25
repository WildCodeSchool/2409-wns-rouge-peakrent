import { User } from "@/entities/User";
import { UserToken } from "@/entities/UserToken";
import { ContextType } from "@/types";
import Cookies from "cookies";
import * as jsonwebtoken from "jsonwebtoken";
import { Not } from "typeorm";

export function generateAccessToken(userId: number): string {
  return jsonwebtoken.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "3d",
  });
}

export function generateRefreshToken(userId: number): string {
  return jsonwebtoken.sign({ id: userId }, process.env.JWT_REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });
}

export function generateEmailToken(userId: number): string {
  return jsonwebtoken.sign({ id: userId }, process.env.JWT_SECRET_RECOVER_KEY, {
    expiresIn: "24h",
  });
}

export function generateEmailChangeToken(
  userId: number,
  newEmail: string
): string {
  return jsonwebtoken.sign(
    { id: userId, newEmail },
    process.env.JWT_SECRET_RECOVER_KEY,
    { expiresIn: "15m" }
  );
}

export function generateRecoverToken(userId: number): string {
  return jsonwebtoken.sign({ id: userId }, process.env.JWT_SECRET_RECOVER_KEY, {
    expiresIn: "1h",
  });
}

export function verifyToken(token: string, secret: string): any {
  try {
    return jsonwebtoken.verify(token, secret);
  } catch {
    throw new Error("Invalid token");
  }
}

export async function saveUserToken(
  user: User,
  accessToken: string,
  refreshToken: string
): Promise<UserToken> {
  const userToken = new UserToken();
  userToken.token = accessToken;
  userToken.refreshToken = refreshToken;
  userToken.user = user;
  await userToken.save();
  return userToken;
}

export async function cleanupUserTokens(
  userId: number,
  context: ContextType,
  keepCurrentToken: boolean = true
): Promise<void> {
  if (keepCurrentToken) {
    const cookies = new Cookies(context.req, context.res);
    const currentToken = cookies.get("token");

    if (currentToken) {
      await UserToken.delete({
        user: { id: userId },
        token: Not(currentToken),
      });
    } else {
      await UserToken.delete({ user: { id: userId } });
    }
  } else {
    await UserToken.delete({ user: { id: userId } });
  }
}

export function setCookies(
  context: ContextType,
  accessToken: string,
  refreshToken: string
): void {
  if (process.env.NODE_ENV === "testing") return;

  const cookies = new Cookies(context.req, context.res);
  cookies.set("token", accessToken, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 3, // 3 days
  });

  cookies.set("refresh_token", refreshToken, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
}

export function clearCookies(context: ContextType): void {
  const cookies = new Cookies(context.req, context.res);
  cookies.set("token", "", { maxAge: 0 });
  cookies.set("refresh_token", "", { maxAge: 0 });
}
