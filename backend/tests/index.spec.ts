import { ApolloServer, BaseContext } from "@apollo/server";
import { DataSource } from "typeorm";
import { CREATE_USER } from "../../frontend/src/GraphQL/createUser";
import { dataSource } from "../src/config/db";
import { Profile } from "../src/entities/Profile";
import { User } from "../src/entities/User";
import { getSchema } from "../src/schema";
import { RoleType } from "../src/types";
import { CategoriesResolverTest } from "./resolvers/CategoriesResolver";
import { OrderResolverTest } from "./resolvers/OrderResolver";
import { StoresResolverTest } from "./resolvers/StoresResolver";
import { UsersResolverTest } from "./resolvers/UsersResolver";
import { getQueryFromMutation } from "./utils/getQueryFromMutation";

export type TestArgsType = {
  server: ApolloServer<BaseContext>;
  dataSource: DataSource;
  data: any;
};

const testArgs: TestArgsType = {
  server: null,
  dataSource: null,
  data: {},
};

export function assert(expr: unknown, msg?: string): asserts expr {
  if (!expr) throw new Error(msg);
}

export const setupTestUsers = async (testArgs: TestArgsType) => {
  const userResponse = await testArgs.server.executeOperation<{
    createUser: User;
  }>({
    query: getQueryFromMutation(CREATE_USER),
    variables: {
      data: {
        email: "user@example.com",
        password: "SuperSecret!2025",
        confirmPassword: "SuperSecret!2025",
        firstname: "Regular",
        lastname: "User",
      },
    },
  });

  const adminResponse = await testArgs.server.executeOperation<{
    createUser: User;
  }>({
    query: getQueryFromMutation(CREATE_USER),
    variables: {
      data: {
        email: "admin@example.com",
        password: "SuperSecret!2025",
        confirmPassword: "SuperSecret!2025",
        firstname: "Admin",
        lastname: "User",
      },
    },
  });

  assert(userResponse.body.kind === "single");
  testArgs.data.user = userResponse.body.singleResult.data?.createUser;

  assert(adminResponse.body.kind === "single");
  testArgs.data.admin = adminResponse.body.singleResult.data?.createUser;

  const adminProfile = await Profile.findOne({
    where: { id: testArgs.data.admin.id },
  });

  adminProfile.role = RoleType.admin;
  await adminProfile.save();

  testArgs.data.admin.role = RoleType.admin;
};

beforeAll(async () => {
  await dataSource.initialize();
  try {
    const entities = dataSource.entityMetadatas;
    const tableNames = entities
      .map((entity) => `"${entity.tableName}"`)
      .join(", ");
    await dataSource.query(`TRUNCATE ${tableNames} CASCADE;`);
  } catch (error) {
    throw new Error(`ERROR: Cleaning test database: ${error}`);
  }

  const schema = await getSchema();

  const testServer = new ApolloServer({
    schema,
  });
  testArgs.server = testServer;

  await setupTestUsers(testArgs);

  testArgs.dataSource = dataSource;
});

describe("Users resolvers", () => {
  UsersResolverTest(testArgs);
});

describe("order resolver", () => {
  OrderResolverTest(testArgs);
});

describe("categories resolver", () => {
  CategoriesResolverTest(testArgs);
});

describe("stores resolver", () => {
  StoresResolverTest(testArgs);
});

afterAll(async () => {
  await dataSource.destroy();
});
