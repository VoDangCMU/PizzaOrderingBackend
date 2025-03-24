import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueToPizza1742827715704 implements MigrationInterface {
    name = 'AddUniqueToPizza1742827715704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pizzas" ADD CONSTRAINT "UQ_9138d4819c8577c4805a029427f" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pizzas" DROP CONSTRAINT "UQ_9138d4819c8577c4805a029427f"`);
    }

}
