import { GraphQLFormattedError } from "graphql";

export function findErrorWithCode(
  errors: readonly GraphQLFormattedError[],
  expectedCode: string
) {
  return errors.find((error) => error.extensions?.code === expectedCode);
}
