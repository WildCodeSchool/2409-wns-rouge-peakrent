import { Field, ObjectType } from "type-graphql";
import { Tag } from "./tag";
import { Ad } from "./ad";

@ObjectType()
export class Search {
  @Field(() => [Tag])
  tags!: Tag[];

  @Field(() => [Ad])
  ads!: Ad[];
}
