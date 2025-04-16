import { Arg, Query, Resolver } from "type-graphql";
import { Like } from "typeorm";
import { dataSource } from "../config/db";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";
import { Search } from "../entities/Search";

@Resolver()
export class SearchResolver {
  @Query(() => Search)
  async getProductsAndCategories(
    @Arg("searchTerm", () => String) _searchTerm: string
  ): Promise<Search> {
    const searchTerm = `%${_searchTerm}%`;

    const categories: Category[] = await dataSource
      .getRepository(Category)
      .find({
        select: ["id", "name"],
        where: { normalizedName: Like(searchTerm) },
        order: {
          name: "ASC",
        },
      });
    const products: Product[] = await dataSource.getRepository(Product).find({
      select: ["id", "name"],
      take: 50,
      skip: 0,
      where: [{ normalizedName: Like(searchTerm) }],
      order: {
        name: "ASC",
      },
    });

    if (categories.length || products.length) {
      return { categories, products };
    } else {
      return null;
    }
  }
}
