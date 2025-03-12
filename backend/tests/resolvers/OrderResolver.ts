import { Category } from "../../src/entities/Category";
import { mutationCreateOrder } from "../api/order";
import { assert, TestArgsType } from "../index.spec";

export function OrderResolverTest(testArgs: TestArgsType) {
  // pentest create category
  it("should not create an order from a regular user", async () => {
    const response = await testArgs.server.executeOperation<{
      createCategory: Category;
    }>(
      {
        query: mutationCreateOrder,
        variables: {
          data: {
            address_1: "Adresse 1",
            address_2: "Adresse 2",
            city: "Lyon",
            country: "France",
            payment_method: "cart",
            profile_id: 1,
            reference: "2562",
            zip_code: "6200",
          },
        },
      },
      {
        contextValue: {
          user: testArgs.data.user,
        },
      }
    );

    // check API response
    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeDefined();
    expect(response.body.singleResult.data?.createCategory).toBeUndefined();
  });

  // test create category resolver
  it("should create a category", async () => {
    const response = await testArgs.server.executeOperation<{
      createCategory: Category;
    }>(
      {
        query: mutationCreateOrder,
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

    // check API response
    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.createCategory?.id).toBeDefined();
    testArgs.data.categoryId =
      response.body.singleResult.data?.createCategory?.id;
  });
}
