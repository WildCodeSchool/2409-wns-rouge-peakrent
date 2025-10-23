import { IsInt, IsOptional, IsString, Length, Min } from "class-validator";
import { Field, ID, InputType, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Pagination } from "../commonInput/Pagination";
import { Product } from "./Product";
import { StoreVariant } from "./StoreVariant";
import { User } from "./User";

@ObjectType()
@Entity()
export class Variant extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field({ nullable: true })
  @Column({ length: 50, nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: "Size must be between 1 and 50 characters." })
  size?: string;

  @Field({ nullable: true })
  @Column({ length: 50, nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: "Color must be between 1 and 50 characters." })
  color?: string;

  @Field(() => Int)
  @Column({ name: "price_per_day" })
  @IsInt()
  @Min(0, { message: "Price per day must be a positive number." })
  pricePerDay!: number;

  @Field()
  @Column({ name: "is_published", default: true })
  isPublished!: boolean;

  @Field()
  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "product_id" })
  product!: Product;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  createdBy?: User;

  @OneToMany(() => StoreVariant, (storeVariant) => storeVariant.variant)
  storeVariants!: StoreVariant[];
}

@ObjectType()
export class VariantWithCount {
  @Field(() => [Variant])
  variants!: Variant[];

  @Field()
  pagination!: Pagination;
}

@InputType()
export class VariantCreateInputAdmin {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: "Size must be between 1 and 50 characters." })
  size?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: "Color must be between 1 and 50 characters." })
  color?: string;

  @Field(() => Int)
  @IsInt()
  @Min(0, { message: "Price per day must be a positive number." })
  pricePerDay!: number;

  @Field(() => Int)
  productId!: number;
}

@InputType()
export class VariantUpdateInputAdmin {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: "Size must be between 1 and 50 characters." })
  size?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: "Color must be between 1 and 50 characters." })
  color?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0, { message: "Price per day must be a positive number." })
  pricePerDay?: number;

  @Field(() => Int)
  productId!: number;
}

@InputType()
export class VariantCreateNestedInputAdmin {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: "Size must be between 1 and 50 characters." })
  size?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: "Color must be between 1 and 50 characters." })
  color?: string;

  @Field(() => Int)
  @IsInt()
  @Min(0, { message: "Price per day must be a positive number." })
  pricePerDay!: number;
}
