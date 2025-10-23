import { dataSource } from "../config/db";
import { QueryRunner } from "typeorm";

import { seedUsers } from "../../seed/user.seed";
import { seedActivities } from "../../seed/activity.seed";
import { seedCategories } from "../../seed/category.seed";
import { seedProducts } from "../../seed/product.seed";
import { seedVariants } from "../../seed/variant.seed";
import { seedStores } from "../../seed/store.seed";
import { seedStoreVariant } from "../../seed/storeVariant.seed";
import { seedOrders } from "../../seed/order.seed";
import { seedOrderItems } from "../../seed/orderItem.seed";

export async function resetAndSeedTestData() {
  if (!dataSource.isInitialized) await dataSource.initialize();

  const qr: QueryRunner = dataSource.createQueryRunner();
  await qr.connect();

  try {
    await qr.startTransaction();

    const tableNames = dataSource.entityMetadatas
      .map((m) => m.tableName)
      .filter((t) => t !== "_migrations");

    if (tableNames.length) {
      const quoted = tableNames.map((t) => `"${t}"`).join(", ");
      await qr.query(`TRUNCATE ${quoted} RESTART IDENTITY CASCADE;`);
    }

    await qr.commitTransaction();

    await seedUsers();
    await seedActivities();
    await seedCategories();
    await seedProducts();
    await seedVariants();
    await seedStores();
    await seedStoreVariant();
    await seedOrders();
    await seedOrderItems();

    return { ok: true };
  } catch (e) {
    try {
      await qr.rollbackTransaction();
    } catch {}
    throw e;
  } finally {
    try {
      await qr.release();
    } catch {}
  }
}
