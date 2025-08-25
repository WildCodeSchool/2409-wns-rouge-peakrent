import {
  CREATE_ORDER,
  GET_ORDER_BY_REF,
} from "../../../frontend/src/graphQL/order";
import { Order } from "../../src/entities/Order";
import { generateOrderReference } from "../../src/helpers/generateOrderReference";
import { assert, TestArgsType } from "../index.spec";
import { getQueryFromMutation } from "../utils/getQueryFromMutation";

export function OrderResolverTest(testArgs: TestArgsType) {
  const datas = {
    address1: "Adresse 1",
    address2: "Adresse 2",
    city: "Lyon",
    country: "France",
    paymentMethod: "card",
    reference: generateOrderReference(new Date().toISOString()),
    zipCode: "6200",
    paidAt: new Date(),
    date: new Date(),
  };

  it("should not create an order from a regular user", async () => {
    const response = await testArgs.server.executeOperation<{
      createOrderAdmin: Order;
    }>({
      query: getQueryFromMutation(CREATE_ORDER),
      variables: {
        data: {
          ...datas,
          profileId: testArgs.data.user?.id,
        },
      },
    });
    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeDefined();
    expect(response.body.singleResult.data?.createOrderAdmin).toBeUndefined();
  });

  it("should create an order for admin", async () => {
    const response = await testArgs.server.executeOperation<{
      createOrderAdmin: Order;
    }>(
      {
        query: getQueryFromMutation(CREATE_ORDER),
        variables: {
          data: {
            ...datas,
            profileId: testArgs.data.user?.id,
          },
        },
      },
      {
        contextValue: {
          user: { user: testArgs.data.user, role: "admin" },
        },
      }
    );
    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.createOrderAdmin?.id).toBeDefined();

    const orderFromDb = await Order.findOne({
      where: { id: response.body.singleResult.data?.createOrderAdmin?.id },
      relations: { profile: true },
    });

    testArgs.data.order = orderFromDb;
  });

  it("should not create an order for a connected user", async () => {
    const response = await testArgs.server.executeOperation<{
      createOrderAdmin: Order;
    }>(
      {
        query: getQueryFromMutation(CREATE_ORDER),
        variables: {
          data: {
            ...datas,
            profileId: testArgs.data.user?.id,
          },
        },
      },
      {
        contextValue: {
          user: { user: testArgs.data.user, role: "user" },
        },
      }
    );
    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeDefined();
    expect(response.body.singleResult.data?.createOrderAdmin).toBeUndefined();
  });

  it("should create an order for admin with empty adress2 and paidAt", async () => {
    const response = await testArgs.server.executeOperation<{
      createOrderAdmin: Order;
    }>(
      {
        query: getQueryFromMutation(CREATE_ORDER),
        variables: {
          data: {
            address1: datas.address1,
            city: datas.city,
            country: datas.country,
            paymentMethod: datas.paymentMethod,
            profileId: testArgs.data.user?.id,
            reference: "Ref152",
            zipCode: datas.zipCode,
            date: datas.date,
          },
        },
      },
      {
        contextValue: {
          user: { user: testArgs.data.user, role: "admin" },
        },
      }
    );
    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.createOrderAdmin?.id).toBeDefined();
  });

  it("should display order information for a user from an order", async () => {
    const response = await testArgs.server.executeOperation<{
      getOrderByReference: Order;
    }>(
      {
        query: getQueryFromMutation(GET_ORDER_BY_REF),
        variables: {
          reference: testArgs.data.order?.reference,
        },
      },
      {
        contextValue: {
          user: { id: testArgs.data.user?.id, role: "user" },
        },
      }
    );
    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(
      response.body.singleResult.data?.getOrderByReference?.id
    ).toBeDefined();
  });

  it("should not display order information for user who does not have that order", async () => {
    const response = await testArgs.server.executeOperation<{
      getOrderByReference: Order;
    }>(
      {
        query: getQueryFromMutation(GET_ORDER_BY_REF),
        variables: {
          reference: testArgs.data.order?.id,
        },
      },
      {
        contextValue: {
          user: { id: 999, role: "user" },
        },
      }
    );
    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeDefined();
    expect(
      response.body.singleResult.data?.getOrderByReference
    ).toBeUndefined();
  });

  it("should display order information for admin who does not have that order", async () => {
    const response = await testArgs.server.executeOperation<{
      getOrderByReference: Order;
    }>(
      {
        query: getQueryFromMutation(GET_ORDER_BY_REF),
        variables: {
          reference: testArgs.data.order?.reference,
        },
      },
      {
        contextValue: {
          user: { id: 999, role: "admin" },
        },
      }
    );
    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(
      response.body.singleResult.data?.getOrderByReference?.id
    ).toBeDefined();
  });
}
