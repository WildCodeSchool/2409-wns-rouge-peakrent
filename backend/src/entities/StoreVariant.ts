import { Min } from "class-validator";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from "typeorm";
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
  @Column()
  @Min(0, { message: "Quantity must be positive" })
  quantity!: number;

  @Field(() => Store)
  @ManyToOne(() => Store, (store) => store.storeVariants, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "store_id" })
  store!: Store;

  @Field(() => Variant)
  @ManyToOne(() => Variant, (variant) => variant.storeVariants, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "variant_id" })
  variant!: Variant;
}

@InputType()
export class StoreVariantCreateInputAdmin {
  @Field(() => Int)
  storeId!: number;

  @Field(() => Int)
  variantId!: number;

  @Field(() => Int, { defaultValue: 0 })
  @Min(0, { message: "Quantity must be positive" })
  quantity!: number;
}

@InputType()
export class StoreVariantUpdateInputAdmin {
  @Field(() => Int)
  storeId!: number;

  @Field(() => Int)
  variantId!: number;

  @Field(() => Int, { nullable: true })
  @Min(0, { message: "Quantity must be positive" })
  quantity!: number;
}
