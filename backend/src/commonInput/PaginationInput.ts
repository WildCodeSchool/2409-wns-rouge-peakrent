import { IsEnum, IsInt, Min } from "class-validator";
import { Field, InputType, Int } from "type-graphql";
import { SortOrder } from "../types";

@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 1 })
  @IsInt()
  @Min(1)
  page: number = 1;

  @Field(() => Int, { defaultValue: 15 })
  @IsInt()
  @Min(1)
  onPage: number = 15;

  @Field(() => String, { defaultValue: "ASC" })
  @IsEnum(SortOrder, {
    message: "Invalid sort order",
  })
  order: SortOrder = SortOrder.ASC;
}
