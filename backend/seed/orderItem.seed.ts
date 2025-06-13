import { dataSource } from "../src/config/db";
import { Order } from "../src/entities/Order";
import { OrderItem } from "../src/entities/OrderItem";
import { Variant } from "../src/entities/Variant";
import { OrderItemStatusType } from "../src/types";

export const seedOrderItems = async () => {
  const orderRepo = dataSource.getRepository(Order);
  const orderItemRepo = dataSource.getRepository(OrderItem);
  const variantRepo = dataSource.getRepository(Variant);

  // Récupérer tous les orders créés
  const orders = await orderRepo.find();
  if (orders.length === 0) {
    console.error("❌ No orders found. Please seed orders first.");
    return;
  }

  // Récupérer quelques variants pour les commandes
  const variants = await variantRepo.find({
    take: 15, // Augmenté pour avoir assez de variants
    relations: ["product"],
  });
  if (variants.length === 0) {
    console.error("❌ No variants found. Please seed variants first.");
    return;
  }

  const orderItemsData = [
    // Items pour REF-001 (3 items)
    {
      orderReference: "REF-001",
      items: [
        {
          variantId: variants[0]?.id,
          quantity: 1,
          pricePerHour: variants[0]?.pricePerHour || 1500,
          startsAt: new Date("2024-01-15T09:00:00Z"),
          endsAt: new Date("2024-01-20T17:00:00Z"),
          status: OrderItemStatusType.distributed,
        },
        {
          variantId: variants[1]?.id,
          quantity: 1,
          pricePerHour: variants[1]?.pricePerHour || 1400,
          startsAt: new Date("2024-01-15T09:00:00Z"),
          endsAt: new Date("2024-01-20T17:00:00Z"),
          status: OrderItemStatusType.distributed,
        },
        {
          variantId: variants[2]?.id,
          quantity: 1,
          pricePerHour: variants[2]?.pricePerHour || 1300,
          startsAt: new Date("2024-01-15T09:00:00Z"),
          endsAt: new Date("2024-01-20T17:00:00Z"),
          status: OrderItemStatusType.distributed,
        },
      ],
    },
    // Items pour REF-002 (3 items)
    {
      orderReference: "REF-002",
      items: [
        {
          variantId: variants[3]?.id,
          quantity: 1,
          pricePerHour: variants[3]?.pricePerHour || 1200,
          startsAt: new Date("2024-02-01T08:00:00Z"),
          endsAt: new Date("2024-02-05T18:00:00Z"),
          status: OrderItemStatusType.recovered,
        },
        {
          variantId: variants[4]?.id,
          quantity: 1,
          pricePerHour: variants[4]?.pricePerHour || 1100,
          startsAt: new Date("2024-02-01T08:00:00Z"),
          endsAt: new Date("2024-02-05T18:00:00Z"),
          status: OrderItemStatusType.recovered,
        },
        {
          variantId: variants[5]?.id,
          quantity: 2,
          pricePerHour: variants[5]?.pricePerHour || 1000,
          startsAt: new Date("2024-02-01T08:00:00Z"),
          endsAt: new Date("2024-02-05T18:00:00Z"),
          status: OrderItemStatusType.recovered,
        },
      ],
    },
    // Items pour REF-003 (3 items)
    {
      orderReference: "REF-003",
      items: [
        {
          variantId: variants[6]?.id,
          quantity: 1,
          pricePerHour: variants[6]?.pricePerHour || 1700,
          startsAt: new Date("2024-03-10T10:00:00Z"),
          endsAt: new Date("2024-03-12T16:00:00Z"),
          status: OrderItemStatusType.pending,
        },
        {
          variantId: variants[7]?.id,
          quantity: 1,
          pricePerHour: variants[7]?.pricePerHour || 1600,
          startsAt: new Date("2024-03-10T10:00:00Z"),
          endsAt: new Date("2024-03-12T16:00:00Z"),
          status: OrderItemStatusType.pending,
        },
        {
          variantId: variants[8]?.id,
          quantity: 1,
          pricePerHour: variants[8]?.pricePerHour || 1500,
          startsAt: new Date("2024-03-10T10:00:00Z"),
          endsAt: new Date("2024-03-12T16:00:00Z"),
          status: OrderItemStatusType.pending,
        },
      ],
    },
    // Items pour REF-004 (3 items)
    {
      orderReference: "REF-004",
      items: [
        {
          variantId: variants[9]?.id,
          quantity: 1,
          pricePerHour: variants[9]?.pricePerHour || 1600,
          startsAt: new Date("2024-04-05T07:00:00Z"),
          endsAt: new Date("2024-04-10T19:00:00Z"),
          status: OrderItemStatusType.pending,
        },
        {
          variantId: variants[10]?.id,
          quantity: 2,
          pricePerHour: variants[10]?.pricePerHour || 1300,
          startsAt: new Date("2024-04-05T07:00:00Z"),
          endsAt: new Date("2024-04-10T19:00:00Z"),
          status: OrderItemStatusType.pending,
        },
        {
          variantId: variants[11]?.id,
          quantity: 1,
          pricePerHour: variants[11]?.pricePerHour || 1400,
          startsAt: new Date("2024-04-05T07:00:00Z"),
          endsAt: new Date("2024-04-10T19:00:00Z"),
          status: OrderItemStatusType.pending,
        },
      ],
    },
    // Items pour REF-005 (3 items)
    {
      orderReference: "REF-005",
      items: [
        {
          variantId: variants[12]?.id,
          quantity: 1,
          pricePerHour: variants[12]?.pricePerHour || 1900,
          startsAt: new Date("2024-05-15T09:00:00Z"),
          endsAt: new Date("2024-05-18T17:00:00Z"),
          status: OrderItemStatusType.cancelled,
        },
        {
          variantId: variants[13]?.id,
          quantity: 1,
          pricePerHour: variants[13]?.pricePerHour || 1800,
          startsAt: new Date("2024-05-15T09:00:00Z"),
          endsAt: new Date("2024-05-18T17:00:00Z"),
          status: OrderItemStatusType.cancelled,
        },
        {
          variantId: variants[14]?.id,
          quantity: 1,
          pricePerHour: variants[14]?.pricePerHour || 1700,
          startsAt: new Date("2024-05-15T09:00:00Z"),
          endsAt: new Date("2024-05-18T17:00:00Z"),
          status: OrderItemStatusType.cancelled,
        },
      ],
    },
  ];

  for (const orderData of orderItemsData) {
    try {
      // Trouver l'order correspondant
      const order = orders.find(
        (o) => o.reference === orderData.orderReference
      );
      if (!order) {
        console.error(`❌ Order ${orderData.orderReference} not found.`);
        continue;
      }

      // Vérifier si des items existent déjà pour cette commande
      const existingItems = await orderItemRepo.find({
        where: { order: { id: order.id } },
      });

      if (existingItems.length === 0) {
        // Créer les items de commande
        for (const itemData of orderData.items) {
          const variant = variants.find((v) => v.id === itemData.variantId);

          if (variant) {
            const orderItem = orderItemRepo.create({
              order: order,
              variant: variant,
              quantity: itemData.quantity,
              pricePerHour: itemData.pricePerHour,
              startsAt: itemData.startsAt,
              endsAt: itemData.endsAt,
              status: itemData.status,
            });

            await orderItemRepo.save(orderItem);
          } else {
            console.warn(
              `⚠️ Variant with ID ${itemData.variantId} not found for order ${orderData.orderReference}`
            );
          }
        }
      } else {
        console.log(
          `⚠️ OrderItems for ${orderData.orderReference} already exist.`
        );
      }
    } catch (error) {
      console.error(
        `❌ Error creating orderItems for ${orderData.orderReference}:`,
        error
      );
      continue;
    }
  }

  console.log("✅ OrderItems seeding completed.");
};
