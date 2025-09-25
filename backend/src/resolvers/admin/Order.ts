import { dataSource } from "@/config/db";
import {
  Order,
  OrderCreateInputAdmin,
  OrderUpdateInputAdmin,
} from "@/entities/Order";
import { OrderItem, OrderItemsFormInputAdmin } from "@/entities/OrderItem";
import { Profile } from "@/entities/Profile";
import { Variant } from "@/entities/Variant";
import { Voucher } from "@/entities/Voucher";
import { generateOrderReference } from "@/helpers/generateOrderReference";
import {
  AuthContextType,
  OrderItemStatusType,
  OrderStatusType,
  RoleType,
} from "@/types";
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
import { In } from "typeorm";

@Resolver(Order)
export class OrderResolverAdmin {
  @Query(() => [Order])
  @Authorized([RoleType.admin, RoleType.superadmin])
  async getOrdersAdmin(): Promise<Order[]> {
    const order = await Order.find({
      relations: {
        orderItems: {
          variant: {
            product: true,
          },
        },
        profile: true,
        voucher: true,
      },
      order: { date: "DESC" },
    });
    return order;
  }

  @Query(() => Order, { nullable: true })
  @Authorized([RoleType.admin, RoleType.superadmin])
  async getOrderByIdAdmin(
    @Arg("id", () => ID) _id: number
  ): Promise<Order | null> {
    const id = Number(_id);
    const order = await Order.findOne({
      where: { id },
      relations: {
        orderItems: {
          variant: {
            product: true,
          },
        },
        profile: true,
      },
    });
    if (!order) {
      throw new GraphQLError("Order not found", {
        extensions: { code: "ORDER_NOT_FOUND", http: { status: 404 } },
      });
    }
    return order;
  }

  @Query(() => Order, { nullable: true })
  @Authorized([RoleType.admin, RoleType.superadmin])
  async getOrderByRefAdmin(
    @Arg("ref", () => String) ref: string
  ): Promise<Order | null> {
    const order = await Order.findOne({
      where: { reference: ref },
      relations: {
        orderItems: {
          variant: {
            product: true,
          },
        },
        profile: true,
      },
    });
    if (!order) {
      throw new GraphQLError("Order not found", {
        extensions: { code: "ORDER_NOT_FOUND", http: { status: 404 } },
      });
    }
    return order;
  }

  @Mutation(() => Order)
  @Authorized([RoleType.admin, RoleType.superadmin])
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

    let voucher: Voucher | null = null;
    if (typeof data.voucherId === "number") {
      voucher = await Voucher.findOne({ where: { id: data.voucherId } });
      if (!voucher) {
        throw new GraphQLError("voucher not found", {
          extensions: {
            code: "NOT_FOUND",
            entity: "Voucher",
            http: { status: 404 },
          },
        });
      }
    }

