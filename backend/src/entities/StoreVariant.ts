import { Min } from "class-validator";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import { BaseEntity, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Store } from "./Store";
import { Variant } from "./Variant";

@ObjectType()
@Entity()
export class StoreVariant extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn()
  variant_id!: number;

  @Field(() => Int)
  @PrimaryColumn()
  store_id!: number;

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
  store_id!: number;

  @Field(() => Int)
  variant_id!: number;

  @Field(() => Int, { defaultValue: 0 })
  @Min(0, { message: "Quantity must be at least 0" })
  quantity!: number;
}

@InputType()
export class StoreVariantUpdateInput {
  @Field(() => Int)
  store_id!: number;

  @Field(() => Int)
  variant_id!: number;

  @Field(() => Int, { nullable: true })
  @Min(0, { message: "Quantity must be at least 0" })
  quantity!: number;
}
