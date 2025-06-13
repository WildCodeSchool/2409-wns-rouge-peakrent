import { dataSource } from "../src/config/db";
import { seedActivities } from "./activity.seed";
import { seedCategories } from "./category.seed";
import { seedOrders } from "./order.seed";
import { seedOrderItems } from "./orderItem.seed";
import { seedProducts } from "./product.seed";
import { seedStores } from "./store.seed";
import { seedStoreVariant } from "./storeVariant.seed";
import { seedUsers } from "./user.seed";
import { seedVariants } from "./variant.seed";

dataSource
  .initialize()
  .then(async () => {
    await seedUsers();
    await seedCategories();
    await seedProducts();
    await seedVariants();
    await seedActivities();
    await seedStores();
    await seedStoreVariant();
    await seedOrders();
    await seedOrderItems();
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error during seeding:", error);
    process.exit(1);
  });
