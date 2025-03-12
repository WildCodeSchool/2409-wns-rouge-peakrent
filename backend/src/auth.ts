import { AuthChecker } from "type-graphql";
import { AuthContextType } from "./types";
import { getUserFromContext } from "./helpers/helpers";

export const authChecker: AuthChecker<AuthContextType> = async (
  { root, args, context, info },
  roles
) => {
  // @Authorized(["admin", "user"]) → roles = ["admin", "user"]
  // @Authorized() → roles = []

  const user = await getUserFromContext(context);
  context.user = user;
  if(user && (user.role === "admin" || roles.includes(user.role))) {
    return true;
  } else {
    return false;
  }
};
