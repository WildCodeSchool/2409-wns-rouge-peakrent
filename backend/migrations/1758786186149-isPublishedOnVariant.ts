import { MigrationInterface, QueryRunner } from "typeorm";

export class IsPublishedOnVariant1758786186149 implements MigrationInterface {
    name = 'IsPublishedOnVariant1758786186149'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variant" ADD "is_published" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "variant" DROP COLUMN "is_published"`);
    }

}
