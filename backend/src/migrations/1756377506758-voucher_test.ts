import { MigrationInterface, QueryRunner } from "typeorm";

export class VoucherTest1756377506758 implements MigrationInterface {
    name = 'VoucherTest1756377506758'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_4792d05144f3adf28c187c3aa97"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_e9674a6053adbaa1057848cddfa"`);
        await queryRunner.query(`CREATE TYPE "public"."voucher_type_enum" AS ENUM('percentage', 'fixed')`);
        await queryRunner.query(`CREATE TABLE "voucher" ("id" SERIAL NOT NULL, "code" character varying(64) NOT NULL, "type" "public"."voucher_type_enum" NOT NULL, "amount" integer NOT NULL, "startsAt" TIMESTAMP WITH TIME ZONE, "endsAt" TIMESTAMP WITH TIME ZONE, "isActive" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_73e3d2a7719851716e940836980" UNIQUE ("code"), CONSTRAINT "PK_677ae75f380e81c2f103a57ffaf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_73e3d2a7719851716e94083698" ON "voucher" ("code") `);
        await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "profileId"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "discount_amount" integer`);
        await queryRunner.query(`ALTER TABLE "order" ADD "charged_amount" integer`);
        await queryRunner.query(`ALTER TABLE "order" ADD "voucher_id" integer`);
        await queryRunner.query(`ALTER TABLE "cart" ADD "voucher_id" integer`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_d6ed6a38cc40cae0c9537c5f0c3" FOREIGN KEY ("voucher_id") REFERENCES "voucher"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_6e1580fb2822dead20a5a58b0c4" FOREIGN KEY ("voucher_id") REFERENCES "voucher"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_e9674a6053adbaa1057848cddfa" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_e9674a6053adbaa1057848cddfa"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_6e1580fb2822dead20a5a58b0c4"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_d6ed6a38cc40cae0c9537c5f0c3"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "voucher_id"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "voucher_id"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "charged_amount"`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "discount_amount"`);
        await queryRunner.query(`ALTER TABLE "payment" ADD "profileId" integer`);
        await queryRunner.query(`DROP INDEX "public"."IDX_73e3d2a7719851716e94083698"`);
        await queryRunner.query(`DROP TABLE "voucher"`);
        await queryRunner.query(`DROP TYPE "public"."voucher_type_enum"`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_e9674a6053adbaa1057848cddfa" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_4792d05144f3adf28c187c3aa97" FOREIGN KEY ("profileId") REFERENCES "profile"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
