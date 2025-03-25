import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueToCategory1742827429549 implements MigrationInterface {
    name = 'AddUniqueToCategory1742827429549'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pizza_categories" ADD CONSTRAINT "UQ_8ad76dfc5e3e4a0fb6c1234c1d2" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pizza_categories" DROP CONSTRAINT "UQ_8ad76dfc5e3e4a0fb6c1234c1d2"`);
    }

}
