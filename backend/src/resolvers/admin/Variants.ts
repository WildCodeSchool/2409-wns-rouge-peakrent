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
import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";

@Resolver(Variant)
export class VariantResolverAdmin {
  @Query(() => [Variant])
  async getVariants(): Promise<Variant[]> {
    return await Variant.find({
      relations: { product: true, createdBy: true },
    });
  }

  @Query(() => Variant, { nullable: true })
  async getVariantById(
    @Arg("id", () => ID) id: number
  ): Promise<Variant | null> {
    return await Variant.findOne({
      where: { id },
      relations: { product: true, createdBy: true },
    });
  }

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
    const quantity = 100;

    const storeVariant = StoreVariant.create({
      variantId: variant.id,
      storeId,
      quantity,
    });

    await storeVariant.save();

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
      throw new Error("Variant not found.");
    }

    Object.assign(variant, data);

    const errors = await validate(variant);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    }

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
