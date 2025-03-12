import { Length, IsOptional } from "class-validator";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ID, InputType, Int, ObjectType } from "type-graphql";
import { StoreVariant } from "./StoreVariant";

@ObjectType()
@Entity()
export class Store extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({ length: 255 })
    @Length(1, 255, { message: "Name must be between 1 and 255 chars." })
    name!: string;

    @Field()
    @Column({ length: 20 })
    @Length(1, 20, { message: "Phone number must be between 1 and 100 chars." })
    phone_number!: string;

    @Field()
    @Column({ length: 255 })
    @Length(1, 255, { message: "Address must be between 1 and 255 chars." })
    address_1!: string;

    @Field({nullable: true})
    @Column({ length: 255, nullable: true})
    @IsOptional()
    @Length(0, 255, { message: "Address must be between 0 and 255 chars." })
    address_2?: string;

    @Field()
    @Column({ length: 100 })
    @Length(1, 100, { message: "City must be between 1 and 100 chars." })
    city!: string;

    @Field()
    @Column({ length: 20 })
    @Length(1, 20, { message: "Zip code must be between 1 and 20 chars." })
    zip_code!: string;

    @Field()
    @Column({ length: 100 })
    @Length(1, 100, { message: "Country must be between 1 and 100 chars." })
    country!: string;

    @Field()
    @Column({ length: 100, unique: true })
    @Length(1, 100, { message: "Reference must be between 1 and 100 chars." })
    reference!: string;

    @Field()
    @CreateDateColumn({type: "timestamptz"})
    created_at!: Date;

    @Field()
    @UpdateDateColumn({type: "timestamptz"})
    updated_at!: Date;

    @OneToMany(() => StoreVariant, (storeVariant) => storeVariant.store)
    storeVariants!: StoreVariant[];

}


@InputType()
export class StoreCreateInput {
    @Field()
    @Length(1, 255, { message: "Name must be between 1 and 255 characters." })
    name!: string;

    @Field()
    @Length(1, 20, { message: "Phone number must be between 1 and 20 characters." })
    phone_number!: string;

    @Field()
    @Length(1, 255, { message: "Address must be between 1 and 255 characters." })
    address_1!: string;

    @Field({nullable: true})
    @IsOptional()
    @Length(0, 255, { message: "Address must be between 0 and 255 characters." })
    address_2?: string;

    @Field()
    @Length(1, 100, { message: "City must be between 1 and 100 characters." })
    city!: string;

    @Field()
    @Length(1, 20, { message: "Zip code must be between 1 and 20 characters." })
    zip_code!: string;

    @Field()
    @Length(1, 100, { message: "Country must be between 1 and 100 characters." })
    country!: string;

    @Field()
    @Length(1, 100, { message: "Reference must be between 1 and 100 characters." })
    reference!: string;
}

@InputType()
export class StoreUpdateInput {
    @Field(() => Int)
    id!: number;

    @Field()
    @IsOptional()
    @Length(1, 255, { message: "Name must be between 1 and 255 characters." })
    name?: string;

    @Field()
    @IsOptional()
    @Length(1, 20, { message: "Phone number must be between 1 and 20 characters." })
    phone_number?: string;

    @Field()
    @IsOptional()
    @Length(1, 255, { message: "Address must be between 1 and 255 characters." })
    address_1?: string;

    @Field({nullable: true})
    @IsOptional()
    @Length(0, 255, { message: "Address must be between 0 and 255 characters." })
    address_2?: string;

    @Field()
    @IsOptional()
    @Length(1, 100, { message: "City must be between 1 and 100 characters." })
    city?: string;

    @Field()
    @IsOptional()
    @Length(1, 20, { message: "Zip code must be between 1 and 20 characters." })
    zip_code?: string;

    @Field()
    @IsOptional()
    @Length(1, 100, { message: "Country must be between 1 and 100 characters." })
    country?: string;

    @Field()
    @IsOptional()
    @Length(1, 100, { message: "Reference must be between 1 and 100 characters." })
    reference?: string;
}