import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangrRoleUser1741958286831 implements MigrationInterface {
    name = 'ChangrRoleUser1741958286831'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'guest'`);
    }

}
