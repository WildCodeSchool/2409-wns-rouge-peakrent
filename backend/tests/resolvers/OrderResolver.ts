import {
  CREATE_ORDER,
  GET_ORDER_BY_ID,
} from "../../../frontend/src/GraphQL/order";
import { Order } from "../../src/entities/Order";
import { assert, TestArgsType } from "../index.spec";
import { getQueryFromMutation } from "../utils/getQueryFromMutation";

export function OrderResolverTest(testArgs: TestArgsType) {
  const datas = {
    address1: "Adresse 1",
    address2: "Adresse 2",
    city: "Lyon",
    country: "France",
    paymentMethod: "card",
    reference: "2562",
    zipCode: "6200",
    paidAt: new Date(),
  };

  it("should not create an order from a regular user", async () => {
    const response = await testArgs.server.executeOperation<{
      createOrder: Order;
    }>({
      query: getQueryFromMutation(CREATE_ORDER),
      variables: {
        data: {
          address1: datas.address1,
          address2: datas.address2,
          city: datas.city,
          country: datas.country,
          paymentMethod: datas.paymentMethod,
          profile: testArgs.data.user?.id,
          reference: datas.reference,
          zipCode: datas.zipCode,
          paidAt: datas.paidAt,
        },
      },
    });
    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeDefined();
    expect(response.body.singleResult.data?.createOrder).toBeUndefined();
  });

  it("should create an order for admin", async () => {
    const response = await testArgs.server.executeOperation<{
      createOrder: Order;
    }>(
      {
        query: getQueryFromMutation(CREATE_ORDER),
        variables: {
          data: {
            address1: datas.address1,
            address2: datas.address2,
            city: datas.city,
            country: datas.country,
            paymentMethod: datas.paymentMethod,
            profile: testArgs.data.user?.id,
            reference: "Ref122",
            zipCode: datas.zipCode,
            paidAt: datas.paidAt,
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
    console.log(response.body.singleResult.errors);
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.createOrder?.id).toBeDefined();

    const orderFromDb = await Order.findOne({
      where: { id: response.body.singleResult.data?.createOrder?.id },
      relations: { profile: true },
    });

    testArgs.data.order = orderFromDb;
  });

  it("should not create an order for a connected user", async () => {
    const response = await testArgs.server.executeOperation<{
      createOrder: Order;
    }>(
      {
        query: getQueryFromMutation(CREATE_ORDER),
        variables: {
          data: {
            address1: datas.address1,
            address2: datas.address2,
            city: datas.city,
            country: datas.country,
            paymentMethod: datas.paymentMethod,
            profile: testArgs.data.user?.id,
            reference: datas.reference,
            zipCode: datas.zipCode,
            paidAt: datas.paidAt,
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
    expect(response.body.singleResult.data?.createOrder).toBeUndefined();
  });

  it("should create an order for admin with empty adress2 and paidAt", async () => {
    const response = await testArgs.server.executeOperation<{
      createOrder: Order;
    }>(
      {
        query: getQueryFromMutation(CREATE_ORDER),
        variables: {
          data: {
            address1: datas.address1,
            city: datas.city,
            country: datas.country,
            paymentMethod: datas.paymentMethod,
            profile: testArgs.data.user?.id,
            reference: "Ref152",
            zipCode: datas.zipCode,
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
    console.log(response.body.singleResult.errors);
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.createOrder?.id).toBeDefined();
  });

  it("should display order information for a user from an order", async () => {
    const response = await testArgs.server.executeOperation<{
      getOrderById: Order;
    }>(
      {
        query: getQueryFromMutation(GET_ORDER_BY_ID),
        variables: {
          getOrderByIdId: testArgs.data.order?.id,
        },
      },
      {
        contextValue: {
          user: { id: testArgs.data.user?.id, role: "user" },
        },
      }
    );
    assert(response.body.kind === "single");
    console.log(response.body.singleResult.errors);
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.getOrderById?.id).toBeDefined();
  });

  it("should not display order information for user who does not have that order", async () => {
    const response = await testArgs.server.executeOperation<{
      getOrderById: Order;
    }>(
      {
        query: getQueryFromMutation(GET_ORDER_BY_ID),
        variables: {
          getOrderByIdId: testArgs.data.order?.id,
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
    expect(response.body.singleResult.data?.getOrderById).toBeUndefined();
  });

  it("should display order information for admin who does not have that order", async () => {
    const response = await testArgs.server.executeOperation<{
      getOrderById: Order;
    }>(
      {
        query: getQueryFromMutation(GET_ORDER_BY_ID),
        variables: {
          getOrderByIdId: testArgs.data.order?.id,
        },
      },
      {
        contextValue: {
          user: { id: 999, role: "admin" },
        },
      }
    );
    assert(response.body.kind === "single");
    console.log(response.body.singleResult.errors);
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.getOrderById?.id).toBeDefined();
  });
}
