import { validate } from "class-validator";
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
import {
  Category,
  CategoryCreateInput,
  CategoryUpdateInput,
  CategoryWithCount,
} from "../entities/Category";
import { Product } from "../entities/Product";
import { normalizeString } from "../helpers/helpers";
import { AuthContextType } from "../types";

@Resolver(Category)
export class CategoryResolver {
  @Query(() => [Category])
  async getCategories(): Promise<Category[]> {
    const categories = await Category.find({
      relations: { products: true, parentCategory: true, children: true },
    });
    return categories;
  }

  @Query(() => CategoryWithCount, { nullable: true })
  async getCategoryById(
    @Arg("param", () => String) param: string,
    @Arg("page", () => Int, { defaultValue: 1 }) page: number,
    @Arg("onPage", () => Int, { defaultValue: 15 })
    onPage: number
  ): Promise<CategoryWithCount | null> {
    const isId = !isNaN(Number(param));
    const whereCondition = isId ? { id: Number(param) } : { name: param };

    const category = await Category.findOne({
      where: whereCondition,
      relations: {
        products: true,
        createdBy: true,
        parentCategory: true,
        children: true,
      },
    });

    if (!category) return null;

    const skip = (page - 1) * onPage;

    const [products, total] = await Product.findAndCount({
      where: { categories: { id: category.id } },
      relations: { categories: true, createdBy: true },
      skip,
      take: onPage,
    });

    return {
      category,
      products,
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / onPage),
      },
    };
  }

  @Authorized(["admin"])
  @Mutation(() => Category)
  async createCategory(
    @Arg("data", () => CategoryCreateInput) data: CategoryCreateInput,
    @Ctx() context: AuthContextType
  ): Promise<Category> {
    const newCategory = new Category();
    const user = context.user;

    Object.assign(newCategory, data, { created_by: user });
    newCategory.normalizedName = normalizeString(newCategory.name);

    const errors = await validate(newCategory);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    } else {
      await newCategory.save();
      return newCategory;
    }
  }

  @Authorized()
  @Mutation(() => Category, { nullable: true })
  async updateCategory(
    @Arg("id", () => ID) _id: number,
    @Arg("data", () => CategoryUpdateInput) data: CategoryUpdateInput,
    @Ctx() context: AuthContextType
  ): Promise<Category | null> {
    const id = Number(_id);

    const category = await Category.findOne({
      where: { id, createdBy: { id: context.user.id } },
    });
    if (category !== null) {
      Object.assign(category, data);

      const errors = await validate(category);
      if (errors.length > 0) {
        throw new Error(`Validation error: ${JSON.stringify(errors)}`);
      } else {
        await category.save();
        return category;
      }
    } else {
      return null;
    }
  }

  @Authorized()
  @Mutation(() => Category, { nullable: true })
  async deleteCategory(
    @Arg("id", () => ID) _id: number,
    @Ctx() context: AuthContextType
  ): Promise<Category | null> {
    const id = Number(_id);
    const category = await Category.findOne({
      where: { id, createdBy: { id: context.user.id } },
    });
    if (category !== null) {
      await category.remove();
      return category;
    } else {
      return null;
    }
  }
}
