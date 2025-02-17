import { MigrationInterface, QueryRunner } from "typeorm";

export class SyncDb11739810134405 implements MigrationInterface {
    name = 'SyncDb11739810134405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pizza_categories" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_66bb028762145e9bcee9c191d11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pizzas" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, "categoryId" bigint, CONSTRAINT "PK_27f7ede7b9304d8372a336d1e5d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pizza_ingredients" ("id" BIGSERIAL NOT NULL, "pizzaId" bigint, "ingredientId" bigint, CONSTRAINT "PK_fc97c0e9ef2303294f1d5375a0d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "carts" ("id" BIGSERIAL NOT NULL, "userId" bigint, CONSTRAINT "PK_b5f695a59f5ebb50af3c8160816" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invoices" ("id" BIGSERIAL NOT NULL, "cartId" integer NOT NULL, "price" integer NOT NULL, "paid" boolean NOT NULL, "userId" bigint, CONSTRAINT "PK_668cef7c22a427fd822cc1be3ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ingredients" ("id" BIGSERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_9240185c8a5507251c9f15e0649" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cart_items" ("id" BIGSERIAL NOT NULL, "quantity" integer NOT NULL, "size" character varying NOT NULL, "cartId" bigint, "pizzaId" bigint, CONSTRAINT "PK_6fccf5ec03c172d27a28a82928b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pizzas" ADD CONSTRAINT "FK_a500c5011e31e1160852e25afb4" FOREIGN KEY ("categoryId") REFERENCES "pizza_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pizza_ingredients" ADD CONSTRAINT "FK_fd617053b98c2c6dfa5080c9698" FOREIGN KEY ("pizzaId") REFERENCES "pizzas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pizza_ingredients" ADD CONSTRAINT "FK_89f4016bca58dbd74a71b2b1a27" FOREIGN KEY ("ingredientId") REFERENCES "pizza_ingredients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "carts" ADD CONSTRAINT "FK_69828a178f152f157dcf2f70a89" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_fcbe490dc37a1abf68f19c5ccb9" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_edd714311619a5ad09525045838" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_5408a415b9f6243196b562461c3" FOREIGN KEY ("pizzaId") REFERENCES "pizzas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_5408a415b9f6243196b562461c3"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_edd714311619a5ad09525045838"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_fcbe490dc37a1abf68f19c5ccb9"`);
        await queryRunner.query(`ALTER TABLE "carts" DROP CONSTRAINT "FK_69828a178f152f157dcf2f70a89"`);
        await queryRunner.query(`ALTER TABLE "pizza_ingredients" DROP CONSTRAINT "FK_89f4016bca58dbd74a71b2b1a27"`);
        await queryRunner.query(`ALTER TABLE "pizza_ingredients" DROP CONSTRAINT "FK_fd617053b98c2c6dfa5080c9698"`);
        await queryRunner.query(`ALTER TABLE "pizzas" DROP CONSTRAINT "FK_a500c5011e31e1160852e25afb4"`);
        await queryRunner.query(`DROP TABLE "cart_items"`);
        await queryRunner.query(`DROP TABLE "ingredients"`);
        await queryRunner.query(`DROP TABLE "invoices"`);
        await queryRunner.query(`DROP TABLE "carts"`);
        await queryRunner.query(`DROP TABLE "pizza_ingredients"`);
        await queryRunner.query(`DROP TABLE "pizzas"`);
        await queryRunner.query(`DROP TABLE "pizza_categories"`);
    }

}
