import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFeedback1741912696529 implements MigrationInterface {
    name = 'AddFeedback1741912696529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "feedback" ("id" BIGSERIAL NOT NULL, "feedback" character varying NOT NULL, "pizzaId" bigint, "invoiceId" bigint, CONSTRAINT "PK_8389f9e087a57689cd5be8b2b13" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD CONSTRAINT "FK_a8887949b6d121d06cd18f0dc2c" FOREIGN KEY ("pizzaId") REFERENCES "pizzas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD CONSTRAINT "FK_c6e672648aac72d08cf43f67983" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feedback" DROP CONSTRAINT "FK_c6e672648aac72d08cf43f67983"`);
        await queryRunner.query(`ALTER TABLE "feedback" DROP CONSTRAINT "FK_a8887949b6d121d06cd18f0dc2c"`);
        await queryRunner.query(`DROP TABLE "feedback"`);
    }

}
