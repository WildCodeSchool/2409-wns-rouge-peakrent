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
    { size: "165cm", color: "Rouge/Noir", pricePerDay: 15000, sku: "SKI-001" },
    { size: "170cm", color: "Bleu/Noir", pricePerDay: 15000, sku: "SKI-001" },
    // Skis Atomic Redster S9 (productId 2)
    { size: "168cm", color: "Rouge/Blanc", pricePerDay: 14000, sku: "SKI-002" },
    { size: "175cm", color: "Noir/Or", pricePerDay: 14000, sku: "SKI-002" },
    // Skis Salomon QST 98
    { size: "172cm", color: "Vert/Noir", pricePerDay: 16000, sku: "SKI-003" },
    { size: "180cm", color: "Bleu/Noir", pricePerDay: 16000, sku: "SKI-003" },
    // Snowboards Burton Custom
    { size: "155cm", color: "Noir/Blanc", pricePerDay: 12000, sku: "SNB-001" },
    { size: "160cm", color: "Vert/Noir", pricePerDay: 12000, sku: "SNB-001" },
    // Snowboards Jones Mountain Twin
    { size: "158cm", color: "Bleu/Noir", pricePerDay: 13000, sku: "SNB-002" },
    { size: "162cm", color: "Rouge/Noir", pricePerDay: 13000, sku: "SNB-002" },
    // Snowboards Nitro T1
    { size: "152cm", color: "Noir/Or", pricePerDay: 11000, sku: "SNB-003" },
    { size: "156cm", color: "Blanc/Noir", pricePerDay: 11000, sku: "SNB-003" },
    // Raquettes TSL Symbioz
    { size: "M", color: "Noir", pricePerDay: 8000, sku: "RAQ-001" },
    { size: "L", color: "Bleu", pricePerDay: 8000, sku: "RAQ-001" },
    // Raquettes MSR Lightning
    { size: "M", color: "Rouge", pricePerDay: 9000, sku: "RAQ-002" },
    { size: "L", color: "Noir", pricePerDay: 9000, sku: "RAQ-002" },
    // Raquettes Tubbs Flex
    { size: "M", color: "Vert", pricePerDay: 7000, sku: "RAQ-003" },
    { size: "L", color: "Bleu", pricePerDay: 7000, sku: "RAQ-003" },
    // Chaussures Salomon S/Max
    { size: "42", color: "Noir", pricePerDay: 10000, sku: "CHS-001" },
    { size: "43", color: "Noir", pricePerDay: 10000, sku: "CHS-001" },
    // Chaussures Rossignol Alltrack
    { size: "41", color: "Rouge", pricePerDay: 11000, sku: "CHS-002" },
    { size: "42", color: "Rouge", pricePerDay: 11000, sku: "CHS-002" },
    // Chaussures Atomic Hawx
    { size: "42", color: "Noir", pricePerDay: 12000, sku: "CHS-003" },
    { size: "43", color: "Noir", pricePerDay: 12000, sku: "CHS-003" },
    // Veste Arc'teryx
    { size: "M", color: "Noir", pricePerDay: 12000, sku: "VET-001" },
    { size: "L", color: "Noir", pricePerDay: 12000, sku: "VET-001" },
    // Pantalon The North Face
    { size: "M", color: "Noir", pricePerDay: 10000, sku: "VET-002" },
    { size: "L", color: "Noir", pricePerDay: 10000, sku: "VET-002" },
    // Combinaison Picture
    { size: "M", color: "Bleu", pricePerDay: 15000, sku: "VET-003" },
    { size: "L", color: "Bleu", pricePerDay: 15000, sku: "VET-003" },
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
        pricePerDay: variantData.pricePerDay,
        product: { id: product.id },
      },
      relations: { product: true },
    });

    if (!existingVariant) {
      const newVariant = variantRepo.create({
        size: variantData.size,
        color: variantData.color,
        pricePerDay: variantData.pricePerDay,
        product,
        createdBy: adminUser,
      });

      await variantRepo.save(newVariant);
    }
  }

  console.log("✅ Variants seeded.");
};