    Object.assign(newOrder, data, {
      profile: data.profileId,
      voucher: voucher ?? undefined,
      discountAmount: data.discountAmount ?? null,
      chargedAmount: data.chargedAmount ?? null,
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
  @Authorized([RoleType.admin, RoleType.superadmin])
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
      relations: { profile: true, voucher: true, orderItems: true },
    });
    if (order !== null) {
      if (
        !(context.user.role === "admin" || context.user.id === order.profile.id)
      ) {
        throw new Error("Unauthorized");
      }
      let voucherU: Voucher | null = null;
      if (typeof data.voucherId === "number") {
        voucherU = await Voucher.findOne({ where: { id: data.voucherId } });
        if (!voucherU) {
          throw new GraphQLError("voucher not found", {
            extensions: {
              code: "NOT_FOUND",
              entity: "Voucher",
              http: { status: 404 },
            },
          });
        }
      }

      let status = order.status;
      // si le paidAt change, alors le status de l'order et de ses items change
      if (order.paidAt !== data.paidAt) {
        if (data.paidAt) {
          if (order.status === OrderStatusType.pending) {
            status = OrderStatusType.confirmed;
          }
          if (order.orderItems?.length > 0) {
            await Promise.all(
              order.orderItems.map(async (item) => {
                if (item.status === OrderItemStatusType.pending) {
                  item.status = OrderItemStatusType.confirmed;
                  await item.save();
                }
              })
            );
          }
        } else if (!data.paidAt && order.status === OrderStatusType.confirmed) {
          status = OrderStatusType.pending;
          if (order.orderItems?.length > 0) {
            await Promise.all(
              order.orderItems.map(async (item) => {
                if (item.status === OrderItemStatusType.confirmed) {
                  item.status = OrderItemStatusType.pending;
                  await item.save();
                }
              })
            );
          }
        }
      }

      Object.assign(order, data, {
        status,
        profile: data.profileId ?? order.profile,
        voucher: typeof data.voucherId === "number" ? voucherU : order.voucher,
        discountAmount: data.discountAmount ?? order.discountAmount,
        chargedAmount: data.chargedAmount ?? order.chargedAmount,
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
  @Authorized([RoleType.admin, RoleType.superadmin])
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
  @Authorized([RoleType.admin, RoleType.superadmin])
  async createOrderWithItemsAdmin(
    @Arg("data", () => OrderCreateInputAdmin) data: OrderCreateInputAdmin,
    @Arg("items", () => [OrderItemsFormInputAdmin])
    items: OrderItemsFormInputAdmin[]
  ): Promise<Order> {
    return await dataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const profile = await transactionalEntityManager.findOne(Profile, {
          where: { id: data.profileId },
        });
        if (!profile) {
          throw new GraphQLError("Profile not found", {
            extensions: { code: "PROFILE_NOT_FOUND", http: { status: 404 } },
          });
        }

        let voucher: Voucher | null = null;
        if (typeof data.voucherId === "number") {
          voucher = await transactionalEntityManager.findOne(Voucher, {
            where: { id: data.voucherId },
          });
          if (!voucher) {
            throw new GraphQLError("voucher not found", {
              extensions: {
                code: "NOT_FOUND",
                entity: "Voucher",
                http: { status: 404 },
              },
            });
          }
        }

        const newOrder = new Order();
        Object.assign(newOrder, data, {
          profile: data.profileId,
          reference: generateOrderReference(
            data.date.toISOString(),
            data.reference
          ),
          voucher: voucher ?? undefined,
          discountAmount: data.discountAmount ?? null,
          chargedAmount: data.chargedAmount ?? null,
        });

        const orderErrors = await validate(newOrder);
        if (orderErrors.length > 0) {
          throw new GraphQLError("Order validation error", {
            extensions: { code: "VALIDATION_ERROR", http: { status: 400 } },
          });
        }

        const savedOrder = await transactionalEntityManager.save(newOrder);

        const variantIds = items.map((i) => i.variant);
        const variants = await transactionalEntityManager.find(Variant, {
          where: { id: In(variantIds) },
        });
        const variantById = new Map(variants.map((v) => [v.id, v]));

        if (variants.length !== variantIds.length) {
          const missing = variantIds.filter((id) => !variantById.has(id));
          throw new GraphQLError(
            `Variant(s) not found: ${missing.join(", ")}`,
            {
              extensions: {
                code: "NOT_FOUND",
                entity: "Variant",
                http: { status: 404 },
              },
            }
          );
        }

        for (const item of items) {
          const variant = variantById.get(item.variant)!;

          const orderItem = new OrderItem();
          Object.assign(orderItem, {
            order: savedOrder,
            variant,
            quantity: item.quantity,
            pricePerDay: item.pricePerDay,
            status: item.status || OrderItemStatusType.pending,
            startsAt: item.date_range.from,
            endsAt: item.date_range.to,
          });

          const itemErrors = await validate(orderItem);
          if (itemErrors.length > 0) {
            throw new GraphQLError("OrderItem validation error", {
              extensions: { code: "VALIDATION_ERROR", http: { status: 400 } },
            });
          }
          await transactionalEntityManager.save(orderItem);
        }

        return await transactionalEntityManager.findOne(Order, {
          where: { id: savedOrder.id },
          relations: {
            orderItems: { variant: { product: true } },
            profile: true,
            voucher: true,
          },
        });
      }
    );
  }
}
