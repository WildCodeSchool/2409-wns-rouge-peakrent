import { buildSchema } from "type-graphql";
import { authChecker } from "./auth";
import { ActivityResolver } from "./resolver/Activities";
import { CartResolver } from "./resolver/Cart";
import { CategoryResolver } from "./resolver/Categories";
import { OrderResolver } from "./resolver/Order";
import { OrderItemsResolver } from "./resolver/OrderItems";
import { ProductResolver } from "./resolver/Products";
import { ProfileResolver } from "./resolver/Profiles";
import { SearchResolver } from "./resolver/Searchs";
import { StoreResolver } from "./resolver/Stores";
import { StoreVariantResolver } from "./resolver/StoresVariants";
import { UserResolver } from "./resolver/Users";
import { VariantResolver } from "./resolver/Variants";

export async function getSchema() {
  const schema = await buildSchema({
    resolvers: [
      CartResolver,
      CategoryResolver,
      OrderResolver,
      OrderItemsResolver,
      ProductResolver,
      ProfileResolver,
      SearchResolver,
      StoreResolver,
      StoreVariantResolver,
      UserResolver,
      VariantResolver,
      ActivityResolver,
    ],
    authChecker,
    validate: true,
  });

  return schema;
}
