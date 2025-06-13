import { Activity } from "@/entities/Activity";
import { Category } from "@/entities/Category";
import {
  Product,
  ProductCreateInputAdmin,
  ProductUpdateInputAdmin,
} from "@/entities/Product";
import { Variant, VariantCreateNestedInputAdmin } from "@/entities/Variant";
import { normalizeString } from "@/helpers/helpers";
import { AuthContextType } from "@/types";
import { validate, ValidationError } from "class-validator";
import { GraphQLError } from "graphql";
import { Arg, Authorized, Ctx, ID, Mutation, Resolver } from "type-graphql";
import { In } from "typeorm";

@Resolver(Product)
export class ProductResolverAdmin {
  @Authorized(["admin"])
  @Mutation(() => Product)
  async createProductAdmin(
    @Arg("data", () => ProductCreateInputAdmin) data: ProductCreateInputAdmin,
    @Ctx() context: AuthContextType
  ): Promise<Product | null | ValidationError[]> {
    const newProduct = new Product();
    const user = context.user;

    Object.assign(newProduct, data, { createdBy: user });
    newProduct.normalizedName = normalizeString(newProduct.name);

    const validationErrors = await validate(newProduct);
    if (validationErrors.length > 0) {
      // travailler le renvoie d'erreur - fonction générique a réutiliser a chaque renvoie
      // class-validator
      throw new Error(`Errors : ${JSON.stringify(validationErrors)}`);
    } else {
      await newProduct.save();
      return newProduct;
    }
  }

  @Authorized(["admin"])
  @Mutation(() => Product)
  async createProductWithVariantsAdmin(
    @Arg("productData", () => ProductCreateInputAdmin)
    productData: ProductCreateInputAdmin,
    @Arg("variants", () => [VariantCreateNestedInputAdmin], { nullable: true })
    variants: VariantCreateNestedInputAdmin[],
    @Ctx() context: AuthContextType
  ): Promise<Product> {
    const user = context.user;
    const product = Product.create({ ...productData, createdBy: user });
    product.normalizedName = normalizeString(product.name);

    const validationErrors = await validate(product);
    if (validationErrors.length > 0) {
      throw new Error(
        `Product validation error: ${JSON.stringify(validationErrors)}`
      );
    }

    await product.save();

    if (variants?.length) {
      for (const variantInput of variants) {
        const variant = Variant.create({
          ...variantInput,
          product,
          createdBy: user,
        });
        const errors = await validate(variant);
        if (errors.length > 0) {
          throw new Error(
            `Variant validation error: ${JSON.stringify(errors)}`
          );
        }
        await variant.save();
      }
    }

    const productWithVariants = await Product.findOne({
      where: { id: product.id },
      relations: {
        variants: true,
        categories: true,
        createdBy: true,
      },
    });

    return productWithVariants;
  }

  @Authorized(["admin"])
  @Mutation(() => Product, { nullable: true })
  async updateProductAdmin(
    @Arg("id", () => String) _id: string,
    @Arg("data", () => ProductUpdateInputAdmin) data: ProductUpdateInputAdmin
    // @Ctx() context: AuthContextType
  ) {
    const id = Number(_id);

    const product = await Product.findOne({
      where: { id /*createdBy: { id: context.user.id }*/ },
      relations: { categories: true },
    });

    if (!product) {
      throw new Error("Product not found or access denied.");
    }

    Object.assign(product, data);

    if (product.name) {
      product.normalizedName = normalizeString(product.name);
    }

    if (data.categories) {
      const categoryIds = data.categories
        .map((category) => ("id" in category ? category.id : null))
        .filter((id) => id !== null);

      const fullTags = await Category.findBy({ id: In(categoryIds) });

      product.categories = fullTags;
    }

    if (data.activities) {
      const activityIds = data.activities
        .map((activity) => ("id" in activity ? activity.id : null))
        .filter((id) => id !== null);

      const fullTags = await Activity.findBy({ id: In(activityIds) });

      product.activities = fullTags;
    }

    const validationErrors = await validate(product);
    if (validationErrors.length) {
      // return validationErrors;
      console.log("Validation failed: ", validationErrors);
      if (validationErrors.length > 0) {
        throw new GraphQLError("Validation error", {
          extensions: {
            code: "VALIDATION_ERROR",
            http: { status: 400 },
          },
        });
      }
    }

    await product.save();
    return product;
  }

  @Authorized(["admin"])
  @Mutation(() => Product, { nullable: true })
  async deleteProductAdmin(
    @Arg("id", () => ID) _id: number,
    @Ctx() context: AuthContextType
  ) {
    const id = Number(_id);
    const product = await Product.findOneBy({
      id,
      createdBy: { id: context.user.id },
    });
    if (product !== null) {
      await product.remove();
      return product;
    } else {
      return null;
    }
  }
}
