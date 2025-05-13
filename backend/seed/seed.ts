import { dataSource } from "../src/config/db";
import { seedActivities } from "./activity.seed";
import { seedCategories } from "./category.seed";
import { seedProducts } from "./product.seed";
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
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error during seeding:", error);
    process.exit(1);
  });
