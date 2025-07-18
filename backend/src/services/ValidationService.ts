import { User } from "@/entities/User";
import { GraphQLError } from "graphql";
import { Not } from "typeorm";

export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): void {
  if (password !== confirmPassword) {
    throw new GraphQLError("Passwords don't match", {
      extensions: {
        code: "PASSWORDS_DONT_MATCH",
        http: { status: 400 },
      },
    });
  }
}

export async function validateEmailNotExists(
  email: string,
  excludeUserId?: number
): Promise<void> {
  const whereCondition: any = { email };
  if (excludeUserId) {
    whereCondition.id = Not(excludeUserId);
  }

  const existingUser = await User.findOne({ where: whereCondition });
  if (existingUser) {
    throw new GraphQLError("Cette adresse email est déjà utilisée", {
      extensions: {
        code: "EMAIL_ALREADY_EXIST",
        http: { status: 409 },
      },
    });
  }
}

export function validateEmailNotSame(
  currentEmail: string,
  newEmail: string
): void {
  if (currentEmail === newEmail) {
    throw new GraphQLError(
      "La nouvelle adresse email est identique à l'actuelle",
      {
        extensions: { code: "SAME_EMAIL", http: { status: 400 } },
      }
    );
  }
}

export function validateEmailAlreadyVerified(emailVerifiedAt?: Date): void {
  if (emailVerifiedAt) {
    throw new GraphQLError("Email déjà validé", {
      extensions: { code: "EMAIL_ALREADY_VERIFIED", http: { status: 400 } },
    });
  }
}

export function validateEmailNotRecentlySent(
  emailSentAt?: Date,
  hoursLimit: number = 24
): void {
  if (
    emailSentAt &&
    emailSentAt > new Date(Date.now() - 1000 * 60 * 60 * hoursLimit)
  ) {
    throw new GraphQLError("Email déjà envoyé", {
      extensions: { code: "EMAIL_ALREADY_SENT", http: { status: 400 } },
    });
  }
}

export function validateRecoverEmailNotRecentlySent(
  recoverSentAt?: Date,
  hoursLimit: number = 1
): void {
  if (
    recoverSentAt &&
    recoverSentAt > new Date(Date.now() - 1000 * 60 * 60 * hoursLimit)
  ) {
    throw new GraphQLError("Email déjà envoyé", {
      extensions: { code: "EMAIL_ALREADY_SENT", http: { status: 400 } },
    });
  }
}

export function validateUserExists(
  user: User | null,
  type: "not_found" | "invalid_credentials" = "not_found"
): void {
  if (!user) {
    switch (type) {
      case "not_found":
        throw new GraphQLError("Utilisateur introuvable", {
          extensions: { code: "USER_NOT_FOUND", http: { status: 404 } },
        });
      case "invalid_credentials":
        throw new GraphQLError("Email ou mot de passe incorrect", {
          extensions: { code: "INVALID_CREDENTIALS", http: { status: 401 } },
        });
    }
  }
}

export function validateToken(token: string, expectedToken?: string): void {
  if (!expectedToken || token !== expectedToken) {
    throw new GraphQLError("Token invalide", {
      extensions: { code: "INVALID_TOKEN", http: { status: 400 } },
    });
  }
}

export function validateUserAuthenticated(userId?: number): void {
  if (!userId) {
    throw new GraphQLError("Non authentifié", {
      extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
    });
  }
}
