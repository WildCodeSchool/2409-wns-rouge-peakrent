import { Min } from "class-validator";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import { BaseEntity, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Store } from "./Store";
import { Variant } from "./Variant";

@ObjectType()
@Entity()
export class StoreVariant extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn({ name: "variant_id" })
  variantId!: number;

  @Field(() => Int)
  @PrimaryColumn({ name: "store_id" })
  storeId!: number;

  @Field(() => Int)
  @Min(0, { message: "Quantity must be at least 0" })
  quantity!: number;

  @ManyToOne(() => Store, (store) => store.storeVariants, {
    onDelete: "CASCADE",
  })
  store!: Store;

  @ManyToOne(() => Variant, (variant) => variant.storeVariants, {
    onDelete: "CASCADE",
  })
  variant!: Variant;
}

@InputType()
export class StoreVariantCreateInput {
  @Field(() => Int)
  storeId!: number;

  @Field(() => Int)
  variantId!: number;

  @Field(() => Int, { defaultValue: 0 })
  @Min(0, { message: "Quantity must be at least 0" })
  quantity!: number;
}

@InputType()
export class StoreVariantUpdateInput {
  @Field(() => Int)
  storeId!: number;

  @Field(() => Int)
  variantId!: number;

  @Field(() => Int, { nullable: true })
  @Min(0, { message: "Quantity must be at least 0" })
  quantity!: number;
}
