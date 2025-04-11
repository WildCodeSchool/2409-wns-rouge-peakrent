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
      urlImage:
        "https://images.unsplash.com/photo-1649404173620-a2ca20fcd562?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNraSUyMGFscGlufGVufDB8fDB8fHww",
    },
    {
      name: "Snowboard",
      urlImage:
        "https://plus.unsplash.com/premium_photo-1708834155836-4eec278332b6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c25vd2JvYXJkfGVufDB8fDB8fHww",
    },
    {
      name: "Raquettes",
      urlImage:
        "https://images.unsplash.com/photo-1728081931259-093429cf8467?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHJhcXVldHRlc3xlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      name: "Chaussures",
      urlImage:
        "https://unsplash.com/fr/photos/une-paire-de-chaussures-de-ski-posee-dans-la-neige-NXTSa2L7xTs",
    },
    {
      name: "Vêtements",
      urlImage:
        "https://unsplash.com/fr/photos/personne-avec-des-skis-prete-pour-les-pistes-EqIbeYzpQus",
    },
    {
      name: "Vélos",
      urlImage:
        "https://images.unsplash.com/photo-1633707167682-9068729bc84c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8VlRUJTIwbW9udGFnbmV8ZW58MHx8MHx8fDA%3D",
    },
    {
      name: "Randonnée",
      urlImage:
        "https://plus.unsplash.com/premium_photo-1661814278311-d59ab0b4a676?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmFuZG9ubiVDMyVBOWVzfGVufDB8fDB8fHww",
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
