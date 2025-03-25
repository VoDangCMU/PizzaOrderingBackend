import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUnitPriceToDecimal1742886494400 implements MigrationInterface {
    name = 'ChangeUnitPriceToDecimal1742886494400'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pizzas" DROP COLUMN "unitPrice"`);
        await queryRunner.query(`ALTER TABLE "pizzas" ADD "unitPrice" numeric NOT NULL DEFAULT '10'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pizzas" DROP COLUMN "unitPrice"`);
        await queryRunner.query(`ALTER TABLE "pizzas" ADD "unitPrice" integer NOT NULL DEFAULT '10'`);
    }

}
