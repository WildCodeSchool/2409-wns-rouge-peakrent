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
      description:
        "Glissez sur les pistes avec notre sélection de skis alpins pour tous niveaux. Performance, confort et sensations fortes garanties pour des journées inoubliables à la montagne !",
      urlImage:
        "https://images.unsplash.com/photo-1649404173620-a2ca20fcd562?w=1920&auto=format&fit=crop&q=85&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNraSUyMGFscGlufGVufDB8fDB8fHww",
      variant: "lime",
    },
    {
      name: "Snowboard",
      description:
        "Envie de rider avec style ? Découvrez nos snowboards dernière génération et nos conseils experts pour dévaler les pentes en toute liberté. Plaisir et adrénaline au rendez-vous !",
      urlImage:
        "https://plus.unsplash.com/premium_photo-1708834155836-4eec278332b6?w=1920&auto=format&fit=crop&q=85&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c25vd2JvYXJkfGVufDB8fDB8fHww",
      variant: "orange",
    },
    {
      name: "Raquettes",
      description:
        "Explorez la montagne autrement avec nos raquettes à neige. Faciles à utiliser, elles vous emmènent hors des sentiers battus pour des balades hivernales magiques et accessibles à tous !",
      urlImage:
        "https://images.unsplash.com/photo-1728081931259-093429cf8467?w=1920&auto=format&fit=crop&q=85&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHJhcXVldHRlc3xlbnwwfHwwfHx8MA%3D%3D",
      variant: "purple",
    },
    {
      name: "Chaussures",
      description:
        "Du sommet au sentier, trouvez la chaussure idéale ! Ski, rando ou ville : confort, technicité et maintien pour affronter tous les terrains avec assurance !",
      urlImage:
        "https://images.unsplash.com/photo-1645999140947-db7546fecb30?w=1920&auto=format&fit=crop&q=85&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2hhdXNzdXJlcyUyMGRlJTIwc2tpfGVufDB8fDB8fHww",
      variant: "red",
    },
    {
      name: "Vêtements",
      description:
        "Affrontez les éléments avec style ! Nos vêtements techniques vous protègent du froid, du vent et de la neige tout en garantissant confort et liberté de mouvement. Pour toute la famille !",
      urlImage:
        "https://images.unsplash.com/photo-1701617012334-bb1302463c36?w=1920&auto=format&fit=crop&q=85&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHYlQzMlQUF0ZW1lbnQlMjBkZSUyMHNraXxlbnwwfHwwfHx8MA%3D%3D",
      variant: "orange",
    },
    {
      name: "Vélos",
      description:
        "Du VTT au vélo électrique, partez à l'aventure avec nos modèles adaptés à tous les niveaux. Profitez des paysages de montagne comme jamais grâce à un matériel fiable et performant !",
      urlImage:
        "https://images.unsplash.com/photo-1633707167682-9068729bc84c?w=1920&auto=format&fit=crop&q=85&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8VlRUJTIwbW9udGFnbmV8ZW58MHx8MHx8fDA%3D",
      variant: "stone",
    },
    {
      name: "Randonnée",
      description:
        "Partez à la conquête des sentiers ! Équipez-vous avec nos bâtons, sacs, et accessoires de rando. Confort et sécurité pour vos balades ou vos défis en altitude !",
      urlImage:
        "https://plus.unsplash.com/premium_photo-1661814278311-d59ab0b4a676?w=1920&auto=format&fit=crop&q=85&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmFuZG9ubiVDMyVBOWVzfGVufDB8fDB8fHww",
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
        description: activity.description,
        createdBy: adminUser,
      });
      await activityRepo.save(newActivity);
    }
  }

  console.log("✅ Activities seeded.");
};
