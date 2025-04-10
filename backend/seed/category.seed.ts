import { dataSource } from "../src/config/db";
import { Category } from "../src/entities/Category";
import { User } from "../src/entities/User";
import { normalizeString } from "../src/helpers/helpers";

export const seedCategories = async () => {
  const categoryRepo = dataSource.getRepository(Category);
  const userRepo = dataSource.getRepository(User);

  const adminUser = await userRepo.findOneBy({ email: "admin@peakrent.com" });
  if (!adminUser) {
    console.error("❌ Admin user not found. Please seed users first.");
    return;
  }

  const categories = [
    {
      name: "Ski Alpin",
      urlImage: "https://example.com/images/ski-alpin.jpg",
    },
    {
      name: "Snowboard",
      urlImage: "https://example.com/images/snowboard.jpg",
    },
    {
      name: "Raquettes",
      urlImage: "https://example.com/images/raquettes.jpg",
    },
    {
      name: "Chaussures",
      urlImage: "https://example.com/images/chaussures.jpg",
    },
    {
      name: "Vêtements",
      urlImage: "https://example.com/images/vetements.jpg",
    },
  ];

  for (const category of categories) {
    const exists = await categoryRepo.findOneBy({ name: category.name });
    if (!exists) {
      const newCategory = categoryRepo.create({
        ...category,
        normalizedName: normalizeString(category.name),
        createdBy: adminUser,
      });
      await categoryRepo.save(newCategory);
    }
  }

  console.log("✅ Categories seeded.");
};
