import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeIngredientType1740800276027 implements MigrationInterface {
    name = 'ChangeIngredientType1740800276027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pizza_ingredients" DROP CONSTRAINT "FK_89f4016bca58dbd74a71b2b1a27"`);
        await queryRunner.query(`ALTER TABLE "pizza_ingredients" ADD CONSTRAINT "FK_89f4016bca58dbd74a71b2b1a27" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pizza_ingredients" DROP CONSTRAINT "FK_89f4016bca58dbd74a71b2b1a27"`);
        await queryRunner.query(`ALTER TABLE "pizza_ingredients" ADD CONSTRAINT "FK_89f4016bca58dbd74a71b2b1a27" FOREIGN KEY ("ingredientId") REFERENCES "pizza_ingredients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
