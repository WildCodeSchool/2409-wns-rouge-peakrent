import { buildSchema } from "type-graphql";
import { authChecker } from "./auth";
import { ActivityResolver } from "./resolvers/Activities";
import { CartResolver } from "./resolvers/Cart";
import { CategoryResolver } from "./resolvers/Categories";
import { OrderResolver } from "./resolvers/Order";
import { OrderItemsResolver } from "./resolvers/OrderItems";
import { ProductResolver } from "./resolvers/Products";
import { ProfileResolver } from "./resolvers/Profiles";
import { SearchResolver } from "./resolvers/Searchs";
import { StoreResolver } from "./resolvers/Stores";
import { StoreVariantResolver } from "./resolvers/StoresVariants";
import { UserResolver } from "./resolvers/Users";
import { VariantResolver } from "./resolvers/Variants";
import { ActivityResolverAdmin } from "./resolvers/admin/Activities";
import { CartResolverAdmin } from "./resolvers/admin/Cart";
import { CategoryResolverAdmin } from "./resolvers/admin/Categories";
import { OrderResolverAdmin } from "./resolvers/admin/Order";
import { OrderItemsResolverAdmin } from "./resolvers/admin/OrderItems";
import { ProductResolverAdmin } from "./resolvers/admin/Products";
import { ProfileResolverAdmin } from "./resolvers/admin/Profiles";
import { StoreResolverAdmin } from "./resolvers/admin/Stores";
import { StoreVariantResolverAdmin } from "./resolvers/admin/StoresVariants";
import { UserResolverAdmin } from "./resolvers/admin/Users";

export async function getSchema() {
  // Admin resolvers
  const adminResolvers = [
    ActivityResolverAdmin,
    CartResolverAdmin,
    CategoryResolverAdmin,
    OrderResolverAdmin,
    OrderItemsResolverAdmin,
    ProductResolverAdmin,
    ProfileResolverAdmin,
    StoreResolverAdmin,
    UserResolverAdmin,
    StoreVariantResolverAdmin,
  ];

  const schema = await buildSchema({
    resolvers: [
      ActivityResolver,
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
      ...adminResolvers,
    ],
    authChecker,
    validate: true,
  });

  return schema;
}
