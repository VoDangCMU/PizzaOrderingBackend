import { MigrationInterface, QueryRunner } from "typeorm";

export class  N1740846143540 implements MigrationInterface {
    name = ' N1740846143540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pizza_ingredients" DROP CONSTRAINT "FK_89f4016bca58dbd74a71b2b1a27"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP COLUMN "cartId"`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD "cartId" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pizza_ingredients" ADD CONSTRAINT "FK_89f4016bca58dbd74a71b2b1a27" FOREIGN KEY ("ingredientId") REFERENCES "pizza_ingredients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_46812348c8da544f3e1afdb712a" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_46812348c8da544f3e1afdb712a"`);
        await queryRunner.query(`ALTER TABLE "pizza_ingredients" DROP CONSTRAINT "FK_89f4016bca58dbd74a71b2b1a27"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP COLUMN "cartId"`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD "cartId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pizza_ingredients" ADD CONSTRAINT "FK_89f4016bca58dbd74a71b2b1a27" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
