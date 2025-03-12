import { buildSchema } from "type-graphql";
import { authChecker } from "./auth";
import { CategoryResolver } from "./resolver/Categories";
import { ProductResolver } from "./resolver/Products";
import { ProfileResolver } from "./resolver/Profiles";
import { SearchResolver } from "./resolver/Searchs";
import { UserResolver } from "./resolver/Users";
import { VariantResolver } from "./resolver/Variants";

export async function getSchema() {
  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      ProfileResolver,
      CategoryResolver,
      ProductResolver,
      SearchResolver,
      VariantResolver,
    ],
    authChecker,
  });

  return schema;
}
