import { dataSource } from "../src/config/db";
import { Store } from "../src/entities/Store";

export const seedStores = async () => {
  const storeRepo = dataSource.getRepository(Store);

  const stores = [
    {
      name: "Altitude 360",
      phoneNumber: "0600000000",
      address1: "12 Rue des Cimes",
      address2: "Bâtiment A, 2ème étage",
      city: "Grenoble",
      zipCode: "38000",
      country: "France",
      reference: "ALT360-GRE-001",
    },
  ];

  for (const store of stores) {
    const exists = await storeRepo.findOne({ where: { name: store.name } });
    if (!exists) {
      const newStore = storeRepo.create({
        ...store,
      });
      await storeRepo.save(newStore);
    }
  }

  console.log("✅ Stores seeded.");
};
