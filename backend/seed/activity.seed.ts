import { dataSource } from "../src/config/db";
import { Activity } from "../src/entities/Activity";
import { User } from "../src/entities/User";
import { normalizeString } from "../src/helpers/helpers";

export const seedActivities = async () => {
  const activityRepo = dataSource.getRepository(Activity);
  const userRepo = dataSource.getRepository(User);

  const adminUser = await userRepo.findOneBy({ email: "admin@peakrent.com" });
  if (!adminUser) {
    console.error("❌ Admin user not found. Please seed users first.");
    return;
  }

  const activities = [
    {
      name: "Ski Alpin",
      urlImage:
        "https://images.unsplash.com/photo-1649404173620-a2ca20fcd562?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNraSUyMGFscGlufGVufDB8fDB8fHww",
      variant: "blue",
    },
    {
      name: "Snowboard",
      urlImage:
        "https://plus.unsplash.com/premium_photo-1708834155836-4eec278332b6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c25vd2JvYXJkfGVufDB8fDB8fHww",
      variant: "orange",
    },
    {
      name: "Raquettes",
      urlImage:
        "https://images.unsplash.com/photo-1728081931259-093429cf8467?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHJhcXVldHRlc3xlbnwwfHwwfHx8MA%3D%3D",
      variant: "green",
    },
    {
      name: "Chaussures",
      urlImage:
        "https://images.unsplash.com/photo-1645999140947-db7546fecb30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2hhdXNzdXJlcyUyMGRlJTIwc2tpfGVufDB8fDB8fHww",
      variant: "red",
    },
    {
      name: "Vêtements",
      urlImage:
        "https://images.unsplash.com/photo-1701617012334-bb1302463c36?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHYlQzMlQUF0ZW1lbnQlMjBkZSUyMHNraXxlbnwwfHwwfHx8MA%3D%3D",
      variant: "yellow",
    },
    {
      name: "Vélos",
      urlImage:
        "https://images.unsplash.com/photo-1633707167682-9068729bc84c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8VlRUJTIwbW9udGFnbmV8ZW58MHx8MHx8fDA%3D",
      variant: "purple",
    },
    {
      name: "Randonnée",
      urlImage:
        "https://plus.unsplash.com/premium_photo-1661814278311-d59ab0b4a676?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmFuZG9ubiVDMyVBOWVzfGVufDB8fDB8fHww",
      variant: "pink",
    },
  ];

  for (const activity of activities) {
    const exists = await activityRepo.findOneBy({ name: activity.name });
    if (!exists) {
      const newActivity = activityRepo.create({
        name: activity.name,
        urlImage: activity.urlImage,
        variant: activity.variant,
        normalizedName: normalizeString(activity.name),
        createdBy: adminUser,
      });
      await activityRepo.save(newActivity);
    }
  }

  console.log("✅ Activities seeded.");
};
