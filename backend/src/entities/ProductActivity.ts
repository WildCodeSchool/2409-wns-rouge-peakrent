import { Field, InputType, Int, ObjectType } from "type-graphql";
import { BaseEntity, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Activity } from "./Activity";
import { Product } from "./Product";

@ObjectType()
@Entity()
export class ProductActivity extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: "product_id" })
  productId!: number;

  @Field(() => Int)
  @PrimaryColumn({ name: "activity_id" })
  activityId!: number;

  @ManyToOne(() => Product, (product) => product.activities)
  product!: Product;

  @ManyToOne(() => Activity, (activity) => activity.products)
  activity!: Activity;
}

@InputType()
export class ProductActivityCreateInput {
  @Field(() => Int)
  productId!: number;

  @Field(() => Int)
  activityId!: number;
}

@InputType()
export class ProductActivityUpdateInput extends ProductActivityCreateInput {}
