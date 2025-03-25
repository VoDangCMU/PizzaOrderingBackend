import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeCrustAndCartItemEntity1742285736255 implements MigrationInterface {
    name = 'ChangeCrustAndCartItemEntity1742285736255'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_40ce9dedc52f9cbf537af62cc62"`);
        await queryRunner.query(`ALTER TABLE "cart_items" RENAME COLUMN "crustTypeId" TO "crustId"`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_4e30bf6dcb76ce4c1c916f4d184" FOREIGN KEY ("crustId") REFERENCES "pizza_crust"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_4e30bf6dcb76ce4c1c916f4d184"`);
        await queryRunner.query(`ALTER TABLE "cart_items" RENAME COLUMN "crustId" TO "crustTypeId"`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_40ce9dedc52f9cbf537af62cc62" FOREIGN KEY ("crustTypeId") REFERENCES "pizza_crust"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
