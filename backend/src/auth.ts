import { AuthChecker } from "type-graphql";
import { ContextType } from "./types";

export const authChecker: AuthChecker<ContextType> = async (
  { context },
  roles
) => {
  // @Authorized(["admin", "user"]) → roles = ["admin", "user"]
  // @Authorized() → roles = []
  // if the roles are omitted, should be consider as an admin autorization → least privileges security concern
  if (roles.length === 0) {
    roles = ["admin", "superadmin"];
  }

  // user has already been put in context (if found) by the global middleware (see index.ts)
  const user = context.user;
  if (user && roles.includes(user.role)) {
    return true;
  } else {
    return false;
  }
};
