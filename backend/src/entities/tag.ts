import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Ad } from "./ad";
import { Pagination } from "./pagination";
import { User } from "./User";

@ObjectType()
@Entity()
export class Tag extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ length: 100 })
  name!: string;

  @Field()
  @Column({ length: 100 })
  normalizedName!: string;

  @Field(() => [Ad])
  @ManyToMany(() => Ad, (ad) => ad.tags)
  ads!: Ad[];

  @ManyToOne(() => User)
  @Field(() => User)
  createdBy!: User;
}

@ObjectType()
export class TagWithCount {
  @Field(() => Tag)
  tag!: Tag;

  @Field(() => [Ad])
  ads!: Ad[];

  @Field()
  pagination!: Pagination;
}

@InputType()
export class TagCreateInput {
  @Field()
  name!: string;
}

@InputType()
export class TagUpdateInput {
  @Field({ nullable: true })
  name!: string;
}
