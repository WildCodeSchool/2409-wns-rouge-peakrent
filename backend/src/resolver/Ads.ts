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
import { Ad, AdCreateInput, AdUpdateInput, AdWithCount } from "../entities/ad";
import { normalizeString } from "../helpers/helpers";
import { validate, ValidationError } from "class-validator";
import { Tag } from "../entities/tag";
import { In } from "typeorm";
import { AuthContextType } from "../types";

@Resolver(Ad)
export class AdResolver {
  @Query(() => AdWithCount)
  async getAds(
    @Arg("page", () => Int, { defaultValue: 1 }) page: number,
    @Arg("onPage", () => Int, { defaultValue: 15 }) onPage: number
  ): Promise<AdWithCount> {
    const itemsToSkip = (page - 1) * onPage;

    const [ads, total] = await Ad.findAndCount({
      skip: itemsToSkip,
      take: onPage,
      relations: {
        category: true,
        tags: true,
        createdBy: true,
      },
    });

    return {
      ads,
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / onPage),
      },
    };
  }

  @Query(() => Ad, { nullable: true })
  async getAdById(
    @Arg("param", () => String) param: string
  ): Promise<Ad | null> {
    let ad: Ad | null = null;

    if (!isNaN(Number(param))) {
      const id = Number(param);
      ad = await Ad.findOne({
        where: { id },
        relations: { category: true, tags: true, createdBy: true },
      });
    } else {
      ad = await Ad.findOne({
        where: { title: param },
        relations: { category: true, tags: true, createdBy: true },
      });
    }

    return ad;
  }

  @Authorized()
  @Mutation(() => Ad)
  async createAd(
    @Arg("data", () => AdCreateInput) data: AdCreateInput,
    @Ctx() context: AuthContextType
  ): Promise<Ad | null | ValidationError[]> {
    const newAd = new Ad();
    const user = context.user;

    Object.assign(newAd, data, { createdBy: user });
    newAd.normalizedTitle = normalizeString(newAd.title);
    newAd.normalizedAuthor = normalizeString(newAd.author);

    const validationErrors = await validate(newAd);
    if (validationErrors.length > 0) {
      // travailler le renvoie d'erreur - fonction générique a réutiliser a chaque renvoie
      // class-validator
      throw new Error(`Errors : ${JSON.stringify(validationErrors)}`);
    } else {
      await newAd.save();
      return newAd;
    }
  }

  @Authorized()
  @Mutation(() => Ad)
  async updateAd(
    @Arg("id", () => String) _id: string,
    @Arg("data", () => AdUpdateInput) data: AdCreateInput,
    @Ctx() context: AuthContextType
  ) {
    const id = Number(_id);

    const ad = await Ad.findOne({
      where: { id, createdBy: { id: context.user.id } },
      relations: { tags: true, category: true },
    });

    if (!ad) {
      return null;
    }

    Object.assign(ad, data);

    if (ad.title) {
      ad.normalizedTitle = normalizeString(ad.title);
    }

    if (data.tags) {
      const tagIds = data.tags
        .map((tag) => ("id" in tag ? tag.id : null))
        .filter((id) => id !== null);

      const fullTags = await Tag.findBy({ id: In(tagIds) });

      ad.tags = fullTags;
    }

    const validationErrors = await validate(ad);
    if (validationErrors.length) {
      return validationErrors;
    }

    await ad.save();
    return ad;
  }

  @Authorized()
  @Mutation(() => Ad, { nullable: true })
  async deleteAd(
    @Arg("id", () => ID) _id: number,
    @Ctx() context: AuthContextType
  ) {
    const id = Number(_id);
    const ad = await Ad.findOneBy({ id, createdBy: { id: context.user.id } });
    if (ad !== null) {
      await ad.remove();
      return ad;
    } else {
      return null;
    }
  }
}
