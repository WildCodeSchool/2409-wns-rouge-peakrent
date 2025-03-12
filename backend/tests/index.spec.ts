import { ApolloServer, BaseContext } from "@apollo/server";
import { DataSource } from "typeorm";
import { dataSource } from "../src/config/db";
import { getSchema } from "../src/schema";
import { UsersResolverTest } from "./resolvers/UsersResolver";
import { User } from "../src/entities/User";
import { CategoriesResolverTest } from "./resolvers/CategoriesResolver";

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
  console.log(
    "------------------------------------------------------ Setting up test users ------------------------------------------------------"
  );
  const userResponse = await testArgs.server.executeOperation<{
    createUser: User;
  }>({
    query: `
      mutation CreateUser($data: UserCreateInput!) {
        createUser(data: $data) {
          id
          email
          firstname
          lastname
          role
        }
      }
    `,
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
    query: `
      mutation CreateUser($data: UserCreateInput!) {
        createUser(data: $data) {
          id
          email
          firstname
          lastname
          role
        }
      }
    `,
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
  console.log(
    "------------------------------------------------------ Test users created ------------------------------------------------------"
  );
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

describe("users resolver", () => {
  UsersResolverTest(testArgs);
});

describe("categories resolver", () => {
  CategoriesResolverTest(testArgs);
});

afterAll(async () => {
  await dataSource.destroy();
});
