import { GraphQLError } from "graphql";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

/**
 * Verifies a JWT token using the provided secret.
 *
 * Throws a GraphQLError with a specific message and code if the token is expired, invalid, or if another validation error occurs.
 *
 * @throws {GraphQLError} Throws with code 'TOKEN_EXPIRED' if the token is expired, 'INVALID_TOKEN' if the token is invalid, or 'TOKEN_VALIDATION_ERROR' for other errors.
 *
 * @param token - The JWT token to verify.
 * @param secret - The secret used to verify the token. Defaults to JWT_SECRET_RECOVER_KEY environment variable.
 * @returns The decoded payload of the token.
 *
 * @example
 * try {
 *   const payload = verifyToken(token, secret);
 *   // Use payload
 * } catch (error) {
 *   // Handle GraphQLError
 * }
 */
export function verifyToken(
  token: string,
  secret: string = process.env.JWT_SECRET_RECOVER_KEY!
) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new GraphQLError("Le token a expiré", {
        extensions: { code: "TOKEN_EXPIRED", http: { status: 401 } },
      });
    } else if (error instanceof JsonWebTokenError) {
      throw new GraphQLError("Le token est invalide", {
        extensions: { code: "INVALID_TOKEN", http: { status: 400 } },
      });
    } else {
      throw new GraphQLError("Erreur de validation du token", {
        extensions: { code: "TOKEN_VALIDATION_ERROR", http: { status: 500 } },
      });
    }
  }
}
