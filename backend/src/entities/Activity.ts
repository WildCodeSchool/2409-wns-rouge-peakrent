import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
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
export class Activity extends BaseEntity {
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
  @IsUrl({ require_tld: false }, { message: "urlImage must be a valid URL" })
  urlImage!: string;

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
  @ManyToMany(() => Product, (product) => product.activities)
  products!: Product[];

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  @Field(() => User)
  createdBy!: User;
}

@ObjectType()
export class ActivityWithCount {
  @Field(() => Activity)
  activity!: Activity;

  @Field(() => [Product])
  products!: Product[];

  @Field()
  pagination!: Pagination;
}

@ObjectType()
export class ActivitiesWithCount {
  @Field(() => [Activity])
  activities!: Activity[];

  @Field(() => Pagination, { nullable: true })
  pagination: Pagination;
}

@InputType()
export class ActivityCreateInput {
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

  @Field()
  @IsUrl({ require_tld: false }, { message: "urlImage must be a valid URL" })
  urlImage!: string;
}

@InputType()
export class ActivityUpdateInput extends ActivityCreateInput {}

@InputType()
export class ActivityPaginationInput {
  @Field(() => Int, { defaultValue: 1 })
  @IsInt()
  @Min(1)
  page: number = 1;

  @Field(() => Int, { defaultValue: 15 })
  @IsInt()
  @Min(1)
  onPage: number = 15;

  @Field(() => String, { defaultValue: "createdAt" })
  @IsValidSortField(Activity)
  sort: string = "createdAt";

  @Field(() => String, { defaultValue: "ASC" })
  @IsEnum(SortOrder, {
    message: "Invalid sort order",
  })
  order: SortOrder = SortOrder.ASC;
}

@ObjectType()
export class DeleteActivitiesResponse {
  @Field(() => [ID])
  deletedIds: number[];
}
