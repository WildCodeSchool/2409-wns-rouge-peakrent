import { dataSource } from "../src/config/db";
import { Activity } from "../src/entities/Activity";
import { Category } from "../src/entities/Category";
import { Product } from "../src/entities/Product";
import { User } from "../src/entities/User";
import { normalizeString } from "../src/helpers/helpers";

export const seedProducts = async () => {
  const productRepo = dataSource.getRepository(Product);
  const userRepo = dataSource.getRepository(User);
  const categoryRepo = dataSource.getRepository(Category);
  const activityRepo = dataSource.getRepository(Activity);

  const adminUser = await userRepo.findOneBy({ email: "admin@peakrent.com" });
  if (!adminUser) {
    console.error(
      "❌ User with email admin@peakrent.com not found. Seed users first."
    );
    return;
  }

  const allCategories = await categoryRepo.find();
  const allActivities = await activityRepo.find();

  const productCategoryMap: Record<string, string[]> = {
    "SKI-001": ["Ski"],
    "SKI-002": ["Ski"],
    "SKI-003": ["Ski"],
    "SNB-001": ["Snowboard"],
    "SNB-002": ["Snowboard"],
    "SNB-003": ["Snowboard"],
    "RAQ-001": ["Raquettes"],
    "RAQ-002": ["Raquettes"],
    "RAQ-003": ["Raquettes"],
    "CHS-001": ["Chaussures"],
    "CHS-002": ["Chaussures"],
    "CHS-003": ["Chaussures"],
    "VET-001": ["Vêtements"],
    "VET-002": ["Vêtements"],
    "VET-003": ["Vêtements"],
  };

  const productActivityMap: Record<string, string[]> = {
    "SKI-001": ["Ski Alpin"],
    "SKI-002": ["Ski Alpin"],
    "SKI-003": ["Ski Alpin"],
    "SNB-001": ["Snowboard"],
    "SNB-002": ["Snowboard"],
    "SNB-003": ["Snowboard"],
    "RAQ-001": ["Raquettes"],
    "RAQ-002": ["Raquettes"],
    "RAQ-003": ["Raquettes"],
    "CHS-001": ["Chaussures"],
    "CHS-002": ["Chaussures"],
    "CHS-003": ["Chaussures"],
    "VET-001": ["Vêtements"],
    "VET-002": ["Vêtements"],
    "VET-003": ["Vêtements"],
  };

  const products = [
    {
      name: "Ski Rossignol Hero Elite",
      description: "Ski de compétition pour skieurs confirmés",
      urlImage: "/ski-1.jpg",
      isPublished: true,
      sku: "SKI-001",
    },
    {
      name: "Ski Atomic Redster S9",
      description: "Ski carving pour skieurs intermédiaires",
      urlImage: "/ski-2.jpg",
      isPublished: true,
      sku: "SKI-002",
    },
    {
      name: "Ski Salomon QST 98",
      description: "Ski tout-montagne pour le freeride",
      urlImage: "/ski-3.jpg",
      isPublished: true,
      sku: "SKI-003",
    },
    {
      name: "Snowboard Burton Custom",
      description: "Snowboard polyvalent pour tous les niveaux",
      urlImage: "/snow-1.jpg",
      isPublished: true,
      sku: "SNB-001",
    },
    {
      name: "Snowboard Jones Mountain Twin",
      description: "Snowboard freeride pour la poudreuse",
      urlImage: "/snow-2.jpg",
      isPublished: true,
      sku: "SNB-002",
    },
    {
      name: "Snowboard Nitro T1",
      description: "Snowboard freestyle pour le park",
      urlImage: "/snow-2.jpg",
      isPublished: true,
      sku: "SNB-003",
    },
    {
      name: "Raquettes TSL Symbioz",
      description: "Raquettes légères pour randonnée",
      urlImage: "/raquette-1.jpg",
      isPublished: true,
      sku: "RAQ-001",
    },
    {
      name: "Raquettes MSR Lightning Ascent",
      description: "Raquettes techniques pour terrain escarpé",
      urlImage: "/raquette-1.jpg",
      isPublished: true,
      sku: "RAQ-002",
    },
    {
      name: "Raquettes Tubbs Flex VRT",
      description: "Raquettes confortables pour débutants",
      urlImage: "/raquette-2.jpg",
      isPublished: true,
      sku: "RAQ-003",
    },
    {
      name: "Chaussures Salomon S/Max",
      description: "Chaussures de ski confortables et performantes",
      urlImage: "/chaussures-1.jpg",
      isPublished: true,
      sku: "CHS-001",
    },
    {
      name: "Chaussures Rossignol Alltrack Pro",
      description: "Chaussures de ski pour la compétition",
      urlImage: "/chaussures-2.jpg",
      isPublished: true,
      sku: "CHS-002",
    },
    {
      name: "Chaussures Atomic Hawx Prime",
      description: "Chaussures de ski pour le freeride",
      urlImage: "/chaussures-3.jpg",
      isPublished: true,
      sku: "CHS-003",
    },
    {
      name: "Veste Gore-Tex Arc'teryx",
      description: "Veste imperméable et respirante",
      urlImage: "/veste.jpg",
      isPublished: true,
      sku: "VET-001",
    },
    {
      name: "Pantalon de ski The North Face",
      description: "Pantalon de ski chaud et imperméable",
      urlImage: "/pantalon.jpg",
      isPublished: true,
      sku: "VET-002",
    },
    {
      name: "Combinaison de ski Picture",
      description: "Combinaison de ski pour le freestyle",
      urlImage: "/combi.jpg",
      isPublished: true,
      sku: "VET-003",
    },
  ];

  for (const productData of products) {
    const exists = await productRepo.findOneBy({ sku: productData.sku });
    if (!exists) {
      const categoryNames = productCategoryMap[productData.sku] || [];
      const categories = allCategories.filter((cat) =>
        categoryNames.includes(cat.name)
      );
      const activityNames = productActivityMap[productData.sku] || [];
      const activities = allActivities.filter((act) =>
        activityNames.includes(act.name)
      );

      const newProduct = productRepo.create({
        ...productData,
        normalizedName: normalizeString(productData.name),
        createdBy: adminUser,
        categories,
        activities,
      });

      await productRepo.save(newProduct);
    }
  }

  console.log("✅ Products seeded.");
};
