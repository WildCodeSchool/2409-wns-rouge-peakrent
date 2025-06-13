// import { Field, InputType, Int, ObjectType } from "type-graphql";
// import { BaseEntity, Entity, ManyToOne, PrimaryColumn } from "typeorm";
// import { Activity } from "./Activity";
// import { Product } from "./Product";

// @ObjectType()
// @Entity()
// export class ProductActivity extends BaseEntity {
//   @Field(() => Int)
//   @PrimaryColumn({ name: "product_id" })
//   productId!: number;

//   @Field(() => Int)
//   @PrimaryColumn({ name: "activity_id" })
//   activityId!: number;

//   @ManyToOne(() => Product, (product) => product.activities, {
//     onDelete: "CASCADE",
//   })
//   product!: Product;

//   @ManyToOne(() => Activity, (activity) => activity.products, {
//     onDelete: "CASCADE",
//   })
//   activity!: Activity;
// }

// @InputType()
// export class ProductActivityCreateInputAdmin {
//   @Field(() => Int)
//   productId!: number;

//   @Field(() => Int)
//   activityId!: number;
// }

// @InputType()
// export class ProductActivityUpdateInputAdmin extends ProductActivityCreateInputAdmin {}
