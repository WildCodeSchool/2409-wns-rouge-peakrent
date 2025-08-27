import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1756302562953 implements MigrationInterface {
    name = 'InitialSchema1756302562953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'admin', 'superadmin')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying(320) NOT NULL, "email_verified_at" TIMESTAMP WITH TIME ZONE, "firstname" character varying(100) NOT NULL, "lastname" character varying(100) NOT NULL, "password" character varying(255) NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'user', "email_sent_at" TIMESTAMP WITH TIME ZONE, "recover_token" character varying(255), "recover_sent_at" TIMESTAMP WITH TIME ZONE, "email_token" character varying(255), "new_email" character varying(320), "new_email_token" character varying(255), "new_email_sent_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activity" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "normalized_name" character varying NOT NULL, "url_image" character varying NOT NULL, "variant" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, CONSTRAINT "PK_24625a1d6b1b089c8ae206fe467" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "normalized_name" character varying NOT NULL, "variant" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "parent_category_id" integer, "created_by" integer, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "normalized_name" character varying(100) NOT NULL, "description" character varying(500), "url_image" character varying NOT NULL, "is_published" boolean NOT NULL DEFAULT false, "sku" character varying(100) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" integer, CONSTRAINT "UQ_34f6ca1cd897cc926bdcca1ca39" UNIQUE ("sku"), CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "store" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "phone_number" character varying(20) NOT NULL, "address_1" character varying(255) NOT NULL, "address_2" character varying(255), "city" character varying(100) NOT NULL, "zip_code" character varying(20) NOT NULL, "country" character varying(100) NOT NULL, "reference" character varying(100) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_20e36013936b40591367c74f7ee" UNIQUE ("reference"), CONSTRAINT "PK_f3172007d4de5ae8e7692759d79" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "store_variant" ("variant_id" integer NOT NULL, "store_id" integer NOT NULL, "quantity" integer NOT NULL, CONSTRAINT "PK_af2d1c4a397d59c11e2cdcad2a8" PRIMARY KEY ("variant_id", "store_id"))`);
        await queryRunner.query(`CREATE TABLE "variant" ("id" SERIAL NOT NULL, "size" character varying(50), "color" character varying(50), "price_per_day" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "product_id" integer, "created_by" integer, CONSTRAINT "PK_f8043a8a34fa021a727a4718470" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stripe_webhooks" ("id" SERIAL NOT NULL, "eventId" character varying NOT NULL, "type" character varying NOT NULL, "payload" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "processed" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_dc243d4c1091abdb9da6867f47a" UNIQUE ("eventId"), CONSTRAINT "PK_3913dc8d0ff7a7247e9f4498fb5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart" ("id" SERIAL NOT NULL, "address_1" character varying(255), "address_2" character varying(255), "country" character varying(100), "city" character varying(100), "zip_code" character varying(20), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "REL_f091e86a234693a49084b4c2c8" UNIQUE ("user_id"), CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."order_item_status_enum" AS ENUM('pending', 'cancelled', 'refunded', 'distributed', 'recovered')`);
        await queryRunner.query(`CREATE TABLE "order_item" ("id" SERIAL NOT NULL, "quantity" integer NOT NULL, "status" "public"."order_item_status_enum" NOT NULL DEFAULT 'pending', "price_per_day" integer NOT NULL, "starts_at" TIMESTAMP WITH TIME ZONE NOT NULL, "ends_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "cart_id" integer, "order_id" integer, "variant_id" integer, CONSTRAINT "CHK_6ff657b3d34781dcb6883111da" CHECK ((order_id IS NOT NULL AND cart_id IS NULL) OR (order_id IS NULL AND cart_id IS NOT NULL)), CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."order_status_enum" AS ENUM('pending', 'confirmed', 'completed', 'cancelled', 'refunded', 'failed')`);
        await queryRunner.query(`CREATE TYPE "public"."order_payment_method_enum" AS ENUM('card', 'onSite')`);
        await queryRunner.query(`CREATE TABLE "order" ("id" SERIAL NOT NULL, "reference" character varying(100) NOT NULL, "status" "public"."order_status_enum" NOT NULL DEFAULT 'pending', "payment_method" "public"."order_payment_method_enum" NOT NULL DEFAULT 'card', "paid_at" TIMESTAMP WITH TIME ZONE, "address_1" character varying(255) NOT NULL, "address_2" character varying(255), "country" character varying(100) NOT NULL, "city" character varying(100) NOT NULL, "zip_code" character varying(20) NOT NULL, "phone" character varying(100), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "date" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "profile_id" integer, CONSTRAINT "UQ_a698ce5a132a8d2ed4be89d8fd8" UNIQUE ("reference"), CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."payment_status_enum" AS ENUM('requires_payment_method', 'requires_confirmation', 'requires_action', 'processing', 'requires_capture', 'canceled', 'succeeded', 'ToBePaid')`);
        await queryRunner.query(`CREATE TABLE "payment" ("id" SERIAL NOT NULL, "stripePaymentIntentId" character varying, "clientSecret" character varying, "amount" integer NOT NULL, "lastPaymentError" boolean NOT NULL DEFAULT false, "currency" character varying NOT NULL DEFAULT 'eur', "status" "public"."payment_status_enum" NOT NULL DEFAULT 'requires_payment_method', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "orderId" integer, "profileId" integer, CONSTRAINT "UQ_aaf4912b634282efbc202ebd4d1" UNIQUE ("stripePaymentIntentId"), CONSTRAINT "UQ_b8832df4e004f97e6436eb6d660" UNIQUE ("clientSecret"), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."profile_role_enum" AS ENUM('user', 'admin', 'superadmin')`);
        await queryRunner.query(`CREATE TABLE "profile" ("user_id" integer NOT NULL, "email" character varying(320) NOT NULL, "firstname" character varying(100) NOT NULL, "lastname" character varying(100) NOT NULL, "role" "public"."profile_role_enum" NOT NULL DEFAULT 'user', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_3825121222d5c17741373d8ad13" UNIQUE ("email"), CONSTRAINT "PK_d752442f45f258a8bdefeebb2f2" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`CREATE TABLE "user_token" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "refresh_token" character varying, "user_id" integer, CONSTRAINT "UQ_9b8c6eac80e52d95241b573877f" UNIQUE ("token"), CONSTRAINT "PK_48cb6b5c20faa63157b3c1baf7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products_categories" ("productId" integer NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_ac147b513b3ed1671ef3577e098" PRIMARY KEY ("productId", "categoryId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b7bcf72f50cb6aca555a72eb63" ON "products_categories" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_10e0ebf99c4b77d7d726036d8e" ON "products_categories" ("categoryId") `);
        await queryRunner.query(`CREATE TABLE "products_activities" ("productId" integer NOT NULL, "activityId" integer NOT NULL, CONSTRAINT "PK_35d40781e9d72b3713c716f7c61" PRIMARY KEY ("productId", "activityId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2825d92c1a6105b223e9cff8ac" ON "products_activities" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_20f159bf189eda23c36fb9fbb6" ON "products_activities" ("activityId") `);
        await queryRunner.query(`ALTER TABLE "activity" ADD CONSTRAINT "FK_3aed15781cd09de7bfb17a24519" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_d6db2bf1b938f69d2ebac5a9de8" FOREIGN KEY ("parent_category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_68c078584a67703b28a510583de" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "FK_b5effca691499d21c5ec683ced6" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_variant" ADD CONSTRAINT "FK_389b217b8a1be355b8671e4378e" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_variant" ADD CONSTRAINT "FK_f7f8850237183492322fa7242b5" FOREIGN KEY ("variant_id") REFERENCES "variant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "variant" ADD CONSTRAINT "FK_738bfa62f918ad1436cb5c8ee5b" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "variant" ADD CONSTRAINT "FK_356ce675157fcfd1451bde0236f" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart" ADD CONSTRAINT "FK_f091e86a234693a49084b4c2c86" FOREIGN KEY ("user_id") REFERENCES "profile"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_74dc6e66cf07bac6f1813db12b3" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_e9674a6053adbaa1057848cddfa" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order_item" ADD CONSTRAINT "FK_6312e502a3cc8068671253bdbaf" FOREIGN KEY ("variant_id") REFERENCES "variant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_3d946eba1edd6c4043bd388cd64" FOREIGN KEY ("profile_id") REFERENCES "profile"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_d09d285fe1645cd2f0db811e293" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payment" ADD CONSTRAINT "FK_4792d05144f3adf28c187c3aa97" FOREIGN KEY ("profileId") REFERENCES "profile"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_d752442f45f258a8bdefeebb2f2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_token" ADD CONSTRAINT "FK_79ac751931054ef450a2ee47778" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products_categories" ADD CONSTRAINT "FK_b7bcf72f50cb6aca555a72eb630" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "products_categories" ADD CONSTRAINT "FK_10e0ebf99c4b77d7d726036d8ec" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products_activities" ADD CONSTRAINT "FK_2825d92c1a6105b223e9cff8ac7" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "products_activities" ADD CONSTRAINT "FK_20f159bf189eda23c36fb9fbb6d" FOREIGN KEY ("activityId") REFERENCES "activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products_activities" DROP CONSTRAINT "FK_20f159bf189eda23c36fb9fbb6d"`);
        await queryRunner.query(`ALTER TABLE "products_activities" DROP CONSTRAINT "FK_2825d92c1a6105b223e9cff8ac7"`);
        await queryRunner.query(`ALTER TABLE "products_categories" DROP CONSTRAINT "FK_10e0ebf99c4b77d7d726036d8ec"`);
        await queryRunner.query(`ALTER TABLE "products_categories" DROP CONSTRAINT "FK_b7bcf72f50cb6aca555a72eb630"`);
        await queryRunner.query(`ALTER TABLE "user_token" DROP CONSTRAINT "FK_79ac751931054ef450a2ee47778"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_d752442f45f258a8bdefeebb2f2"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_4792d05144f3adf28c187c3aa97"`);
        await queryRunner.query(`ALTER TABLE "payment" DROP CONSTRAINT "FK_d09d285fe1645cd2f0db811e293"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_3d946eba1edd6c4043bd388cd64"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_6312e502a3cc8068671253bdbaf"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_e9674a6053adbaa1057848cddfa"`);
        await queryRunner.query(`ALTER TABLE "order_item" DROP CONSTRAINT "FK_74dc6e66cf07bac6f1813db12b3"`);
        await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "FK_f091e86a234693a49084b4c2c86"`);
        await queryRunner.query(`ALTER TABLE "variant" DROP CONSTRAINT "FK_356ce675157fcfd1451bde0236f"`);
        await queryRunner.query(`ALTER TABLE "variant" DROP CONSTRAINT "FK_738bfa62f918ad1436cb5c8ee5b"`);
        await queryRunner.query(`ALTER TABLE "store_variant" DROP CONSTRAINT "FK_f7f8850237183492322fa7242b5"`);
        await queryRunner.query(`ALTER TABLE "store_variant" DROP CONSTRAINT "FK_389b217b8a1be355b8671e4378e"`);
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "FK_b5effca691499d21c5ec683ced6"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_68c078584a67703b28a510583de"`);
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_d6db2bf1b938f69d2ebac5a9de8"`);
        await queryRunner.query(`ALTER TABLE "activity" DROP CONSTRAINT "FK_3aed15781cd09de7bfb17a24519"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_20f159bf189eda23c36fb9fbb6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2825d92c1a6105b223e9cff8ac"`);
        await queryRunner.query(`DROP TABLE "products_activities"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_10e0ebf99c4b77d7d726036d8e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b7bcf72f50cb6aca555a72eb63"`);
        await queryRunner.query(`DROP TABLE "products_categories"`);
        await queryRunner.query(`DROP TABLE "user_token"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP TYPE "public"."profile_role_enum"`);
        await queryRunner.query(`DROP TABLE "payment"`);
        await queryRunner.query(`DROP TYPE "public"."payment_status_enum"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TYPE "public"."order_payment_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
        await queryRunner.query(`DROP TABLE "order_item"`);
        await queryRunner.query(`DROP TYPE "public"."order_item_status_enum"`);
        await queryRunner.query(`DROP TABLE "cart"`);
        await queryRunner.query(`DROP TABLE "stripe_webhooks"`);
        await queryRunner.query(`DROP TABLE "variant"`);
        await queryRunner.query(`DROP TABLE "store_variant"`);
        await queryRunner.query(`DROP TABLE "store"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "activity"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    }

}
