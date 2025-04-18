import { validate } from "class-validator";
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
import { In, IsNull } from "typeorm";
import { dataSource } from "../config/db";
import {
  CategoriesWithCount,
  Category,
  CategoryCreateInput,
  CategoryPaginationInput,
  CategoryUpdateInput,
  CategoryWithCount,
} from "../entities/Category";
import { Product } from "../entities/Product";
import { normalizeString } from "../helpers/helpers";
import { ErrorCatcher } from "../middlewares/errorHandler";
import { AuthContextType } from "../types";

@Resolver(Category)
export class CategoryResolver {
  @Query(() => CategoriesWithCount)
  async getCategories(
    @Arg("input", () => CategoryPaginationInput) input: CategoryPaginationInput
  ): Promise<CategoriesWithCount> {
    const { page, onPage, sort, order, onlyParent } = input;

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
        childrens: true,
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

  @Authorized(["admin", "superadmin"])
  @Mutation(() => Category)
  @UseMiddleware(ErrorCatcher)
  async createCategory(
    @Arg("input", () => CategoryCreateInput) input: CategoryCreateInput,
    @Ctx() context: AuthContextType
  ): Promise<Category> {
    const user = context.user;

    const newCategory = new Category();

    Object.assign(newCategory, {
      name: input.name,
      variant: input.variant,
      createdBy: user,
    });
    newCategory.normalizedName = normalizeString(newCategory.name);

    const errors = await validate(newCategory);
    if (errors.length > 0) {
      throw new GraphQLError("Validation error", {
        extensions: {
          code: "VALIDATION_ERROR",
          http: { status: 400 },
        },
      });
    }

    await dataSource.manager.transaction(async () => {
      await newCategory.save();
      newCategory.childrens = [];

      if (input.childrens && input.childrens.length > 0) {
        const subCategories = input.childrens.map((subCategory) => {
          const newSubCategory = new Category();
          Object.assign(newSubCategory, {
            name: subCategory.name,
            variant: subCategory.variant,
            parentCategory: newCategory,
            createdBy: user,
          });
          newSubCategory.normalizedName = normalizeString(newSubCategory.name);
          return newSubCategory;
        });

        for (const subCategory of subCategories) {
          const subErrors = await validate(subCategory);
          if (subErrors.length > 0) {
            throw new GraphQLError(
              `Validation error for subcategory: ${JSON.stringify(subErrors)}`,
              {
                extensions: {
                  code: "VALIDATION_ERROR",
                  http: { status: 400 },
                },
              }
            );
          }
          await subCategory.save();
          Object.assign(newCategory, {
            childrens:
              newCategory.childrens && newCategory.childrens.length > 0
                ? [...newCategory.childrens, subCategory]
                : [subCategory],
          });
        }
      }
    });

    return newCategory;
  }

  @Authorized(["admin", "superadmin"])
  @Mutation(() => Category, { nullable: true })
  @UseMiddleware(ErrorCatcher)
  async updateCategory(
    @Arg("id", () => ID) _id: number,
    @Arg("input", () => CategoryUpdateInput) input: CategoryUpdateInput,
    @Ctx() context: AuthContextType
  ): Promise<Category | null> {
    const id = Number(_id);
    const user = context.user;

    const category = await Category.findOne({
      where: { id, createdBy: { id: user.id } },
    });

    if (!category) {
      return null;
    }

    Object.assign(category, {
      name: input.name,
      variant: input.variant,
    });
    category.normalizedName = normalizeString(category.name);

    const errors = await validate(category);
    if (errors.length > 0) {
      throw new GraphQLError("Validation error", {
        extensions: {
          code: "VALIDATION_ERROR",
          http: { status: 400 },
        },
      });
    }

    await dataSource.manager.transaction(async () => {
      await category.save();
      category.childrens = [];

      if (input.childrens && input.childrens.length > 0) {
        const existingChildren = await Category.find({
          where: { parentCategory: { id: category.id } },
        });
        const childrenToDelete = existingChildren.filter(
          (child) =>
            !input.childrens.some((inputChild) => inputChild.id === child.id)
        );
        await Category.remove(childrenToDelete);

        for (const subCategoryInput of input.childrens) {
          let subCategory: Category;
          if (subCategoryInput.id) {
            subCategory = await Category.findOne({
              where: {
                id: subCategoryInput.id,
                parentCategory: { id: category.id },
              },
            });
            if (!subCategory) continue;
          } else {
            subCategory = new Category();
          }

          Object.assign(subCategory, {
            name: subCategoryInput.name,
            variant: subCategoryInput.variant,
            parentCategory: category,
            createdBy: user,
          });
          subCategory.normalizedName = normalizeString(subCategory.name);

          const subErrors = await validate(subCategory);
          if (subErrors.length > 0) {
            throw new GraphQLError(
              `Validation error for subcategory: ${JSON.stringify(subErrors)}`,
              {
                extensions: {
                  code: "VALIDATION_ERROR",
                  http: { status: 400 },
                },
              }
            );
          }
          await subCategory.save();
          Object.assign(category, {
            childrens:
              category.childrens && category.childrens.length > 0
                ? [...category.childrens, subCategory]
                : [subCategory],
          });
        }
      }
    });

    return category;
  }

  @Authorized(["admin", "superadmin"])
  @Mutation(() => Category, { nullable: true })
  @UseMiddleware(ErrorCatcher)
  async deleteCategory(
    @Arg("id", () => ID) _id: number
  ): Promise<Category | null> {
    const id = Number(_id);
    const category = await Category.findOne({
      where: { id },
    });
    if (category !== null) {
      await category.remove();
      return category;
    } else {
      throw new GraphQLError(`La catégorie n'existe pas`, {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 },
        },
      });
    }
  }

  @Authorized(["admin", "superadmin"])
  @Mutation(() => [ID], { nullable: true })
  @UseMiddleware(ErrorCatcher)
  async deleteCategories(
    @Arg("ids", () => [ID]) ids: number[]
  ): Promise<number[] | null> {
    const categories = await Category.find({
      where: {
        id: In(ids),
      },
    });

    if (categories.length === 0) {
      throw new GraphQLError("Aucune catégorie trouvée", {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 },
        },
      });
    }

    const deletedIds = categories.map((category) => category.id);
    await Category.remove(categories);
    console.log(deletedIds);

    return deletedIds;
  }
}
