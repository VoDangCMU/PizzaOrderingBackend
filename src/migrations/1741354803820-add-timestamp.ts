import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTimestamp1741354803820 implements MigrationInterface {
    name = 'AddTimestamp1741354803820'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pizza_categories" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "pizza_categories" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "pizza_crust" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "pizza_crust" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "pizza_extras" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "pizza_extras" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "pizza_images" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "pizza_images" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "pizzas" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "pizzas" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "PizzaSize" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "PizzaSize" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "ingredients" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "ingredients" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "pizza_ingredients" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "pizza_ingredients" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "pizza_outer_crust" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "pizza_outer_crust" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pizza_outer_crust" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "pizza_outer_crust" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "pizza_ingredients" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "pizza_ingredients" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "ingredients" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "ingredients" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "PizzaSize" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "PizzaSize" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "pizzas" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "pizzas" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "pizza_images" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "pizza_images" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "pizza_extras" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "pizza_extras" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "pizza_crust" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "pizza_crust" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "pizza_categories" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "pizza_categories" DROP COLUMN "createdAt"`);
    }

}
