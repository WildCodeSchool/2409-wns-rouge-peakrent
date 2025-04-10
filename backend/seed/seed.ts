import { dataSource } from "../src/config/db";
import { seedUsers } from "./user.seed";
import { seedProducts } from "./product.seed";
import { seedCategories } from "./category.seed";
import { seedVariants } from "./variant.seed";

dataSource
  .initialize()
  .then(async () => {
    await seedUsers();
    await seedCategories();
    await seedProducts();
    await seedVariants();
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error during seeding:", error);
    process.exit(1);
  });
