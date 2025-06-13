import {
  CategoriesWithCount,
  Category,
  CategoryPaginationInput,
} from "@/entities/Category";
import { GraphQLError } from "graphql";
import { Arg, ID, Query, Resolver } from "type-graphql";
import { IsNull } from "typeorm";

@Resolver(Category)
export class CategoryResolver {
  @Query(() => CategoriesWithCount)
  async getCategories(
    @Arg("data", () => CategoryPaginationInput) data: CategoryPaginationInput
  ): Promise<CategoriesWithCount> {
    const { page, onPage, sort, order, onlyParent } = data;

    const [categories, total] = await Category.findAndCount({
      relations: { products: true, parentCategory: true, childrens: true },
      skip: (page - 1) * onPage,
      take: onPage,
      order: { [sort]: order },
      where: onlyParent ? { parentCategory: IsNull() } : undefined,
    });
    return {
      categories,
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / onPage),
      },
    };
  }

  @Query(() => Category, { nullable: true })
  async getCategoryById(
    @Arg("id", () => ID) _id: number
  ): Promise<Category | null> {
    const id = Number(_id);
    const category = await Category.findOne({
      where: { id },
    });

    if (!category) {
      throw new GraphQLError("Category not found", {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 },
        },
      });
    }

    return category;
  }
}
