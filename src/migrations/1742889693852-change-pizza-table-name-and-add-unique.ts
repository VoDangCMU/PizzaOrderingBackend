import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangePizzaTableNameAndAddUnique1742889693852 implements MigrationInterface {
    name = 'ChangePizzaTableNameAndAddUnique1742889693852'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_649a983b842d920da99aa55a447"`);
        await queryRunner.query(`CREATE TABLE "pizza_sizes" ("id" BIGSERIAL NOT NULL, "size" character varying NOT NULL DEFAULT 'S', "price" bigint NOT NULL DEFAULT '1000', "image" character varying NOT NULL DEFAULT 'https://i.imgur.com/tHiEYPf.png', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "pizzaId" bigint, CONSTRAINT "UQ_842948576934b6747fa6a5122ba" UNIQUE ("size"), CONSTRAINT "PK_5ed477cac0e2fd901a44fdaf7f8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pizza_sizes" ADD CONSTRAINT "FK_0bd4b8553375eb8b7da1ab50287" FOREIGN KEY ("pizzaId") REFERENCES "pizzas"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_649a983b842d920da99aa55a447" FOREIGN KEY ("sizeId") REFERENCES "pizza_sizes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_649a983b842d920da99aa55a447"`);
        await queryRunner.query(`ALTER TABLE "pizza_sizes" DROP CONSTRAINT "FK_0bd4b8553375eb8b7da1ab50287"`);
        await queryRunner.query(`DROP TABLE "pizza_sizes"`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_649a983b842d920da99aa55a447" FOREIGN KEY ("sizeId") REFERENCES "PizzaSize"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
