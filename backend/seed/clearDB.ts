import { dataSource } from "../src/config/db";

(async () => {
  await dataSource.initialize();
  await dataSource.synchronize(true);
  console.log("✅ Database cleared and synchronized.");
  process.exit(0);
})();
