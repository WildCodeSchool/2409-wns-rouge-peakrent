import { dataSource } from "@/config/db";
import {
  Order,
  OrderCreateInputAdmin,
  OrderUpdateInputAdmin,
} from "@/entities/Order";
import { OrderItem, OrderItemsFormInputAdmin } from "@/entities/OrderItem";
import { Profile } from "@/entities/Profile";
import { generateOrderReference } from "@/helpers/generateOrderReference";
import { AuthContextType, OrderItemStatusType } from "@/types";
import { validate } from "class-validator";
import { GraphQLError } from "graphql";
import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";

@Resolver(Order)
export class OrderResolverAdmin {
  @Query(() => [Order])
  @Authorized("admin")
  async getOrdersAdmin(): Promise<Order[]> {
    const order = await Order.find({
      relations: {
        orderItems: {
          variant: {
            product: true,
          },
        },
        profile: true,
      },
      order: { date: "DESC" },
    });
    return order;
  }

  @Mutation(() => Order)
  @Authorized("admin")
  async createOrderAdmin(
    @Arg("data", () => OrderCreateInputAdmin) data: OrderCreateInputAdmin
  ): Promise<Order> {
    const newOrder = new Order();
    const profile = await Profile.findOne({
      where: { id: data.profileId },
    });
    if (!profile) {
      throw new Error(`profile not found`);
    }
    Object.assign(newOrder, data, {
      profile: data.profileId,
    });
    const errors = await validate(newOrder);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    } else {
      await newOrder.save();
      return newOrder;
    }
  }

  @Mutation(() => Order, { nullable: true })
  @Authorized("admin")
  async updateOrderAdmin(
    @Arg("id", () => ID) _id: number,
    @Arg("data", () => OrderUpdateInputAdmin) data: OrderUpdateInputAdmin,
    @Ctx() context: AuthContextType
  ): Promise<Order | null> {
    const id = Number(_id);
    if (data.profileId) {
      const profile = await Profile.findOne({
        where: { id: data.profileId },
      });
      if (!profile) {
        throw new Error(`profile not found`);
      }
    }
    const order = await Order.findOne({
      where: { id },
      relations: { profile: true },
    });

    if (order !== null) {
      if (
        !(context.user.role === "admin" || context.user.id === order.profile.id)
      ) {
        throw new Error("Unauthorized");
      }
      Object.assign(order, data, {
        profile: data.profileId,
      });
      const errors = await validate(order);
      if (errors.length > 0) {
        throw new Error(`Validation error: ${JSON.stringify(errors)}`);
      } else {
        await order.save();
        return order;
      }
    } else {
      throw new Error("Order not found.");
    }
  }

  @Mutation(() => Order, { nullable: true })
  @Authorized("admin")
  async deleteOrderAdmin(
    @Arg("id", () => ID) _id: number,
    @Ctx() context: AuthContextType
  ): Promise<Order | null> {
    const id = Number(_id);
    const order = await Order.findOne({
      where: { id },
      relations: { profile: true },
    });
    if (order !== null) {
      if (
        !(context.user.role === "admin" || context.user.id === order.profile.id)
      ) {
        throw new Error("Unauthorized");
      }
      await order.remove();
      return order;
    } else {
      throw new Error("Order not found.");
    }
  }

  @Mutation(() => Order)
  @Authorized("admin")
  async createOrderWithItemsAdmin(
    @Arg("data", () => OrderCreateInputAdmin) data: OrderCreateInputAdmin,
    @Arg("items", () => [OrderItemsFormInputAdmin])
    items: OrderItemsFormInputAdmin[]
  ): Promise<Order> {
    return await dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        // Check if profile exists
        const profile = await transactionalEntityManager.findOne(Profile, {
          where: { id: data.profileId },
        });
        if (!profile) {
          throw new GraphQLError("Profile not found", {
            extensions: {
              code: "PROFILE_NOT_FOUND",
              http: { status: 404 },
            },
          });
        }

        // Create order
        const newOrder = new Order();
        Object.assign(newOrder, data, {
          profile: data.profileId,
          reference: generateOrderReference(
            data.date.toISOString(),
            data.reference
          ),
        });
        const orderErrors = await validate(newOrder);
        if (orderErrors.length > 0) {
          throw new GraphQLError("Order validation error", {
            extensions: {
              code: "VALIDATION_ERROR",
              http: { status: 400 },
            },
          });
        }
        const savedOrder = await transactionalEntityManager.save(newOrder);

        // Create order items
        for (const item of items) {
          const orderItem = new OrderItem();
          Object.assign(orderItem, {
            order: savedOrder,
            variant: item.variant,
            quantity: item.quantity,
            pricePerHour: item.pricePerHour,
            status: item.status || OrderItemStatusType.pending,
            startsAt: item.date_range.from,
            endsAt: item.date_range.to,
          });

          const itemErrors = await validate(orderItem);
          if (itemErrors.length > 0) {
            throw new GraphQLError("OrderItem validation error", {
              extensions: {
                code: "VALIDATION_ERROR",
                http: { status: 400 },
              },
            });
          }
          await transactionalEntityManager.save(orderItem);
        }

        // Return the order with its items
        return await transactionalEntityManager.findOne(Order, {
          where: { id: savedOrder.id },
          relations: {
            orderItems: {
              variant: {
                product: true,
              },
            },
            profile: true,
          },
        });
      }
    );
  }
}
