import { AuthChecker } from "type-graphql";
import { getUserFromContext } from "./helpers/helpers";
import { AuthContextType } from "./types";

export const authChecker: AuthChecker<AuthContextType> = async (
  { root, args, context, info },
  roles
) => {
  // @Authorized(["admin", "user"]) → roles = ["admin", "user"]
  // @Authorized() → roles = []

  const user = await getUserFromContext(context);
  context.user = user;
  if (user /** && has user the good role? */) {
    return true;
  } else {
    return false;
  }
};
