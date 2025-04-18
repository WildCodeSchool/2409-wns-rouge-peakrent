import { dataSource } from "../src/config/db";
import { Store } from "../src/entities/Store";
import { StoreVariant } from "../src/entities/StoreVariant";
import { Variant } from "../src/entities/Variant";

export const seedStoreVariant = async () => {
  const storeVariantRepo = dataSource.getRepository(StoreVariant);
  const storeRepo = dataSource.getRepository(Store);
  const variantRepo = dataSource.getRepository(Variant);

  const storeVariants = [
    {
      variantId: 1,
      storeId: 1,
      quantity: 1,
    },
    {
      variantId: 2,
      storeId: 1,
      quantity: 100,
    },
    {
      variantId: 3,
      storeId: 1,
      quantity: 150,
    },
  ];

  for (const storeVariant of storeVariants) {
    const variant = await variantRepo.findOne({
      where: { id: storeVariant.variantId },
    });
    const store = await storeRepo.findOne({
      where: { id: storeVariant.storeId },
    });
    if (!variant) {
      console.warn(
        `⚠️ Variant not found for variantId ${storeVariant.variantId}. Skipping storeVariant.`
      );
      continue;
    }
    if (!store) {
      console.warn(
        `⚠️ Variant not found for storeId ${storeVariant.storeId}. Skipping storeVariant.`
      );
      continue;
    }
    const exists = await storeVariantRepo.findOne({
      where: {
        variantId: storeVariant.variantId,
        storeId: storeVariant.storeId,
      },
    });
    if (!exists) {
      const newStoreVariant = storeVariantRepo.create({
        ...storeVariant,
      });
      await storeVariantRepo.save(newStoreVariant);
    }
  }

  console.log("✅ Stores seeded.");
};
