import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from "class-validator";
import { Field, ID, InputType, ObjectType } from "type-graphql";
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
import { Pagination } from "../commonInput/Pagination";
import { PaginationInput } from "../commonInput/PaginationInput";
import { IsValidSortField } from "../decorators/IsValidSortField";
import { Product } from "./Product";
import { User } from "./User";

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
export class CategoryCreateInputAdmin {
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

  @Field(() => [CategoryCreateInputAdmin], { nullable: true })
  childrens?: CategoryCreateInputAdmin[];
}

@InputType()
export class CategoryUpdateInputAdmin extends CategoryCreateInputAdmin {}

@InputType()
export class CategoryPaginationInput extends PaginationInput {
  @Field(() => String, { defaultValue: "createdAt" })
  @IsValidSortField(Category)
  sort: string = "createdAt";

  @Field(() => Boolean, { defaultValue: false })
  @IsBoolean()
  @IsOptional()
  onlyParent?: boolean;
}
