import { Length } from "class-validator";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Ad } from "./ad";
import { Pagination } from "./pagination";
import { User } from "./User";

// like { createdAt user }
// @ObjectType()
// class CategoryLike {
//   @Field()
//   createdAt: Date;

//   @Field()
//   user: string;
// }

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
  @Column()
  normalizedName!: string;

  @Field(() => [Ad])
  @OneToMany(() => Ad, (ad) => ad.category)
  ads!: Ad[];

  // @Field(() => [CategoryLike])
  // likes() {
  //   console.log("Computed");
  //   return [
  //     {
  //       createdAt: new Date(),
  //       user: "Aurélien",
  //     },
  //   ];
  // }

  @CreateDateColumn()
  @Field()
  createdAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  createdBy!: User;
}

@ObjectType()
export class CategoryWithCount {
  @Field(() => Category)
  category!: Category;

  @Field(() => [Ad])
  ads!: Ad[];

  @Field()
  pagination!: Pagination;
}

@InputType()
export class CategoryCreateInput {
  @Field()
  name!: string;
}

@InputType()
export class CategoryUpdateInput {
  @Field({ nullable: true })
  name!: string;
}
