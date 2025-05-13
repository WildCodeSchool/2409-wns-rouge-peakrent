import { registerDecorator, ValidationOptions } from "class-validator";
import { getMetadataStorage } from "type-graphql";

export function IsValidSortField(
  entity: new (...args: any[]) => any,
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: "isValidSortField",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== "string") return false;

          const entityFields = getMetadataStorage()
            .fields.filter((f) => f.target === entity)
            .map((f) => f.name);

          return entityFields.includes(value);
        },
        defaultMessage() {
          return `Field must be one of the following: ${getMetadataStorage()
            .fields.filter((f) => f.target === entity)
            .map((f) => f.name)
            .join(", ")}`;
        },
      },
    });
  };
}
