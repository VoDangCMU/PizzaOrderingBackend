import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeInvoiceEntity1744065086407 implements MigrationInterface {
    name = 'ChangeInvoiceEntity1744065086407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices" DROP COLUMN "cartId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices" ADD "cartId" integer NOT NULL`);
    }

}
