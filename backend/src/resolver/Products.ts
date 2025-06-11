import { validate, ValidationError } from "class-validator";
import { GraphQLError } from "graphql";
import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { ILike, In } from "typeorm";
import { Category } from "../entities/Category";
import {
  Product,
  ProductCreateInput,
  ProductUpdateInput,
  ProductWithCount,
} from "../entities/Product";
import { StoreVariant } from "../entities/StoreVariant";
import { Variant, VariantCreateNestedInput } from "../entities/Variant";
import { checkStockByVariantAndStore } from "../helpers/checkStockByVariantAndStore";
import { normalizeString } from "../helpers/helpers";
import { ErrorCatcher } from "../middlewares/errorHandler";
import { AuthContextType } from "../types";

@Resolver(Product)
export class ProductResolver {
  @Query(() => ProductWithCount)
  async getProducts(
    @Arg("page", () => Int, { defaultValue: 1 }) page: number,
    @Arg("onPage", () => Int, { defaultValue: 15 }) onPage: number,
    @Arg("categoryIds", () => [Int], { nullable: true }) categoryIds?: number[],
    @Arg("startingDate", () => Date, { nullable: true }) startingDate?: Date,
    @Arg("endingDate", () => Date, { nullable: true }) endingDate?: Date,
    @Arg("search", () => String, { nullable: true }) search?: string
  ): Promise<ProductWithCount> {
    const itemsToSkip = (page - 1) * onPage;
    const where: any = {};
    const availableProductsByDates = [];

    if (categoryIds && categoryIds.length > 0) {
      where.categories = {
        id: In(categoryIds),
      };
    }

    if (search) {
      where.name = ILike(`%${search}%`);
    }

    const [products, total] = await Product.findAndCount({
      skip: itemsToSkip,
      take: onPage,
      where,
      relations: {
        categories: true,
        createdBy: true,
        variants: true,
      },
    });

    if ((startingDate || endingDate) && products.length > 0) {
      for (const product of products) {
        try {
          const storeVariants = await StoreVariant.find({
            where: {
              variant: {
                product: {
                  id: product.id,
                },
              },
            },
          });

          for (const storeVariant of storeVariants) {
            const quantity = await checkStockByVariantAndStore(
              storeVariant.storeId,
              storeVariant.variantId,
              startingDate,
              endingDate
            );
            if (quantity > 0) {
              availableProductsByDates.push(product);
              break;
            }
          }
        } catch (err) {
          console.error(
            "Erreur lors du traitement du produit:",
            product.id,
            err
          );
        }
      }
    }
    return {
      products:
        availableProductsByDates.length > 0
          ? availableProductsByDates
          : products,
      pagination: {
        total:
          availableProductsByDates.length > 0
            ? availableProductsByDates.length
            : total,
        currentPage: page,
        totalPages: Math.ceil(
          (availableProductsByDates.length > 0
            ? availableProductsByDates.length
            : total) / onPage
        ),
      },
    };
  }

  @Query(() => Product, { nullable: true })
  async getProductById(
    @Arg("param", () => String) param: string
  ): Promise<Product | null> {
    let product: Product | null = null;

    if (!isNaN(Number(param))) {
      const id = Number(param);
      product = await Product.findOne({
        where: { id },
        relations: { categories: true, createdBy: true, variants: true },
      });
    } else {
      product = await Product.findOne({
        where: { name: param },
        relations: { categories: true, createdBy: true, variants: true },
      });
    }

    return product;
  }

  @Query(() => Product, { nullable: true })
  @UseMiddleware(ErrorCatcher)
  async getProductByVariantId(
    @Arg("id", () => ID) id: number
  ): Promise<Product | null> {
    const variant = await Variant.findOne({
      where: { id },
      relations: { product: true },
    });

    if (!variant) {
      throw new GraphQLError("Variant not found", {
        extensions: {
          code: "VARIANT_NOT_FOUND",
          http: { status: 404 },
        },
      });
    }

    const product = await Product.findOne({
      where: { id: variant.product.id },
      relations: { categories: true, createdBy: true, variants: true },
    });

    if (!product) {
      throw new GraphQLError("Product not found", {
        extensions: {
          code: "PRODUCT_NOT_FOUND",
          http: { status: 404 },
        },
      });
    }

    return product;
  }

  @Authorized(["admin"])
  @Mutation(() => Product)
  async createProduct(
    @Arg("data", () => ProductCreateInput) data: ProductCreateInput,
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
  async createProductWithVariants(
    @Arg("productData", () => ProductCreateInput)
    productData: ProductCreateInput,
    @Arg("variants", () => [VariantCreateNestedInput], { nullable: true })
    variants: VariantCreateNestedInput[],
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
  async updateProduct(
    @Arg("id", () => String) _id: string,
    @Arg("data", () => ProductUpdateInput) data: ProductUpdateInput
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
  async deleteProduct(
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
