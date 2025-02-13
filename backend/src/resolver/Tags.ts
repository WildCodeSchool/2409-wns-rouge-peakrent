import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";
import { Ad } from "../entities/ad";
import {
  Tag,
  TagCreateInput,
  TagUpdateInput,
  TagWithCount,
} from "../entities/tag";
import { normalizeString } from "../helpers/helpers";
import { AuthContextType } from "../types";
import { validate } from "class-validator";

@Resolver(Tag)
export class TagResolver {
  @Query(() => [Tag])
  async getTags(): Promise<Tag[]> {
    const tags = await Tag.find({
      relations: {
        ads: true,
      },
    });
    return tags;
  }

  @Query(() => TagWithCount, { nullable: true })
  async getTagById(
    @Arg("param", () => String) param: string,
    @Arg("page", () => Int, { defaultValue: 1 }) page: number,
    @Arg("onPage", () => Int, { defaultValue: 15 }) onPage: number
  ): Promise<TagWithCount | null> {
    const isId = !isNaN(Number(param));
    const whereCondition = isId ? { id: Number(param) } : { name: param };

    const itemsToSkip = (page - 1) * onPage;

    const tag = await Tag.findOne({
      where: whereCondition,
    });

    if (tag) {
      const [ads, total] = await Ad.findAndCount({
        where: { tags: { id: tag.id } },
        skip: itemsToSkip,
        take: onPage,
      });

      return {
        tag,
        ads,
        pagination: {
          total,
          currentPage: page,
          totalPages: Math.ceil(total / onPage),
        },
      };
    }
    return null;
  }

  @Authorized()
  @Mutation(() => Tag)
  async createTag(
    @Arg("data", () => TagCreateInput) data: TagCreateInput,
    @Ctx() context: AuthContextType
  ): Promise<Tag> {
    const newTag = new Tag();
    const user = context.user;

    Object.assign(newTag, data, { createdBy: user });
    newTag.normalizedName = normalizeString(newTag.name);

    const errors = await validate(newTag);
    if (errors.length > 0) {
      throw new Error(`Validation error: ${JSON.stringify(errors)}`);
    } else {
      await newTag.save();
      return newTag;
    }
  }

  @Authorized()
  @Mutation(() => Tag)
  async updateTag(
    @Arg("id", () => ID) _id: number,
    @Arg("data", () => TagUpdateInput) data: TagUpdateInput,
    @Ctx() context: AuthContextType
  ): Promise<Tag | null> {
    const id = Number(_id);
    const tag = await Tag.findOneBy({ id, createdBy: { id: context.user.id } });
    if (tag !== null) {
      Object.assign(tag, data);
      tag.normalizedName = normalizeString(tag.name);

      const errors = await validate(tag);
      if (errors.length > 0) {
        throw new Error(`Validation error: ${JSON.stringify(errors)}`);
      } else {
        await tag.save();
        return tag;
      }
    } else {
      return null;
    }
  }

  @Authorized()
  @Mutation(() => Tag)
  async deleteTag(
    @Arg("id", () => ID) _id: number,
    @Ctx() context: AuthContextType
  ): Promise<Tag | null> {
    const id = Number(_id);
    const tag = await Tag.findOneBy({ id, createdBy: { id: context.user.id } });

    if (tag !== null) {
      await tag.remove();
      return tag;
    } else {
      return null;
    }
  }
}
