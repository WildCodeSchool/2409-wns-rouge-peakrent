import { Field, ObjectType } from "type-graphql";
import { Product } from "./entities/Product";
import { StoreVariant } from "./entities/StoreVariant";

@ObjectType()
export class ProductWithVariants {
  @Field(() => Product, { nullable: true })
  product?: Product;

  @Field(() => [StoreVariant], { nullable: true })
  variants?: StoreVariant[];
}
