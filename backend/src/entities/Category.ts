import { IsNotEmpty, IsString, IsUrl, Length } from "class-validator";
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
import { Pagination } from "./Pagination";
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
  @Column({ name: "url_image" })
  @IsUrl()
  urlImage!: string;

  @Field()
  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @Field()
  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @Field(() => [Product], { nullable: true })
  @ManyToMany(() => Product, (product) => product.categories)
  products!: Product[];

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "parent_category_id" })
  @Field(() => Category, { nullable: true })
  parentCategory?: Category;

  @Field(() => [Category], { nullable: true })
  @OneToMany(() => Category, (category) => category.parentCategory)
  children!: Category[];

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

@InputType()
export class CategoryCreateInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: "Name is required." })
  @Length(1, 100, { message: "Name must be between 1 and 100 chars." })
  name!: string;

  @Field()
  @IsUrl({}, { message: "URL must be a valid URL." })
  urlImage!: string;
}

@InputType()
export class CategoryUpdateInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: "Name is required." })
  @Length(1, 100, { message: "Name must be between 1 and 100 chars." })
  name!: string;

  @Field()
  @IsUrl({}, { message: "URL must be a valid URL." })
  urlImage!: string;
}
