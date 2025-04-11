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
        "https://www.google.com/imgres?q=chaussure%20ski&imgurl=https%3A%2F%2Fwww.montisport.fr%2F62472-large_default%2Fchaussures-ski-homme-head-edge-80-hv.jpg&imgrefurl=https%3A%2F%2Fwww.montisport.fr%2Fchaussures-de-ski%2F26837-chaussures-ski-homme-head-edge-80-hv.html&docid=l2gV6564f6FimM&tbnid=0ODzRWUJg1XE-M&vet=12ahUKEwi56rqoh9CMAxU2KvsDHWKeBaEQM3oECFMQAA..i&w=800&h=800&hcb=2&ved=2ahUKEwi56rqoh9CMAxU2KvsDHWKeBaEQM3oECFMQAA",
    },
    {
      name: "Vêtements",
      urlImage:
        "https://www.google.com/imgres?q=vetement%20sport%20ski&imgurl=https%3A%2F%2Fwww.ridestore.com%2Fimages%2FH2699_01_THok4D3.jpg%3Fw%3D188%26dpr%3D2&imgrefurl=https%3A%2F%2Fwww.ridestore.com%2Ffr%2Fvetements-ski-femme&docid=MXB_9Z1kz6AdQM&tbnid=8tKM451PA4Hh_M&vet=12ahUKEwjNzLDdh9CMAxWsQ6QEHSGwA7s4FBAzegQIcxAA..i&w=376&h=442&hcb=2&ved=2ahUKEwjNzLDdh9CMAxWsQ6QEHSGwA7s4FBAzegQIcxAA",
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
