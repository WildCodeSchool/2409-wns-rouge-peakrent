import { Category } from "../../src/entities/Category";
import { mutationCreateCategory } from "../api/createCategory";
import { assert, TestArgsType } from "../index.spec";

export function CategoriesResolverTest(testArgs: TestArgsType) {
  it("should not create a category from a regular user", async () => {
    const response = await testArgs.server.executeOperation<{
      createCategory: Category;
    }>(
      {
        query: mutationCreateCategory,
        variables: {
          data: {
            name: "My first category",
          },
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

  it("should create a category", async () => {
    const response = await testArgs.server.executeOperation<{
      createCategory: Category;
    }>(
      {
        query: mutationCreateCategory,
        variables: {
          data: {
            name: "My first category",
          },
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
    testArgs.data.categoryId =
      response.body.singleResult.data?.createCategory?.id;
  });
}
