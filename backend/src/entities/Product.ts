import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from "class-validator";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { IdInput } from "../commonInput/Id";
import { Pagination } from "../commonInput/Pagination";
import { Activity } from "./Activity";
import { Category } from "./Category";
import { User } from "./User";
import { Variant } from "./Variant";

@ObjectType()
@Entity()
export class Product extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ length: 100 })
  @Length(1, 100, { message: "Name must be between 1 and 100 chars." })
  name!: string;

  @Field()
  @Column({ length: 100, name: "normalized_name" })
  @Length(1, 100, { message: "Name must be between 1 and 100 chars." })
  normalizedName!: string;

  @Field({ nullable: true })
  @Column({ nullable: true, length: 500 })
  @IsOptional()
  @MaxLength(500, { message: "Description must be at most 500 characters." })
  description?: string;

  @Field()
  @Column({ name: "url_image" })
  @IsUrl({ require_tld: false }, { message: "urlImage must be a valid URL" })
  urlImage!: string;

  @Field()
  @Column({ default: false, name: "is_published" })
  isPublished!: boolean;

  @Field(() => String)
  @Column({ length: 100, unique: true })
  sku!: string;

  @Field()
  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @Field(() => [Category], { nullable: true })
  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({ name: "products_categories" })
  categories!: Category[];

  @Field(() => [Activity], { nullable: true })
  @ManyToMany(() => Activity, (activity) => activity.products)
  @JoinTable({ name: "products_activities" })
  activities!: Activity[];

  @Field(() => [Variant], { nullable: true })
  @OneToMany(() => Variant, (variant) => variant.product, { cascade: true })
  variants!: Variant[];

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  @Field(() => User)
  createdBy!: User;
}

@ObjectType()
export class ProductWithCount {
  @Field(() => [Product])
  products!: Product[];

  @Field()
  pagination!: Pagination;
}

@InputType()
export class ProductCreateInputAdmin {
  @Field()
  @IsString()
  @IsNotEmpty({ message: "Name is required." })
  @Length(1, 100, { message: "Name must be between 1 and 100 chars." })
  name!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: "Description must be at most 500 chars." })
  description?: string;

  @Field()
  @IsUrl({ require_tld: false }, { message: "urlImage must be a valid URL" })
  urlImage!: string;

  @Field()
  @IsBoolean({ message: "is_published must be a boolean value." })
  isPublished!: boolean;

  @Field()
  @IsString({ message: "SKU must be an string." })
  @Length(1, 100, { message: "SKU must be at most 100 chars." })
  sku!: string;

  @Field(() => [IdInput], { nullable: true })
  @IsOptional()
  categories?: IdInput[];

  @Field(() => [IdInput], { nullable: true })
  @IsOptional()
  activities?: IdInput[];
}

@InputType()
export class ProductUpdateInputAdmin {
  @Field()
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: "Name is required." })
  @Length(1, 100, { message: "Name must be between 1 and 100 chars." })
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: "Description must be at most 500 chars." })
  description?: string;

  @Field()
  @IsOptional()
  @IsUrl({ require_tld: false }, { message: "URL must be a valid URL." })
  urlImage?: string;

  @Field()
  @IsOptional()
  @IsBoolean({ message: "is_published must be a boolean value." })
  isPublished?: boolean;

  @Field()
  @IsOptional()
  @IsString({ message: "SKU must be an string." })
  @Length(1, 100, { message: "SKU must be at most 100 chars." })
  sku?: string;

  @Field(() => [IdInput], { nullable: true })
  @IsOptional()
  categories?: IdInput[];

  @Field(() => [IdInput], { nullable: true })
  @IsOptional()
  activities?: IdInput[];
}
