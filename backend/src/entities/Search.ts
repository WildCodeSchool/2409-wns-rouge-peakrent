import { Field, ObjectType } from "type-graphql";
import { Category } from "./Category";
import { Product } from "./Product";

@ObjectType()
export class Search {
  @Field(() => [Category])
  categories!: Category[];

  @Field(() => [Product])
  products!: Product[];
}
