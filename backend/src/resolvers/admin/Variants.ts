import { OrderItem } from "@/entities/OrderItem";
import { Product } from "@/entities/Product";
import { StoreVariant } from "@/entities/StoreVariant";
import {
  Variant,
  VariantCreateInputAdmin,
  VariantUpdateInputAdmin,
} from "@/entities/Variant";
import { AuthContextType, RoleType } from "@/types";
import { validate } from "class-validator";
import { GraphQLError } from "graphql";
import { Arg, Authorized, Ctx, ID, Mutation, Resolver } from "type-graphql";

@Resolver(Variant)
export class VariantResolverAdmin {
  @Authorized([RoleType.admin, RoleType.superadmin])
  @Mutation(() => Variant)
  async createVariant(
    @Arg("data", () => VariantCreateInputAdmin) data: VariantCreateInputAdmin,
    @Ctx() context: AuthContextType
  ): Promise<Variant> {
    const product = await Product.findOne({ where: { id: data.productId } });
    if (!product) {
      throw new Error("Product not found.");
    }

    const variant = Variant.create({
      ...data,
      product,
      createdBy: context.user,
    });

    const errors = await validate(variant);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    }

    await variant.save();

    const storeId = 1;

    const storeVariant = StoreVariant.create({
      variantId: variant.id,
      storeId,
      quantity: data.quantity,
      variant,
    });

    await storeVariant.save();
    variant.storeVariants = [...(variant.storeVariants ?? []), storeVariant];

    await variant.save();

    return variant;
  }

  @Authorized([RoleType.admin, RoleType.superadmin])
  @Mutation(() => Variant, { nullable: true })
  async updateVariant(
    @Arg("id", () => ID) id: number,
    @Arg("data", () => VariantUpdateInputAdmin) data: VariantUpdateInputAdmin
  ): Promise<Variant | null> {
    const variant = await Variant.findOne({ where: { id } });

    if (!variant) {
      throw new GraphQLError(`Variant not found`, {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 },
        },
      });
    }

    Object.assign(variant, data);
    const storeVariant = await StoreVariant.findOne({
      where: { variantId: variant.id },
    });

    if (!storeVariant) {
      throw new GraphQLError(`storeVariant not found`, {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 },
        },
      });
    }
    Object.assign(storeVariant, { quantity: data.quantity });

    const errorsVariant = await validate(variant);
    const errorsStoreVariant = await validate(storeVariant);
    if (errorsVariant.length > 0 || errorsStoreVariant.length > 0) {
      const errors =
        errorsVariant.length > 0 ? errorsVariant : errorsStoreVariant;
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    }

    await storeVariant.save();
    await variant.save();
    return variant;
  }

  @Authorized([RoleType.admin, RoleType.superadmin])
  @Mutation(() => Variant)
  async toggleVariantPublication(
    @Arg("id", () => ID) id: number
  ): Promise<Variant> {
    const variant = await Variant.findOne({ where: { id } });
    if (!variant) {
      throw new Error("Variant not found.");
    }
    variant.isPublished = !variant.isPublished;
    await variant.save();
    return variant;
  }

  @Authorized([RoleType.admin, RoleType.superadmin])
  @Mutation(() => ID, { nullable: true })
  async deleteVariant(
    @Arg("id", () => ID) _id: number
  ): Promise<number | null> {
    const id = Number(_id);
    const variant = await Variant.findOne({
      where: { id },
      relations: { product: true },
    });

    if (!variant) {
      throw new GraphQLError(`Variant not found`, {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 },
        },
      });
    }

    const orderItemCount = await OrderItem.count({
      where: { variant: { id } },
    });
    if (orderItemCount > 0) {
      throw new GraphQLError(`Variant linked to orders; cannot delete`, {
        extensions: { code: "CONFLICT", http: { status: 409 } },
      });
    }

    await variant.remove();
    return id;
  }
}
