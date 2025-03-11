import {Field, ObjectType} from "type-graphql";
import {Product} from "./Product";
import {Category} from "./Category";

@ObjectType()
export class Search {
    @Field(() => [Category])
    categories!: Category[];

    @Field(() => [Product])
    products!: Product[];
}
