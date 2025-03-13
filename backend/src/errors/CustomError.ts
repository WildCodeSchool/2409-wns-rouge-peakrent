import { GraphQLError } from "graphql";

export class CustomError extends GraphQLError {
  constructor(message: string, code: string) {
    super(message, {
      extensions: { code },
    });
  }
}
