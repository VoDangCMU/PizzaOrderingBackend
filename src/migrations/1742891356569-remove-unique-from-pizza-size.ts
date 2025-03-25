import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUniqueFromPizzaSize1742891356569 implements MigrationInterface {
    name = 'RemoveUniqueFromPizzaSize1742891356569'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pizza_sizes" DROP CONSTRAINT "UQ_842948576934b6747fa6a5122ba"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pizza_sizes" ADD CONSTRAINT "UQ_842948576934b6747fa6a5122ba" UNIQUE ("size")`);
    }

}
