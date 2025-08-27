import { Arg, Authorized, ID, Mutation, Query, Resolver } from "type-graphql";
import {
  Voucher,
  VoucherCreateInput,
  VoucherUpdateInput,
} from "@/entities/Voucher";
import { RoleType } from "@/types";
import { validate } from "class-validator";
import { GraphQLError } from "graphql";

@Resolver(Voucher)
export class VoucherResolverAdmin {
  @Query(() => [Voucher])
  @Authorized([RoleType.admin, RoleType.superadmin])
  async listVouchers(): Promise<Voucher[]> {
    return Voucher.find({ order: { createdAt: "DESC" } });
  }

  @Query(() => Voucher, { nullable: true })
  @Authorized([RoleType.admin, RoleType.superadmin])
  async getVoucher(@Arg("id", () => ID) _id: number): Promise<Voucher | null> {
    return Voucher.findOne({ where: { id: Number(_id) } });
  }

  @Mutation(() => Voucher)
  @Authorized([RoleType.admin, RoleType.superadmin])
  async createVoucher(
    @Arg("data", () => VoucherCreateInput) data: VoucherCreateInput
  ): Promise<Voucher> {
    const voucher = new Voucher();
    Object.assign(voucher, data);
    const errors = await validate(voucher);
    if (errors.length) throw new GraphQLError(JSON.stringify(errors));
    return voucher.save();
  }

  @Mutation(() => Voucher)
  @Authorized([RoleType.admin, RoleType.superadmin])
  async updateVoucher(
    @Arg("id", () => ID) _id: number,
    @Arg("data", () => VoucherUpdateInput) data: VoucherUpdateInput
  ): Promise<Voucher> {
    const voucher = await Voucher.findOne({ where: { id: Number(_id) } });
    if (!voucher) {
      throw new GraphQLError("voucher not found", {
        extensions: { code: "NOT_FOUND", entity: "voucher" },
      });
    }
    Object.assign(voucher, data);
    const errors = await validate(voucher);
    if (errors.length) throw new GraphQLError(JSON.stringify(errors));
    return voucher.save();
  }
}
