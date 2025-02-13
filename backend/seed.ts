import { dataSource } from "./src/config/db"; // your TypeORM DataSource
import * as fs from "fs";
import * as path from "path";

async function seedDatabase() {
  // 1) Initialize the data source (this runs migrations if `migrationsRun` is true)
  // const dataSource = await AppDataSource.initialize();

  // 2) Check if data already exists
  const [{ count }] = await dataSource.query(
    "SELECT COUNT(*) as count FROM ad;"
  );
  if (parseInt(count, 10) > 10) {
    console.log("-----------------", parseInt(count, 10));
    console.log("Database already has data. Skipping seeding.");
    return;
  }

  // 3) Load and execute your seed SQL
  const seedFilePath = path.join(__dirname, "seed.sql");
  const seedSql = fs.readFileSync(seedFilePath, "utf-8");
  await dataSource.query(seedSql);

  console.log("Database seeded successfully.");
  await dataSource.destroy();
}

seedDatabase().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
