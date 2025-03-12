import { ApolloServer, BaseContext } from "@apollo/server";
import { DataSource } from "typeorm";
import { dataSource } from "../src/config/db";
import { User } from "../src/entities/User";
import { getSchema } from "../src/schema";
import { mutationCreateUser } from "./api/createUser";

const testArgs: {
  server: ApolloServer<BaseContext>;
  dataSource: DataSource;
  data: any;
} = {
  server: null,
  dataSource: null,
  data: {},
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

  testArgs.dataSource = dataSource;
  testArgs.server = testServer;
});

afterAll(async () => {
  await dataSource.destroy();
});

describe("users resolver", () => {
  it("should connect to database", async () => {
    expect(testArgs.dataSource.isInitialized).toBe(true);
  });

  it("should create an user", async () => {
    const response = await testArgs.server.executeOperation<{
      createUser: User;
    }>({
      query: mutationCreateUser,
      variables: {
        data: {
          email: "test2222@gmail.com",
          password: "SuperSecret!2025",
          firstname: "test",
          lastname: "test",
          confirmPassword: "SuperSecret!2025",
        },
      },
    });

    expect(response.body.kind === "single");
    if (response.body.kind === "single") {
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.createUser?.id).toBeDefined();

      const userFromDb = await User.findOneBy({
        id: response.body.singleResult.data?.createUser?.id,
      });
      expect(userFromDb).toBeDefined();
      expect(userFromDb.email).toBe("test2222@gmail.com");
      expect(userFromDb.password).not.toBe("SuperSecret!2025");
      testArgs.data.userId = response.body.singleResult.data?.createUser?.id;
      testArgs.data.userEmail = userFromDb.email;
    }
  });

  // test signin resolver
  /*
      testArgs.data.userEmail = userFromDb.email;
  */

  // test whoami resolver

  // test signout
});
