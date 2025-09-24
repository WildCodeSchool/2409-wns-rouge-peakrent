import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrderStatusType1758724606031 implements MigrationInterface {
  name = "UpdateOrderStatusType1758724606031";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."order_status_enum" RENAME TO "order_status_enum_old"`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_status_enum" AS ENUM('pending', 'in_progress', 'confirmed', 'cancelled', 'refunded', 'completed', 'failed')`
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "status" DROP DEFAULT`
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "status" TYPE "public"."order_status_enum" USING "status"::"text"::"public"."order_status_enum"`
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'pending'`
    );
    await queryRunner.query(`DROP TYPE "public"."order_status_enum_old"`);
    await queryRunner.query(
      `ALTER TYPE "public"."order_item_status_enum" RENAME TO "order_item_status_enum_old"`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_item_status_enum" AS ENUM('pending', 'confirmed', 'cancelled', 'refunded', 'distributed', 'recovered')`
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ALTER COLUMN "status" DROP DEFAULT`
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ALTER COLUMN "status" TYPE "public"."order_item_status_enum" USING "status"::"text"::"public"."order_item_status_enum"`
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ALTER COLUMN "status" SET DEFAULT 'pending'`
    );
    await queryRunner.query(`DROP TYPE "public"."order_item_status_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."order_item_status_enum_old" AS ENUM('pending', 'cancelled', 'refunded', 'distributed', 'recovered')`
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ALTER COLUMN "status" DROP DEFAULT`
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ALTER COLUMN "status" TYPE "public"."order_item_status_enum_old" USING "status"::"text"::"public"."order_item_status_enum_old"`
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ALTER COLUMN "status" SET DEFAULT 'pending'`
    );
    await queryRunner.query(`DROP TYPE "public"."order_item_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."order_item_status_enum_old" RENAME TO "order_item_status_enum"`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_status_enum_old" AS ENUM('pending', 'confirmed', 'cancelled', 'refunded', 'completed', 'failed')`
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "status" DROP DEFAULT`
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "status" TYPE "public"."order_status_enum_old" USING "status"::"text"::"public"."order_status_enum_old"`
    );
    await queryRunner.query(
      `ALTER TABLE "order" ALTER COLUMN "status" SET DEFAULT 'pending'`
    );
    await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."order_status_enum_old" RENAME TO "order_status_enum"`
    );
  }
}
