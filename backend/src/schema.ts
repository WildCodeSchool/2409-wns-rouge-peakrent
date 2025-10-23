import { buildSchema } from "type-graphql";
import { authChecker } from "./auth";
import { ErrorCatcher } from "./middlewares/errorHandler";
import { ActivityResolver } from "./resolvers/Activities";
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
import { VariantResolverAdmin } from "./resolvers/admin/Variants";
import { CartResolver } from "./resolvers/Cart";
import { CartVoucherResolver } from "./resolvers/CartVoucher";
import { CategoryResolver } from "./resolvers/Categories";
import { OrderResolver } from "./resolvers/Order";
import { OrderItemsResolver } from "./resolvers/OrderItems";
import { PaymentResolver } from "./resolvers/Payments";
import { ProductResolver } from "./resolvers/Products";
import { ProfileResolver } from "./resolvers/Profiles";
import { SearchResolver } from "./resolvers/Searchs";
import { StoreResolver } from "./resolvers/Stores";
import { StoreVariantResolver } from "./resolvers/StoresVariants";
import { UserResolver } from "./resolvers/Users";
import { VariantResolver } from "./resolvers/Variants";
import { VoucherResolverAdmin } from "./resolvers/Vouchers";

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
    VariantResolverAdmin,
    PaymentResolver,
    VoucherResolverAdmin,
  ];

  const testResolvers =
    process.env.NODE_ENV === "dev"
      ? [(await import("./resolvers/admin/TestResolver")).TestResolver]
      : [];

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
      CartVoucherResolver,
      ...adminResolvers,
      ...testResolvers,
    ],
    authChecker,
    validate: true,
    globalMiddlewares: [ErrorCatcher],
  });

  return schema;
}
