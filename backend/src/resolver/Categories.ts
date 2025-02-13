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
} from "../entities/category";
import { Ad } from "../entities/ad";
import { normalizeString } from "../helpers/helpers";
import { AuthContextType } from "../types";
import { validate } from "class-validator";

@Resolver(Category)
export class CategoryResolver {
  @Query(() => [Category])
  async getCategories(): Promise<Category[]> {
    const categories = await Category.find({ relations: { ads: true } });
    console.log(categories);
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

    const skip = (page - 1) * onPage;

    const [ads, total] = await Ad.findAndCount({
      where: { category: whereCondition },
      relations: ["category", "category.createdBy"],
      skip: skip,
      take: onPage,
      // createdBy: true,
    });

    if (ads.length > 0) {
      const category = ads[0].category;
      return {
        category,
        ads,
        // createdBy,
        pagination: {
          total,
          currentPage: page,
          totalPages: Math.ceil(total / onPage),
        },
      };
    }
    return null;
  }

  @Authorized()
  @Mutation(() => Category)
  async createCategory(
    @Arg("data", () => CategoryCreateInput) data: CategoryCreateInput,
    @Ctx() context: AuthContextType
  ): Promise<Category> {
    const newCategory = new Category();
    const user = context.user;

    Object.assign(newCategory, data, { createdBy: user });
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
