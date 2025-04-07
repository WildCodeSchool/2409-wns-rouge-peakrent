// seed/seed.ts
import "reflect-metadata";
import { dataSource } from "../src/config/db";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

async function seedDatabase() {
  try {
    await dataSource.initialize();

    const seedFilePath = path.join(__dirname, "seed.sql");
    if (!fs.existsSync(seedFilePath)) {
      throw new Error("❌ seed.sql file not found");
    }

    const seedSql = fs.readFileSync(seedFilePath, "utf-8");
    await dataSource.query(seedSql);

    console.log("✅ Database seeded successfully using seed.sql");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await dataSource.destroy();
  }
}

seedDatabase();
