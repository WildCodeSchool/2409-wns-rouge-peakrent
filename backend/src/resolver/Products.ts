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
import {Product, ProductCreateInput, ProductUpdateInput, ProductWithCount} from "../entities/Product";
import {normalizeString} from "../helpers/helpers";
import {validate, ValidationError} from "class-validator";
import {In} from "typeorm";
import {AuthContextType} from "../types";
import {Category} from "../entities/Category";

@Resolver(Product)
export class ProductResolver {
    @Query(() => ProductWithCount)
    async getProducts(
        @Arg("page", () => Int, {defaultValue: 1}) page: number,
        @Arg("onPage", () => Int, {defaultValue: 15}) onPage: number
    ): Promise<ProductWithCount> {
        const itemsToSkip = (page - 1) * onPage;

        const [products, total] = await Product.findAndCount({
            skip: itemsToSkip,
            take: onPage,
            relations: {
                categories: true,
                created_by: true,
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

    @Query(() => Product, {nullable: true})
    async getProductById(
        @Arg("param", () => String) param: string
    ): Promise<Product | null> {
        let product: Product | null = null;

        if (!isNaN(Number(param))) {
            const id = Number(param);
            product = await Product.findOne({
                where: {id},
                relations: {categories: true, created_by: true},
            });
        } else {
            product = await Product.findOne({
                where: {name: param},
                relations: {categories: true, created_by: true},
            });
        }

        return product;
    }

    // @Authorized()
    @Mutation(() => Product)
    async createProduct(
        @Arg("data", () => ProductCreateInput) data: ProductCreateInput,
        @Ctx() context: AuthContextType
    ): Promise<Product | null | ValidationError[]> {
        const newProduct = new Product();
        const user = context.user;

        Object.assign(newProduct, data, {createdBy: user});
        newProduct.normalizedName = normalizeString(newProduct.name);

        if (data.categories && data.categories.length > 0) {
            const categoryIds = data.categories.map((category) => category.id);
            const fullCategories = await Category.find({
                where: {id: In(categoryIds)},
                relations: ["products"]
            });
            if (fullCategories.length === 0) {
                throw new Error(`No categories found for IDs: ${categoryIds.join(", ")}`);
            }
            newProduct.categories = fullCategories;
        }

        const validationErrors = await validate(newProduct);
        if (validationErrors.length > 0) {
            throw new Error(`Errors : ${JSON.stringify(validationErrors)}`);
        } else {
            await newProduct.save();
            return newProduct;
        }
    }

    // @Authorized()
    @Mutation(() => Product)
    async updateProduct(
        @Arg("id", () => String) _id: string,
        @Arg("data", () => ProductUpdateInput) data: ProductUpdateInput,
        @Ctx() context: AuthContextType
    ) {
        const id = Number(_id);

        const product = await Product.findOne({
            where: {id, created_by: {id: context.user.id}},
            relations: {categories: true},
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

            const fullTags = await Category.findBy({id: In(categoryIds)});

            product.categories = fullTags;
        }

        const validationErrors = await validate(product);
        if (validationErrors.length) {
            return validationErrors;
        }

        await product.save();
        return product;
    }

    // @Authorized()
    @Mutation(() => Product, {nullable: true})
    async deleteProduct(
        @Arg("id", () => ID) _id: number,
        @Ctx() context: AuthContextType
    ) {
        const id = Number(_id);
        const product = await Product.findOneBy({id, created_by: {id: context.user.id}});
        if (product !== null) {
            await product.remove();
            return product;
        } else {
            return null;
        }
    }
}
