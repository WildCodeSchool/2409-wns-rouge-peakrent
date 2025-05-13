import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Min,
} from "class-validator";
import { Field, ID, InputType, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { IsValidSortField } from "../decorators/IsValidSortField";
import { Pagination } from "./Pagination";
import { Product } from "./Product";
import { User } from "./User";
import { SortOrder } from "../types";

@ObjectType()
@Entity()
export class Category extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  @Length(2, 100, { message: "Name must be between 2 and 100 chars" })
  name!: string;

  @Field()
  @Column({ name: "normalized_name" })
  normalizedName!: string;

  @Field()
  @Column({ name: "variant" })
  @Length(2, 50, { message: "Variant must be between 2 and 50 chars" })
  variant!: string;

  @Field()
  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @Field(() => [Product], { nullable: true })
  @ManyToMany(() => Product, (product) => product.categories)
  products!: Product[];

  @ManyToOne(() => Category, (category) => category.childrens, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "parent_category_id" })
  @Field(() => Category, { nullable: true })
  parentCategory?: Category;

  @Field(() => [Category], { nullable: true })
  @OneToMany(() => Category, (category) => category.parentCategory)
  childrens!: Category[];

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  @Field(() => User)
  createdBy!: User;
}

@ObjectType()
export class CategoryWithCount {
  @Field(() => Category)
  category!: Category;

  @Field(() => [Product])
  products!: Product[];

  @Field()
  pagination!: Pagination;
}

@ObjectType()
export class CategoriesWithCount {
  @Field(() => [Category])
  categories!: Category[];

  @Field(() => Pagination, { nullable: true })
  pagination: Pagination;
}

@InputType()
export class CategoryCreateInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: "Name is required." })
  @Length(2, 50, { message: "Name must be between 2 and 50 chars." })
  name!: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: "Variant is required." })
  @Length(2, 50, { message: "Variant must be between 2 and 50 chars." })
  variant!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  id?: number;

  @Field(() => [CategoryCreateInput], { nullable: true })
  childrens?: CategoryCreateInput[];
}

@InputType()
export class CategoryUpdateInput extends CategoryCreateInput {}

@InputType()
export class CategoryPaginationInput {
  @Field(() => Int, { defaultValue: 1 })
  @IsInt()
  @Min(1)
  page: number = 1;

  @Field(() => Int, { defaultValue: 15 })
  @IsInt()
  @Min(1)
  onPage: number = 15;

  @Field(() => String, { defaultValue: "createdAt" })
  @IsValidSortField(Category)
  sort: string = "createdAt";

  @Field(() => String, { defaultValue: "ASC" })
  @IsEnum(SortOrder, {
    message: "Invalid sort order",
  })
  order: SortOrder = SortOrder.ASC;

  @Field(() => Boolean, { defaultValue: false })
  @IsBoolean()
  @IsOptional()
  onlyParent?: boolean;
}

@ObjectType()
export class DeleteCategoriesResponse {
  @Field(() => [ID])
  deletedIds: number[];
}
