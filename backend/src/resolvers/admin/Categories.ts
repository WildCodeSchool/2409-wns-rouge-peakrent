import { dataSource } from "@/config/db";
import {
  Category,
  CategoryCreateInputAdmin,
  CategoryUpdateInputAdmin,
} from "@/entities/Category";
import { normalizeString } from "@/helpers/helpers";
import { ErrorCatcher } from "@/middlewares/errorHandler";
import { AuthContextType, RoleType } from "@/types";
import { validate } from "class-validator";
import { GraphQLError } from "graphql";
import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { In } from "typeorm";

@Resolver(Category)
export class CategoryResolverAdmin {
  @Authorized([RoleType.admin, RoleType.superadmin])
  @Mutation(() => Category)
  @UseMiddleware(ErrorCatcher)
  async createCategoryAdmin(
    @Arg("data", () => CategoryCreateInputAdmin) data: CategoryCreateInputAdmin,
    @Ctx() context: AuthContextType
  ): Promise<Category> {
    const user = context.user;

    const newCategory = new Category();

    Object.assign(newCategory, {
      name: data.name,
      variant: data.variant,
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

      if (data.childrens && data.childrens.length > 0) {
        const subCategories = data.childrens.map((subCategory) => {
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
          newCategory.childrens.push(subCategory);
        }
      }
    });

    return newCategory;
  }

  @Authorized([RoleType.admin, RoleType.superadmin])
  @Mutation(() => Category, { nullable: true })
  @UseMiddleware(ErrorCatcher)
  async updateCategoryAdmin(
    @Arg("id", () => ID) _id: number,
    @Arg("data", () => CategoryUpdateInputAdmin) data: CategoryUpdateInputAdmin,
    @Ctx() context: AuthContextType
  ): Promise<Category | null> {
    const id = Number(_id);
    const user = context.user;

    const category = await Category.findOne({
      where: { id, createdBy: { id: user.id } },
    });

    if (!category) {
      throw new GraphQLError(`Category not found`, {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 },
        },
      });
    }

    Object.assign(category, {
      name: data.name,
      variant: data.variant,
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

      if (data.childrens && data.childrens.length > 0) {
        const existingChildren = await Category.find({
          where: { parentCategory: { id: category.id } },
        });
        const childrenToDelete = existingChildren.filter(
          (child) =>
            !data.childrens.some((inputChild) => inputChild.id === child.id)
        );
        await Category.remove(childrenToDelete);

        for (const subCategoryInput of data.childrens) {
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
          category.childrens.push(subCategory);
        }
      }
    });

    return category;
  }

  @Authorized([RoleType.admin, RoleType.superadmin])
  @Mutation(() => Category, { nullable: true })
  @UseMiddleware(ErrorCatcher)
  async deleteCategoryAdmin(
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
      throw new GraphQLError(`Category not found`, {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 },
        },
      });
    }
  }

  @Authorized([RoleType.admin, RoleType.superadmin])
  @Mutation(() => [ID], { nullable: true })
  @UseMiddleware(ErrorCatcher)
  async deleteCategoriesAdmin(
    @Arg("ids", () => [ID]) ids: number[]
  ): Promise<number[] | null> {
    const categories = await Category.find({
      where: {
        id: In(ids),
      },
    });

    if (categories.length === 0) {
      throw new GraphQLError("No category found", {
        extensions: {
          code: "NOT_FOUND",
          http: { status: 404 },
        },
      });
    }

    const deletedIds = categories.map((category) => category.id);
    await Category.remove(categories);

    return deletedIds;
  }
}
