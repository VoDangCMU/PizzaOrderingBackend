import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleColumnUser1741957008329 implements MigrationInterface {
    name = 'AddRoleColumnUser1741957008329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "role" character varying NOT NULL DEFAULT 'guest'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
    }

}
