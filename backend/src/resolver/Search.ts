import { Arg, Query, Resolver } from "type-graphql";
import { Ad } from "../entities/ad";
import { Tag } from "../entities/tag";
import { dataSource } from "../config/db";
import { Like } from "typeorm";
import { Search } from "../entities/search";

@Resolver()
export class SearchResolver {
  @Query(() => Search)
  async getAdsAndTags(
    @Arg("searchTerm", () => String) _searchTerm: string
  ): Promise<Search> {
    const searchTerm = `%${_searchTerm}%`;
    let tags: Tag[];
    let ads: Ad[];

    tags = await dataSource.getRepository(Tag).find({
      select: ["id", "name"],
      where: { normalizedName: Like(searchTerm) },
      order: {
        name: "ASC",
      },
    });
    ads = await dataSource.getRepository(Ad).find({
      select: ["id", "title"],
      take: 50,
      skip: 0,
      where: [
        { normalizedTitle: Like(searchTerm) },
        { normalizedAuthor: Like(searchTerm) },
      ],
      order: {
        title: "ASC",
      },
    });

    if (tags.length || ads.length) {
      return { tags, ads };
    } else {
      return null;
    }
  }
}
