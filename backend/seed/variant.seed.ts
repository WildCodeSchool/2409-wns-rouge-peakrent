import { dataSource } from "../src/config/db";
import { Variant } from "../src/entities/Variant";
import { Product } from "../src/entities/Product";
import { User } from "../src/entities/User";

export const seedVariants = async () => {
  const variantRepo = dataSource.getRepository(Variant);
  const productRepo = dataSource.getRepository(Product);
  const userRepo = dataSource.getRepository(User);

  const adminUser = await userRepo.findOneBy({ email: "admin@peakrent.com" });
  if (!adminUser) {
    console.error("❌ Admin user not found. Please seed users first.");
    return;
  }

  const variants = [
    // Skis Rossignol Hero Elite (productId 1)
    { size: "165cm", color: "Rouge/Noir", pricePerHour: 1500, sku: "SKI-001" },
    { size: "170cm", color: "Bleu/Noir", pricePerHour: 1500, sku: "SKI-001" },
    // Skis Atomic Redster S9 (productId 2)
    { size: "168cm", color: "Rouge/Blanc", pricePerHour: 1400, sku: "SKI-002" },
    { size: "175cm", color: "Noir/Or", pricePerHour: 1400, sku: "SKI-002" },
    // Skis Salomon QST 98
    { size: "172cm", color: "Vert/Noir", pricePerHour: 1600, sku: "SKI-003" },
    { size: "180cm", color: "Bleu/Noir", pricePerHour: 1600, sku: "SKI-003" },
    // Snowboards Burton Custom
    { size: "155cm", color: "Noir/Blanc", pricePerHour: 1200, sku: "SNB-001" },
    { size: "160cm", color: "Vert/Noir", pricePerHour: 1200, sku: "SNB-001" },
    // Snowboards Jones Mountain Twin
    { size: "158cm", color: "Bleu/Noir", pricePerHour: 1300, sku: "SNB-002" },
    { size: "162cm", color: "Rouge/Noir", pricePerHour: 1300, sku: "SNB-002" },
    // Snowboards Nitro T1
    { size: "152cm", color: "Noir/Or", pricePerHour: 1100, sku: "SNB-003" },
    { size: "156cm", color: "Blanc/Noir", pricePerHour: 1100, sku: "SNB-003" },
    // Raquettes TSL Symbioz
    { size: "M", color: "Noir", pricePerHour: 800, sku: "RAQ-001" },
    { size: "L", color: "Bleu", pricePerHour: 800, sku: "RAQ-001" },
    // Raquettes MSR Lightning
    { size: "M", color: "Rouge", pricePerHour: 900, sku: "RAQ-002" },
    { size: "L", color: "Noir", pricePerHour: 900, sku: "RAQ-002" },
    // Raquettes Tubbs Flex
    { size: "M", color: "Vert", pricePerHour: 700, sku: "RAQ-003" },
    { size: "L", color: "Bleu", pricePerHour: 700, sku: "RAQ-003" },
    // Chaussures Salomon S/Max
    { size: "42", color: "Noir", pricePerHour: 1000, sku: "CHS-001" },
    { size: "43", color: "Noir", pricePerHour: 1000, sku: "CHS-001" },
    // Chaussures Rossignol Alltrack
    { size: "41", color: "Rouge", pricePerHour: 1100, sku: "CHS-002" },
    { size: "42", color: "Rouge", pricePerHour: 1100, sku: "CHS-002" },
    // Chaussures Atomic Hawx
    { size: "42", color: "Noir", pricePerHour: 1200, sku: "CHS-003" },
    { size: "43", color: "Noir", pricePerHour: 1200, sku: "CHS-003" },
    // Veste Arc'teryx
    { size: "M", color: "Noir", pricePerHour: 1200, sku: "VET-001" },
    { size: "L", color: "Noir", pricePerHour: 1200, sku: "VET-001" },
    // Pantalon The North Face
    { size: "M", color: "Noir", pricePerHour: 1000, sku: "VET-002" },
    { size: "L", color: "Noir", pricePerHour: 1000, sku: "VET-002" },
    // Combinaison Picture
    { size: "M", color: "Bleu", pricePerHour: 1500, sku: "VET-003" },
    { size: "L", color: "Bleu", pricePerHour: 1500, sku: "VET-003" },
  ];

  for (const variantData of variants) {
    const product = await productRepo.findOne({
      where: { sku: variantData.sku },
    });
    if (!product) {
      console.warn(
        `⚠️ Product not found for SKU ${variantData.sku}. Skipping variant.`
      );
      continue;
    }

    const existingVariant = await variantRepo.findOne({
      where: {
        size: variantData.size,
        color: variantData.color,
        pricePerHour: variantData.pricePerHour,
        product: { id: product.id },
      },
      relations: { product: true },
    });

    if (!existingVariant) {
      const newVariant = variantRepo.create({
        size: variantData.size,
        color: variantData.color,
        pricePerHour: variantData.pricePerHour,
        product,
        createdBy: adminUser,
      });

      await variantRepo.save(newVariant);
    }
  }

  console.log("✅ Variants seeded.");
};
