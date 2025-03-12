import { CREATE_USER } from "../../../frontend/src/GraphQL/createUser";
import { SIGNIN } from "../../../frontend/src/GraphQL/signin";
import { WHOAMI } from "../../../frontend/src/GraphQL/whoami";
import { User } from "../../src/entities/User";
import { assert, TestArgsType } from "../index.spec";
import { getQueryFromMutation } from "../utils/getQueryFromMutation";

export function UsersResolverTest(testArgs: TestArgsType) {
  const datas = {
    email: "test2222@gmail.com",
    password: "SuperSecret!2025",
    firstname: "test",
    lastname: "test",
    confirmPassword: "SuperSecret!2025",
  };

  it("should connect to database", async () => {
    expect(testArgs.dataSource.isInitialized).toBe(true);
  });

  it("should create an user", async () => {
    const response = await testArgs.server.executeOperation<{
      createUser: User;
    }>({
      query: getQueryFromMutation(CREATE_USER),
      variables: {
        data: {
          email: datas.email,
          password: datas.password,
          firstname: datas.firstname,
          lastname: datas.lastname,
          confirmPassword: datas.confirmPassword,
        },
      },
    });

    // check API response
    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.createUser?.id).toBeDefined();

    // check user in database
    const userFromDb = await User.findOneBy({
      id: response.body.singleResult.data?.createUser?.id,
    });
    expect(userFromDb).toBeDefined();
    expect(userFromDb.email).toBe(datas.email);
    expect(userFromDb.password).not.toBe(datas.password);
    expect(userFromDb.firstname).toBe(datas.firstname);
    expect(userFromDb.lastname).toBe(datas.lastname);
    expect(userFromDb.role).toBe("user");
    testArgs.data.user = userFromDb;
  });

  // test whoami resolver (without token)
  it("should not find my profile", async () => {
    const response = await testArgs.server.executeOperation<{
      whoami: User;
    }>({
      query: getQueryFromMutation(WHOAMI),
    });

    // check API response
    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.whoami).toBeNull();
  });

  // test signin resolver
  it("should sign me in", async () => {
    const response = await testArgs.server.executeOperation<{
      signIn: User;
    }>({
      query: getQueryFromMutation(SIGNIN),
      variables: {
        email: testArgs.data.user?.email,
        password: datas.password,
      },
    });

    // check API response
    assert(response.body.kind === "single");
    console.log(response.body.singleResult.data?.signIn);
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.signIn?.id).toBeDefined();
    expect(+response.body.singleResult.data?.signIn?.id).toBe(
      +testArgs.data.user?.id
    );
  });

  // test whoami resolver
  it("should find my profile", async () => {
    const response = await testArgs.server.executeOperation<{
      whoami: User;
    }>(
      {
        query: getQueryFromMutation(WHOAMI),
      },
      {
        contextValue: {
          user: testArgs.data.user,
        },
      }
    );

    // check API response
    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeUndefined();
    expect(response.body.singleResult.data?.whoami?.id).toBeDefined();
    expect(+response.body.singleResult.data?.whoami?.id).toBe(
      +testArgs.data.user?.id
    );
  });
}
