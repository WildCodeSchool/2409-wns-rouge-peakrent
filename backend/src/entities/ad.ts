import { IsEmail, IsUrl, Length, Min } from "class-validator";
import { Field, ID, InputType, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Category } from "./category";
import { IdInput } from "./id";
import { Pagination } from "./pagination";
import { Tag } from "./tag";
import { User } from "./User";

@ObjectType()
@Entity()
export class Ad extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ length: 100 })
  @Length(1, 100, { message: "Title must be between 1 and 100 chars." })
  title!: string;

  @Field()
  @Column({ length: 100 })
  @Length(1, 100, { message: "Title must be between 1 and 100 chars." })
  normalizedTitle!: string;

  @Field()
  @Column({ length: 100 })
  @Length(1, 100, { message: "Title must be between 1 and 100 chars." })
  author!: string;

  @Field()
  @Column({ length: 100 })
  @Length(1, 100, { message: "Title must be between 1 and 100 chars." })
  normalizedAuthor!: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description!: string;

  @Field()
  @Column()
  @IsEmail()
  owner!: string;

  @Field(() => Int)
  @Column()
  @Min(0, { message: "Price should be positive" })
  price!: number;

  @Field()
  @Column()
  @IsUrl()
  picture!: string;

  @Field()
  @Column()
  @Length(1, 30, { message: "Location must be between 1 and 30 chars." })
  location!: string;

  @Field()
  @Column()
  created_at!: Date;

  @BeforeInsert()
  private setCreateAt() {
    this.created_at = new Date();
  }

  @Field(() => Category)
  @ManyToOne(() => Category, (category) => category.ads)
  category!: Category;

  @Field(() => [Tag])
  @ManyToMany(() => Tag, (tag) => tag.ads)
  @JoinTable()
  tags!: Tag[];

  @ManyToOne(() => User)
  @Field(() => User)
  createdBy!: User;
}

@ObjectType()
export class AdWithCount {
  @Field(() => [Ad])
  ads!: Ad[];

  @Field()
  pagination!: Pagination;
}

@InputType()
export class AdCreateInput {
  @Field()
  @Length(1, 100, { message: "Title must be between 1 and 100 chars." })
  title!: string;

  @Field()
  @Length(1, 100, { message: "Title must be between 1 and 100 chars." })
  author!: string;

  @Field({ nullable: true })
  description!: string;

  @Field()
  @IsEmail()
  owner!: string;

  @Field(() => Int)
  @Min(0, { message: "Price should be positive" })
  price!: number;

  @Field()
  @IsUrl()
  picture!: string;

  @Field()
  @Length(1, 30, { message: "Location must be between 1 and 30 chars." })
  location!: string;

  @Field(() => IdInput)
  category!: IdInput;

  @Field(() => [IdInput])
  tags!: IdInput[];
}

@InputType()
export class AdUpdateInput {
  @Field({ nullable: true })
  @Length(1, 100, { message: "Title must be between 1 and 100 chars." })
  title!: string;

  @Field({ nullable: true })
  @Length(1, 100, { message: "Title must be between 1 and 100 chars." })
  author!: string;

  @Field({ nullable: true })
  description!: string;

  @Field({ nullable: true })
  @IsEmail()
  owner!: string;

  @Field(() => Int, { nullable: true })
  @Min(0, { message: "Price should be positive" })
  price!: number;

  @Field({ nullable: true })
  @IsUrl()
  picture!: string;

  @Field({ nullable: true })
  @Length(1, 30, { message: "Location must be between 1 and 30 chars." })
  location!: string;

  @Field(() => IdInput, { nullable: true })
  category!: IdInput;

  @Field(() => [IdInput], { nullable: true })
  tags!: IdInput[];
}
