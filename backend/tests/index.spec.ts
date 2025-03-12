import { ApolloServer, BaseContext } from "@apollo/server";
import { DataSource } from "typeorm";
import { dataSource } from "../src/config/db";
import { getSchema } from "../src/schema";
import { UsersResolverTest } from "./resolvers/UsersResolver";
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

  testArgs.dataSource = dataSource;
  testArgs.server = testServer;
});

// describe("users resolver", () => {
//   UsersResolverTest(testArgs);
// });

describe("categories resolver", () => {
  CategoriesResolverTest(testArgs);
});

afterAll(async () => {
  await dataSource.destroy();
});
