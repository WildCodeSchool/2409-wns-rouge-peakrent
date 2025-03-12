import { validate } from "class-validator";
import { Arg, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import { Product } from "../entities/Product";
import {
  Variant,
  VariantCreateInput,
  VariantUpdateInput,
} from "../entities/Variant";
import { AuthContextType } from "../types";

@Resolver(Variant)
export class VariantResolver {
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

  // @Authorized()
  @Mutation(() => Variant)
  async createVariant(
    @Arg("data", () => VariantCreateInput) data: VariantCreateInput,
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
    return variant;
  }

  // @Authorized()
  @Mutation(() => Variant, { nullable: true })
  async updateVariant(
    @Arg("id", () => ID) id: number,
    @Arg("data", () => VariantUpdateInput) data: VariantUpdateInput,
    @Ctx() context: AuthContextType
  ): Promise<Variant | null> {
    const variant = await Variant.findOne({
      where: { id },
      relations: { createdBy: true },
    });

    if (!variant) {
      throw new Error("Variant not found.");
    }

    if (variant.createdBy.id !== context.user.id) {
      throw new Error("Unauthorized: You can only update your own variants.");
    }

    Object.assign(variant, data);

    const errors = await validate(variant);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    }

    await variant.save();
    return variant;
  }

  // @Authorized()
  @Mutation(() => Variant, { nullable: true })
  async deleteVariant(
    @Arg("id", () => ID) id: number,
    @Ctx() context: AuthContextType
  ): Promise<Variant | null> {
    const variant = await Variant.findOne({
      where: { id },
      relations: { createdBy: true },
    });

    if (!variant) {
      return null;
    }

    if (variant.createdBy.id !== context.user.id) {
      throw new Error("Unauthorized: You can only delete your own variants.");
    }

    await variant.remove();
    return variant;
  }
}
