import { OrderItem } from "@/entities/OrderItem";
import { getTotalOrderPrice } from "./getTotalOrderPrice";

const now = Date.now();
const orderItems: unknown = [
  {
    id: 1,
    order: null,
    cart: null,
    quantity: 1,
    pricePerDay: 10000,
    startsAt: new Date(now).toISOString(),
    endsAt: new Date(now + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(now).toISOString(),
    updatedAt: null,
  },
  {
    id: 2,
    order: null,
    cart: null,
    quantity: 1,
    pricePerDay: 25000,
    startsAt: new Date(now).toISOString(),
    endsAt: new Date(now + 6.5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(now).toISOString(),
    updatedAt: null,
  },
  {
    id: 3,
    order: null,
    cart: null,
    quantity: 1,
    pricePerDay: 12000,
    startsAt: new Date(now).toISOString(),
    endsAt: new Date(now + 0.5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(now).toISOString(),
    updatedAt: null,
  },
  {
    id: 4,
    order: null,
    cart: null,
    quantity: 2,
    pricePerDay: 39999,
    startsAt: new Date(now).toISOString(),
    endsAt: new Date(now + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(now).toISOString(),
    updatedAt: null,
  },
  {
    id: 5,
    order: null,
    cart: null,
    quantity: 4,
    pricePerDay: 40000,
    startsAt: new Date(now).toISOString(),
    endsAt: new Date(now + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(now).toISOString(),
    updatedAt: null,
  },
];

describe("price calculation", () => {
  it("should calculate the right price of orderItems", async () => {
    expect(getTotalOrderPrice(orderItems as OrderItem[])).toBe(74194);
  });
});
