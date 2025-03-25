import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCrustExtrasImagesSize1741354131600 implements MigrationInterface {
    name = 'AddCrustExtrasImagesSize1741354131600'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pizza_crust" ("id" BIGSERIAL NOT NULL, "crust" character varying NOT NULL DEFAULT 'Thin', "image" character varying NOT NULL DEFAULT 'https://delivery.pizza4ps.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2F4ps_strapi%2FPizza_Combo_195_K_38158f7caf%2FPizza_Combo_195_K_38158f7caf.jpg&w=1920&q=75', "pizzaId" bigint, CONSTRAINT "PK_81d3718ddab2218c674bf621706" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pizza_extras" ("id" BIGSERIAL NOT NULL, "size" character varying NOT NULL DEFAULT 'S', "extra" character varying NOT NULL DEFAULT 'Extra Cheese', "price" bigint NOT NULL DEFAULT '1000', "image" character varying NOT NULL DEFAULT 'https://delivery.pizza4ps.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2F4ps_strapi%2FPizza_Combo_195_K_38158f7caf%2FPizza_Combo_195_K_38158f7caf.jpg&w=1920&q=75', "pizzaId" bigint, CONSTRAINT "PK_64172c4d730160585c8aa9edc1a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pizza_images" ("id" BIGSERIAL NOT NULL, "src" character varying NOT NULL DEFAULT 'https://delivery.pizza4ps.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2F4ps_strapi%2FPizza_Combo_195_K_38158f7caf%2FPizza_Combo_195_K_38158f7caf.jpg&w=1920&q=75', "alt" character varying NOT NULL DEFAULT 'A big BIG pizza', "pizzaId" bigint, CONSTRAINT "PK_096252974ca574ceb26617c3b67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "PizzaSize" ("id" BIGSERIAL NOT NULL, "size" character varying NOT NULL DEFAULT 'S', "price" bigint NOT NULL DEFAULT '1000', "image" character varying NOT NULL DEFAULT 'https://delivery.pizza4ps.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2F4ps_strapi%2FPizza_Combo_195_K_38158f7caf%2FPizza_Combo_195_K_38158f7caf.jpg&w=1920&q=75', "pizzaId" bigint, CONSTRAINT "PK_1f8a1fcca18e67a3a6c148a28b1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pizza_outer_crust" ("id" BIGSERIAL NOT NULL, "size" character varying NOT NULL DEFAULT 'S', "price" bigint NOT NULL DEFAULT '1000', "image" character varying NOT NULL DEFAULT 'https://delivery.pizza4ps.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2F4ps_strapi%2FPizza_Combo_195_K_38158f7caf%2FPizza_Combo_195_K_38158f7caf.jpg&w=1920&q=75', "pizzaId" bigint, CONSTRAINT "PK_0deaf86dcc1de8e54c67dc1977d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pizza_categories" ADD "description" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "pizzas" ADD "description" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "ingredients" ADD "description" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "pizza_ingredients" ADD "description" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD "crustType" character varying NOT NULL DEFAULT 'Thin'`);
        await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "paid" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "pizza_crust" ADD CONSTRAINT "FK_9af4c193890558d5bdf086c5141" FOREIGN KEY ("pizzaId") REFERENCES "pizzas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pizza_extras" ADD CONSTRAINT "FK_9b71986d7907f264dc8bd3bf491" FOREIGN KEY ("pizzaId") REFERENCES "pizzas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pizza_images" ADD CONSTRAINT "FK_1a37512eff85d35db621bc4f86c" FOREIGN KEY ("pizzaId") REFERENCES "pizzas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "PizzaSize" ADD CONSTRAINT "FK_75d43e60163f8698f716bebded3" FOREIGN KEY ("pizzaId") REFERENCES "pizzas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pizza_outer_crust" ADD CONSTRAINT "FK_d1f7c8d0a3d48fa11bb178fc7c2" FOREIGN KEY ("pizzaId") REFERENCES "pizzas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pizza_outer_crust" DROP CONSTRAINT "FK_d1f7c8d0a3d48fa11bb178fc7c2"`);
        await queryRunner.query(`ALTER TABLE "PizzaSize" DROP CONSTRAINT "FK_75d43e60163f8698f716bebded3"`);
        await queryRunner.query(`ALTER TABLE "pizza_images" DROP CONSTRAINT "FK_1a37512eff85d35db621bc4f86c"`);
        await queryRunner.query(`ALTER TABLE "pizza_extras" DROP CONSTRAINT "FK_9b71986d7907f264dc8bd3bf491"`);
        await queryRunner.query(`ALTER TABLE "pizza_crust" DROP CONSTRAINT "FK_9af4c193890558d5bdf086c5141"`);
        await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "paid" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "crustType"`);
        await queryRunner.query(`ALTER TABLE "pizza_ingredients" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "ingredients" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "pizzas" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "pizza_categories" DROP COLUMN "description"`);
        await queryRunner.query(`DROP TABLE "pizza_outer_crust"`);
        await queryRunner.query(`DROP TABLE "PizzaSize"`);
        await queryRunner.query(`DROP TABLE "pizza_images"`);
        await queryRunner.query(`DROP TABLE "pizza_extras"`);
        await queryRunner.query(`DROP TABLE "pizza_crust"`);
    }

}
