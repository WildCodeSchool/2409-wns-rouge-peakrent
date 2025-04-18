import { Category } from "../../src/entities/Category";
import { mutationCreateCategory } from "../api/createCategory";
import { assert, TestArgsType } from "../index.spec";

const category = {
  name: "My first category",
  variant: "orange",
  childrens: [
    {
      name: "My first child category",
      variant: "orange",
    },
  ],
};

export function CategoriesResolverTest(testArgs: TestArgsType) {
  it("should not create a category from a regular user", async () => {
    const response = await testArgs.server.executeOperation<{
      createCategory: Category;
    }>(
      {
        query: mutationCreateCategory,
        variables: {
          input: category,
        },
      },
      {
        contextValue: {
          user: testArgs.data.user,
        },
      }
    );

    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeDefined();
    expect(response.body.singleResult.data?.createCategory).toBeUndefined();
  });

  it("should create a category with 1 children", async () => {
    const response = await testArgs.server.executeOperation<{
      createCategory: Category;
    }>(
      {
        query: mutationCreateCategory,
        variables: {
          input: category,
        },
      },
      {
        contextValue: {
          user: testArgs.data.admin,
        },
      }
    );

    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.createCategory?.id).toBeDefined();
    expect(
      response.body.singleResult.data?.createCategory?.childrens.length
    ).toBe(1);
    testArgs.data.categoryId =
      response.body.singleResult.data?.createCategory?.id;
  });
}
