import { Field, ObjectType } from "type-graphql";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";

@ObjectType()
export class Search {
  @Field(() => [Category])
  categories!: Category[];

  @Field(() => [Product])
  products!: Product[];
}
