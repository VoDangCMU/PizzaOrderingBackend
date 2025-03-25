import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueToIngredients1742832095462 implements MigrationInterface {
    name = 'AddUniqueToIngredients1742832095462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredients" ADD CONSTRAINT "UQ_a955029b22ff66ae9fef2e161f8" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredients" DROP CONSTRAINT "UQ_a955029b22ff66ae9fef2e161f8"`);
    }

}
