import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUnitPriceToPizza1742886250237 implements MigrationInterface {
    name = 'AddUnitPriceToPizza1742886250237'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pizzas" ADD "unitPrice" integer NOT NULL DEFAULT '10'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pizzas" DROP COLUMN "unitPrice"`);
    }

}
