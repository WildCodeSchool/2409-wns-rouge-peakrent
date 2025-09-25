import { Store } from "@/entities/Store";
import { RoleType } from "@/types";
import { mutationCreateStore } from "../api/createStore";
import { assert, TestArgsType } from "../index.spec";

export const datas = {
  name: "Super Store",
  phoneNumber: "0123456789",
  address1: "123 Main Street",
  city: "Paris",
  zipCode: "75000",
  country: "France",
  reference: "STORE123",
};

export function StoresResolverTest(testArgs: TestArgsType) {
  // pentest create store
  it("should not create a store from a regular user", async () => {
    const response = await testArgs.server.executeOperation<{
      createStoreAdmin: Store;
    }>(
      {
        query: mutationCreateStore,
        variables: {
          data: datas,
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
    expect(response.body.singleResult.errors[0].extensions.code).toBe(
      "UNAUTHORIZED"
    );
    expect(response.body.singleResult.data?.createStoreAdmin).toBeUndefined();
  });

  it("should not create a store from an admin", async () => {
    const response = await testArgs.server.executeOperation<{
      createStoreAdmin: Store;
    }>(
      {
        query: mutationCreateStore,
        variables: {
          data: datas,
        },
      },
      {
        contextValue: {
          user: testArgs.data.admin,
        },
      }
    );

    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeDefined();
    expect(response.body.singleResult.errors[0].extensions.code).toBe(
      "UNAUTHORIZED"
    );
    expect(response.body.singleResult.data?.createStoreAdmin).toBeUndefined();
  });

  //TODO add super admin role
  it("should create a store from a super admin", async () => {
    const response = await testArgs.server.executeOperation<{
      createStoreAdmin: Store;
    }>(
      {
        query: mutationCreateStore,
        variables: {
          data: datas,
        },
      },
      {
        contextValue: {
          user: { user: testArgs.data.user, role: RoleType.superadmin },
        },
      }
    );

    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.createStoreAdmin?.id).toBeDefined();
  });
}
