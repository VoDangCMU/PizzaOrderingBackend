import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNoteToCartItem1740984467706 implements MigrationInterface {
    name = 'AddNoteToCartItem1740984467706'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_items" ADD "note" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP COLUMN "cartId"`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD "cartId" bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_46812348c8da544f3e1afdb712a" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_46812348c8da544f3e1afdb712a"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP COLUMN "cartId"`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD "cartId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "note"`);
    }

}
