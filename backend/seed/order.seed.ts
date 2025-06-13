import { dataSource } from "../src/config/db";
import { Order } from "../src/entities/Order";
import { Profile } from "../src/entities/Profile";
import { OrderPaymentType, OrderStatusType } from "../src/types";

export const seedOrders = async () => {
  const orderRepo = dataSource.getRepository(Order);
  const profileRepo = dataSource.getRepository(Profile);

  // Récupérer le profil client
  const clientProfile = await profileRepo.findOne({
    where: { email: "client@example.com" },
  });
  if (!clientProfile) {
    console.error("❌ Client profile not found. Please seed users first.");
    return;
  }

  const orders = [
    {
      reference: "REF-001",
      status: OrderStatusType.confirmed,
      paymentMethod: OrderPaymentType.card,
      date: new Date("2023-10-01T10:00:00Z"),
      phone: "+33 6 12 34 56 78",
      address1: "123 Main St",
      address2: null,
      city: "Nice",
      zipCode: "06000",
      country: "FRANCE",
    },
    {
      reference: "REF-002",
      status: OrderStatusType.completed,
      paymentMethod: OrderPaymentType.card,
      date: new Date("2023-10-02T11:30:00Z"),
      phone: "+33 6 87 65 43 21",
      address1: "456 Oak Avenue",
      address2: "Apartment 2B",
      city: "Cannes",
      zipCode: "06400",
      country: "FRANCE",
    },
    {
      reference: "REF-003",
      status: OrderStatusType.pending,
      paymentMethod: OrderPaymentType.card,
      date: new Date("2023-10-03T09:15:00Z"),
      phone: "+33 6 98 76 54 32",
      address1: "789 Pine Street",
      address2: null,
      city: "Monaco",
      zipCode: "98000",
      country: "MONACO",
    },
    {
      reference: "REF-004",
      status: OrderStatusType.pending,
      paymentMethod: OrderPaymentType.card,
      date: new Date("2023-10-04T14:45:00Z"),
      phone: "+33 6 11 22 33 44",
      address1: "321 Elm Road",
      address2: "Building C",
      city: "Antibes",
      zipCode: "06600",
      country: "FRANCE",
    },
    {
      reference: "REF-005",
      status: OrderStatusType.cancelled,
      paymentMethod: OrderPaymentType.card,
      date: new Date("2023-10-05T16:20:00Z"),
      phone: "+33 6 55 66 77 88",
      address1: "654 Cedar Lane",
      address2: null,
      city: "Grasse",
      zipCode: "06130",
      country: "FRANCE",
    },
  ];

  for (const orderData of orders) {
    try {
      // Vérifier si la commande existe déjà
      const existingOrder = await orderRepo.findOne({
        where: { reference: orderData.reference },
      });

      if (!existingOrder) {
        // Créer la commande avec les propriétés exactes de l'entité
        const newOrder = orderRepo.create({
          reference: orderData.reference,
          status: orderData.status,
          paymentMethod: orderData.paymentMethod,
          date: orderData.date,
          phone: orderData.phone,
          address1: orderData.address1,
          address2: orderData.address2,
          city: orderData.city,
          zipCode: orderData.zipCode,
          country: orderData.country,
          profile: clientProfile,
          // paidAt sera null par défaut
        });

        await orderRepo.save(newOrder);
      } else {
        console.log(`⚠️ Order ${orderData.reference} already exists.`);
      }
    } catch (error) {
      console.error(`❌ Error creating order ${orderData.reference}:`, error);
      continue;
    }
  }

  console.log("✅ Orders seeding completed.");
};
