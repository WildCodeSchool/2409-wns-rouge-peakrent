import { Product, ProductWithCount } from "@/entities/Product";
import { StoreVariant } from "@/entities/StoreVariant";
import { Variant } from "@/entities/Variant";
import { checkStockByVariantAndStore } from "@/helpers/checkStockByVariantAndStore";
import { GraphQLError } from "graphql";
import { Arg, ID, Int, Query, Resolver } from "type-graphql";
import { ILike, In } from "typeorm";

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
    const where: any = { isPublished: true };
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
      order: { createdAt: "DESC" },
    });

    for (const p of products) {
      p.variants = (p.variants ?? []).filter((v) => v?.isPublished === true);
    }

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

  @Query(() => ProductWithCount)
  async getPublishedProducts(
    @Arg("page", () => Int, { defaultValue: 1 }) page: number,
    @Arg("onPage", () => Int, { defaultValue: 15 }) onPage: number,
    @Arg("categoryIds", () => [Int], { nullable: true }) categoryIds?: number[],
    @Arg("activityIds", () => [Int], { nullable: true }) activityIds?: number[],
    @Arg("startingDate", () => Date, { nullable: true }) startingDate?: Date,
    @Arg("endingDate", () => Date, { nullable: true }) endingDate?: Date,
    @Arg("search", () => String, { nullable: true }) search?: string
  ): Promise<ProductWithCount> {
    if (!startingDate && !endingDate) {
      const where: any = { isPublished: true };

      if (categoryIds?.length) {
        where.categories = { id: In(categoryIds) };
      }
      if (activityIds?.length) {
        where.activities = { id: In(activityIds) };
      }
      if (search && search.trim() !== "") {
        where.name = ILike(`%${search}%`);
      }

      const [products, total] = await Product.findAndCount({
        skip: (page - 1) * onPage,
        take: onPage,
        where,
        relations: {
          categories: true,
          activities: true,
          createdBy: true,
          variants: true,
        },
        order: { createdAt: "DESC" },
      });

      for (const p of products) {
        p.variants = (p.variants ?? []).filter((v) => v?.isPublished === true);
      }

      return {
        products,
        pagination: {
          total,
          currentPage: page,
          totalPages: Math.max(1, Math.ceil(total / onPage)),
        },
      };
    }

    const baseWhere: any = { isPublished: true };
    if (categoryIds?.length) baseWhere.categories = { id: In(categoryIds) };
    if (activityIds?.length) baseWhere.activities = { id: In(activityIds) };
    if (search && search.trim() !== "") baseWhere.name = ILike(`%${search}%`);

    const candidates = await Product.find({
      select: { id: true, createdAt: true },
      where: baseWhere,
      relations: {
        categories: !!categoryIds?.length,
        activities: !!activityIds?.length,
      },
      order: { createdAt: "DESC" },
    });
    const candidateIds = candidates.map((c) => c.id);

    const availableIds: number[] = [];
    for (const id of candidateIds) {
      const storeVariants = await StoreVariant.find({
        where: { variant: { product: { id } } },
        relations: { variant: { product: true } },
      });

      let hasQuantity = false;
      for (const sv of storeVariants) {
        const qty = await checkStockByVariantAndStore(
          sv.storeId,
          sv.variantId,
          startingDate!,
          endingDate!
        );
        if (qty > 0) {
          hasQuantity = true;
          break;
        }
      }
      if (hasQuantity) availableIds.push(id);
    }

    const total = availableIds.length;
    const start = (page - 1) * onPage;
    const pageIds = availableIds.slice(start, start + onPage);

    if (pageIds.length === 0) {
      return {
        products: [],
        pagination: {
          total,
          currentPage: page,
          totalPages: Math.max(1, Math.ceil(total / onPage)),
        },
      };
    }

    const productsPage = await Product.find({
      where: { id: In(pageIds) },
      relations: {
        categories: true,
        activities: true,
        createdBy: true,
        variants: true,
      },
    });

    const orderIndex = new Map<number, number>();
    pageIds.forEach((id, idx) => orderIndex.set(id, idx));
    productsPage.sort((a, b) => orderIndex.get(a.id)! - orderIndex.get(b.id)!);

    for (const p of productsPage) {
      p.variants = (p.variants ?? []).filter((v) => v?.isPublished === true);
    }

    return {
      products: productsPage,
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.max(1, Math.ceil(total / onPage)),
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
}
