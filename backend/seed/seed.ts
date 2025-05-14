import { dataSource } from "../src/config/db";
import { seedCategories } from "./category.seed";
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
    await seedStores();
    await seedStoreVariant();
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error during seeding:", error);
    process.exit(1);
  });
