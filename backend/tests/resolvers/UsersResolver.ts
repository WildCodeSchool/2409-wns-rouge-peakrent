import { SIGNIN } from "../../../frontend/src/graphQL/signin";
import { CREATE_USER } from "../../../frontend/src/graphQL/user";
import { WHOAMI } from "../../../frontend/src/graphQL/whoami";
import { Profile } from "../../src/entities/Profile";
import { User } from "../../src/entities/User";
import { UserToken } from "../../src/entities/UserToken";
import { assert, TestArgsType } from "../index.spec";
import { getQueryFromMutation } from "../utils/getQueryFromMutation";
import { SignUpTests } from "./SignUpTests";

export const datas = {
  email: "test2222@gmail.com",
  password: "SuperSecret!2025",
  firstname: "test",
  lastname: "test",
  confirmPassword: "SuperSecret!2025",
};

export function UsersResolverTest(testArgs: TestArgsType) {
  // check if database is connected
  it("should connect to database", async () => {
    expect(testArgs.dataSource.isInitialized).toBe(true);
  });

  describe("SignUp", () => {
    describe("With Success", () => {
      // test createUser resolver
      it("should create an user", async () => {
        const response = await testArgs.server.executeOperation<{
          createUser: User;
        }>({
          query: getQueryFromMutation(CREATE_USER),
          variables: {
            data: datas,
          },
        });

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
        userFromDb.emailVerifiedAt = new Date();
        userFromDb.emailToken = null;
        userFromDb.emailSentAt = null;
        await userFromDb.save();
        testArgs.data.user = userFromDb;
      });

      it("should profile exists for new user", async () => {
        const user = testArgs?.data?.user;
        // check profile in database
        const profileFromDb = await Profile.findOneBy({
          id: user?.id,
        });
        expect(profileFromDb).toBeDefined();
        expect(profileFromDb.email).toBe(user?.email);
        expect(profileFromDb.firstname).toBe(user?.firstname);
        expect(profileFromDb.lastname).toBe(user?.lastname);
        expect(profileFromDb.role).toBe(user?.role);
      });
    });
    SignUpTests(testArgs);
  });

  describe("SignIn", () => {
    describe("With Success", () => {
      // test signin resolver
      it("should sign me in", async () => {
        const response = await testArgs.server.executeOperation<{
          signIn: User;
        }>({
          query: getQueryFromMutation(SIGNIN),
          variables: {
            datas: {
              email: testArgs.data.user?.email,
              password: datas.password,
            },
          },
        });

        assert(response.body.kind === "single");
        expect(response.body.singleResult.errors).toBeUndefined();
        expect(response.body.singleResult.data?.signIn?.id).toBeDefined();
        expect(+response.body.singleResult.data?.signIn?.id).toBe(
          +testArgs.data.user?.id
        );
      });

      // test for tokens in db
      it("tokens should exist in db", async () => {
        const user = testArgs?.data?.user;
        // check tokens in database
        const tokensFromDb = await UserToken.findOneBy({
          user: { id: user.id },
        });
        expect(tokensFromDb).toBeDefined();
        expect(tokensFromDb.token).toBeDefined();
        expect(tokensFromDb.refreshToken).toBeDefined();
      });
    });
    describe("With Fail", () => {
      it("should not sign me in with wrong password", async () => {
        const response = await testArgs.server.executeOperation<{
          signIn: User;
        }>({
          query: getQueryFromMutation(SIGNIN),
          variables: {
            datas: {
              email: testArgs.data.user?.email,
              password: "WrongPassword123!",
            },
          },
        });

        assert(response.body.kind === "single");
        expect(response.body.singleResult.errors).toBeDefined();
        expect(response.body.singleResult.errors[0].extensions.code).toBe(
          "INVALID_CREDENTIALS"
        );
        expect(response.body.singleResult.data?.signIn).toBeNull();
      });

      it("should not sign me in with unknown email", async () => {
        const response = await testArgs.server.executeOperation<{
          signIn: User;
        }>({
          query: getQueryFromMutation(SIGNIN),
          variables: {
            datas: {
              email: "emailnotfound@gmail.com",
              password: datas.password,
            },
          },
        });

        assert(response.body.kind === "single");
        expect(response.body.singleResult.errors).toBeDefined();
        expect(response.body.singleResult.errors[0].extensions.code).toBe(
          "INVALID_CREDENTIALS"
        );
        expect(response.body.singleResult.data?.signIn).toBeNull();
      });

      it("should not sign me in with unverified email", async () => {
        const unverifiedUserResponse = await testArgs.server.executeOperation<{
          createUser: User;
        }>({
          query: getQueryFromMutation(CREATE_USER),
          variables: {
            data: {
              email: "unverified@example.com",
              password: "SuperSecret!2025",
              confirmPassword: "SuperSecret!2025",
              firstname: "Unverified",
              lastname: "User",
            },
          },
        });

        assert(unverifiedUserResponse.body.kind === "single");

        const response = await testArgs.server.executeOperation<{
          signIn: User;
        }>({
          query: getQueryFromMutation(SIGNIN),
          variables: {
            datas: {
              email: "unverified@example.com",
              password: "SuperSecret!2025",
            },
          },
        });

        assert(response.body.kind === "single");
        expect(response.body.singleResult.errors).toBeDefined();
        expect(response.body.singleResult.errors[0].extensions.code).toBe(
          "EMAIL_ALREADY_SENT"
        );
        expect(response.body.singleResult.data?.signIn).toBeNull();
      });

      it("should return BAD_USER_INPUT with bad email input", async () => {
        const response = await testArgs.server.executeOperation<{
          signIn: User;
        }>({
          query: getQueryFromMutation(SIGNIN),
          variables: {
            datas: {
              email: "bad-email-com",
              password: datas.password,
            },
          },
        });

        assert(response.body.kind === "single");
        expect(response.body.singleResult.errors).toBeDefined();
        expect(response.body.singleResult.errors[0].extensions.code).toBe(
          "BAD_USER_INPUT"
        );
        expect(response.body.singleResult.data?.signIn).toBeNull();
      });

      it("should return BAD_USER_INPUT with bad password input", async () => {
        const response = await testArgs.server.executeOperation<{
          signIn: User;
        }>({
          query: getQueryFromMutation(SIGNIN),
          variables: {
            datas: {
              email: datas.email,
              password: "badpassword",
            },
          },
        });

        assert(response.body.kind === "single");
        expect(response.body.singleResult.errors).toBeDefined();
        expect(response.body.singleResult.errors[0].extensions.code).toBe(
          "BAD_USER_INPUT"
        );
        expect(response.body.singleResult.data?.signIn).toBeNull();
      });
    });
  });

  describe("WhoAmI", () => {
    // test whoami resolver (without token)
    it("should not find my profile", async () => {
      const response = await testArgs.server.executeOperation<{
        whoami: Profile;
      }>({
        query: getQueryFromMutation(WHOAMI),
      });

      assert(response.body.kind === "single");
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.whoami).toBeNull();
    });

    // test whoami resolver (with token)
    it("should find my profile", async () => {
      const response = await testArgs.server.executeOperation<{
        whoami: Profile;
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

      assert(response.body.kind === "single");
      expect(response.body.singleResult.errors).toBeUndefined();
      expect(response.body.singleResult.data?.whoami?.id).toBeDefined();
      expect(+response.body.singleResult.data?.whoami?.id).toBe(
        +testArgs.data.user?.id
      );
    });
  });
}
