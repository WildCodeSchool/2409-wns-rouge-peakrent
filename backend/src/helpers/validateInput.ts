import { validate, ValidationError } from "class-validator";
import { UserInputError } from "apollo-server-errors";

/**
 * Utility function to validate an object using `class-validator`.
 * It checks the validation constraints defined on the object's properties
 * and throws a `UserInputError` if any validation errors are found.
 *
 * @param input The object to validate, of generic type `T`. This type must extend `object`.
 * @throws {UserInputError} If validation errors are detected, an exception is thrown with the details of the errors.
 * 
 * @example
 * // Example usage in a mutation
 * await validateInput(datas);
 * 
 * @template T The type of the object to validate. For example, `SignInInput` or `UserCreateInput`.
 */
export const validateInput = async <T extends object>(input: T): Promise<void> => {
  // Perform the validation of the object
  const inputErrors: ValidationError[] = await validate(input);

  // If there are validation errors
  if (inputErrors.length > 0) {
    // Throw an error with the validation details
    throw new UserInputError("Validation error", {
      validationErrors: inputErrors.map((error) => ({
        property: error.property, // Name of the property that failed
        constraints: error.constraints, // Details of the constraints that were not met
      })),
    });
  }
};
