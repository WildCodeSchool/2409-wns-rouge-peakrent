import { validate, ValidationError } from "class-validator";
import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { In } from "typeorm";
import { Category } from "../entities/Category";
import {
  Product,
  ProductCreateInput,
  ProductUpdateInput,
  ProductWithCount,
} from "../entities/Product";
import { normalizeString } from "../helpers/helpers";
import { AuthContextType } from "../types";

@Resolver(Product)
export class ProductResolver {
  @Query(() => ProductWithCount)
  async getProducts(
    @Arg("page", () => Int, { defaultValue: 1 }) page: number,
    @Arg("onPage", () => Int, { defaultValue: 15 }) onPage: number
  ): Promise<ProductWithCount> {
    const itemsToSkip = (page - 1) * onPage;

    const [products, total] = await Product.findAndCount({
      skip: itemsToSkip,
      take: onPage,
      relations: {
        categories: true,
        createdBy: true,
        variants: true,
      },
    });

    return {
      products,
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / onPage),
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
        relations: { categories: true, createdBy: true },
      });
    } else {
      product = await Product.findOne({
        where: { name: param },
        relations: { categories: true, createdBy: true },
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
  async updateProduct(
    @Arg("id", () => String) _id: string,
    @Arg("data", () => ProductUpdateInput) data: ProductUpdateInput,
    @Ctx() context: AuthContextType
  ) {
    const id = Number(_id);

    const product = await Product.findOne({
      where: { id, createdBy: { id: context.user.id } },
      relations: { categories: true },
    });

    if (!product) {
      return null;
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

    const validationErrors = await validate(product);
    if (validationErrors.length) {
      return validationErrors;
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
