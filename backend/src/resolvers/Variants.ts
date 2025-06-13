import { Product } from "@/entities/Product";
import { Variant, VariantUpdateInputAdmin } from "@/entities/Variant";
import { AuthContextType } from "@/types";
import { validate } from "class-validator";
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

  @Authorized(["admin"])
  @Mutation(() => Variant)
  async createVariant(
    @Arg("data", () => VariantUpdateInputAdmin) data: VariantUpdateInputAdmin,
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

  @Authorized(["admin"])
  @Mutation(() => Variant, { nullable: true })
  async updateVariant(
    @Arg("id", () => ID) id: number,
    @Arg("data", () => VariantUpdateInputAdmin) data: VariantUpdateInputAdmin,
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

  @Authorized(["admin"])
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
