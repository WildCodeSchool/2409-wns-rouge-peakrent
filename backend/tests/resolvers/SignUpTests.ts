import { CREATE_USER } from "../../../frontend/src/GraphQL/createUser";
import { User } from "../../src/entities/User";
import { assert, TestArgsType } from "../index.spec";
import { findErrorWithCode } from "../utils/findErrorWithCode";
import { getQueryFromMutation } from "../utils/getQueryFromMutation";

import { datas } from "./UsersResolver";

export function SignUpTests(testArgs: TestArgsType) {
  // Helper function to run validation tests
  const runValidationTest = async (
    variables: Record<string, any>,
    expectedCode: string
  ) => {
    const response = await testArgs.server.executeOperation<{
      createUser: User;
    }>({
      query: getQueryFromMutation(CREATE_USER),
      variables,
    });

    assert(response.body.kind === "single");
    expect(response.body.singleResult.errors).toBeDefined();

    const errorWithCode = findErrorWithCode(
      response.body.singleResult.errors,
      expectedCode
    );

    expect(errorWithCode?.extensions.code).toBe(expectedCode);
    expect(response.body.singleResult.data?.createUser?.id).toBeUndefined();
  };

  const fieldMissingToTest = [
    "email",
    "password",
    "firstname",
    "lastname",
    "confirmPassword",
  ];

  return describe("With Fail", () => {
    fieldMissingToTest.forEach((field) => {
      // Test for missing field
      it(`should return BAD_USER_INPUT for missing ${field}`, async () => {
        const variables = {
          data: {
            email: field === "email" ? undefined : datas.email,
            password: field === "password" ? undefined : datas.password,
            firstname: field === "firstname" ? undefined : datas.firstname,
            lastname: field === "lastname" ? undefined : datas.lastname,
            confirmPassword:
              field === "confirmPassword" ? undefined : datas.confirmPassword,
          },
        };

        await runValidationTest(variables, "BAD_USER_INPUT");
      });
    });

    // Test for invalid email format
    it("should return BAD_USER_INPUT for invalid email format", async () => {
      const variables = {
        data: {
          ...datas,
          email: "invalid-email",
        },
      };

      await runValidationTest(variables, "BAD_USER_INPUT");
    });

    // Test for password too short
    it("should return BAD_USER_INPUT for password that is too short", async () => {
      const variables = {
        data: {
          ...datas,
          password: "short",
          confirmPassword: "short",
        },
      };

      await runValidationTest(variables, "BAD_USER_INPUT");
    });

    // Test for mismatching password and confirmPassword
    it("should return PASSWORDS_DONT_MATCH for mismatching password and confirmPassword", async () => {
      const variables = {
        data: {
          ...datas,
          confirmPassword: "MismatchedPassword",
        },
      };

      await runValidationTest(variables, "PASSWORDS_DONT_MATCH");
    });

    // Test for invalid firstname (integer)
    it("should return BAD_USER_INPUT for invalid firstname (integer)", async () => {
      const variables = {
        data: {
          ...datas,
          firstname: 222,
        },
      };

      await runValidationTest(variables, "BAD_USER_INPUT");
    });

    // Test for invalid lastname (integer)
    it("should return BAD_USER_INPUT for invalid lastname (integer)", async () => {
      const variables = {
        data: {
          ...datas,
          lastname: 222,
        },
      };

      await runValidationTest(variables, "BAD_USER_INPUT");
    });

    // Test for existing email
    it("should return EMAIL_ALREADY_EXIST error code", async () => {
      const variables = {
        data: {
          ...datas,
        },
      };

      await runValidationTest(variables, "EMAIL_ALREADY_EXIST");
    });
  });
}
