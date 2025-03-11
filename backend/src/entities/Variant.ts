import {IsInt, IsOptional, IsString, Length, Min} from "class-validator";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import {Field, ID, InputType, Int, ObjectType} from "type-graphql";
import {Product} from "./Product";
import {User} from "./user";
import {Pagination} from "./Pagination";

@ObjectType()
@Entity()
export class Variant extends BaseEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id!: number;

    @Field({nullable: true})
    @Column({length: 50, nullable: true})
    @IsOptional()
    @IsString()
    @Length(1, 50, {message: "Size must be between 1 and 50 characters."})
    size?: string;

    @Field({nullable: true})
    @Column({length: 50, nullable: true})
    @IsOptional()
    @IsString()
    @Length(1, 50, {message: "Color must be between 1 and 50 characters."})
    color?: string;

    @Field(() => Int)
    @Column()
    @IsInt()
    @Min(0, {message: "Price per hour must be a positive number."})
    price_per_hour!: number;

    @Field()
    @CreateDateColumn({name: "created_at"})
    created_at!: Date;

    @Field()
    @UpdateDateColumn({name: "updated_at"})
    updated_at!: Date;

    @Field(() => Product)
    @ManyToOne(() => Product, (product) => product.variants, {onDelete: "CASCADE"})
    @JoinColumn({name: "product_id"})
    product!: Product;

    @Field(() => User)
    @ManyToOne(() => User)
    @JoinColumn({name: "created_by"})
    created_by!: User;
}

@ObjectType()
export class VariantWithCount {
    @Field(() => [Variant])
    variants!: Variant[];

    @Field()
    pagination!: Pagination;
}

@InputType()
export class VariantCreateInput {
    @Field({nullable: true})
    @IsOptional()
    @IsString()
    @Length(1, 50, {message: "Size must be between 1 and 50 characters."})
    size?: string;

    @Field({nullable: true})
    @IsOptional()
    @IsString()
    @Length(1, 50, {message: "Color must be between 1 and 50 characters."})
    color?: string;

    @Field(() => Int)
    @IsInt()
    @Min(0, {message: "Price per hour must be a positive number."})
    price_per_hour!: number;

    @Field(() => Int)
    productId!: number;
}

@InputType()
export class VariantUpdateInput {
    @Field({nullable: true})
    @IsOptional()
    @IsString()
    @Length(1, 50, {message: "Size must be between 1 and 50 characters."})
    size?: string;

    @Field({nullable: true})
    @IsOptional()
    @IsString()
    @Length(1, 50, {message: "Color must be between 1 and 50 characters."})
    color?: string;

    @Field(() => Int, {nullable: true})
    @IsOptional()
    @IsInt()
    @Min(0, {message: "Price per hour must be a positive number."})
    price_per_hour?: number;
}

