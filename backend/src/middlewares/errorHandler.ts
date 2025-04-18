import { GraphQLError } from "graphql";
import { MiddlewareFn } from "type-graphql";

export const ErrorCatcher: MiddlewareFn = async ({ info }, next) => {
  try {
    return await next();
  } catch (error) {
    console.error(
      `[GraphQL Error] ${info.parentType.name}.${info.fieldName}:`,
      error
    );

    if (error instanceof GraphQLError) {
      throw error;
    }

    throw new GraphQLError("Internal server error", {
      extensions: {
        code: "INTERNAL_SERVER_ERROR",
        http: { status: 500 },
      },
    });
  }
};
