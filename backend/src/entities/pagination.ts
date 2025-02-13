import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class Pagination {
  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  currentPage!: number;

  @Field(() => Int)
  totalPages!: number;
}
