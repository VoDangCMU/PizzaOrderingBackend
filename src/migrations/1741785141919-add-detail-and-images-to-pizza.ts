import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDetailAndImagesToPizza1741785141919 implements MigrationInterface {
    name = 'AddDetailAndImagesToPizza1741785141919'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "size"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "crustType"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "avatar" character varying NOT NULL DEFAULT 'https://i.imgur.com/oKuKLoh.png'`);
        await queryRunner.query(`ALTER TABLE "ingredients" ADD "image" character varying NOT NULL DEFAULT 'https://i.imgur.com/JvjEmTP.png'`);
        await queryRunner.query(`ALTER TABLE "pizza_outer_crust" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD "crustTypeId" bigint`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD "extraId" bigint`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD "sizeId" bigint`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD "outerCrustId" bigint`);
        await queryRunner.query(`ALTER TABLE "pizza_crust" ALTER COLUMN "image" SET DEFAULT 'https://i.imgur.com/dlk37Sb.jpeg'`);
        await queryRunner.query(`ALTER TABLE "pizza_extras" ALTER COLUMN "image" SET DEFAULT 'https://i.imgur.com/JB4UIiM.png'`);
        await queryRunner.query(`ALTER TABLE "pizza_images" ALTER COLUMN "src" SET DEFAULT 'https://i.imgur.com/BXEIALV.png'`);
        await queryRunner.query(`ALTER TABLE "PizzaSize" ALTER COLUMN "image" SET DEFAULT 'https://i.imgur.com/tHiEYPf.png'`);
        await queryRunner.query(`ALTER TABLE "pizza_outer_crust" ALTER COLUMN "image" SET DEFAULT 'https://i.imgur.com/JB4UIiM.png'`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_40ce9dedc52f9cbf537af62cc62" FOREIGN KEY ("crustTypeId") REFERENCES "pizza_crust"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_4d8e7680dd7dc24fdd3f23d78f6" FOREIGN KEY ("extraId") REFERENCES "pizza_extras"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_649a983b842d920da99aa55a447" FOREIGN KEY ("sizeId") REFERENCES "PizzaSize"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD CONSTRAINT "FK_bb0b695e038370a6e8baf25c6d7" FOREIGN KEY ("outerCrustId") REFERENCES "pizza_outer_crust"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_bb0b695e038370a6e8baf25c6d7"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_649a983b842d920da99aa55a447"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_4d8e7680dd7dc24fdd3f23d78f6"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP CONSTRAINT "FK_40ce9dedc52f9cbf537af62cc62"`);
        await queryRunner.query(`ALTER TABLE "pizza_outer_crust" ALTER COLUMN "image" SET DEFAULT 'https://delivery.pizza4ps.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2F4ps_strapi%2FPizza_Combo_195_K_38158f7caf%2FPizza_Combo_195_K_38158f7caf.jpg&w=1920&q=75'`);
        await queryRunner.query(`ALTER TABLE "PizzaSize" ALTER COLUMN "image" SET DEFAULT 'https://delivery.pizza4ps.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2F4ps_strapi%2FPizza_Combo_195_K_38158f7caf%2FPizza_Combo_195_K_38158f7caf.jpg&w=1920&q=75'`);
        await queryRunner.query(`ALTER TABLE "pizza_images" ALTER COLUMN "src" SET DEFAULT 'https://delivery.pizza4ps.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2F4ps_strapi%2FPizza_Combo_195_K_38158f7caf%2FPizza_Combo_195_K_38158f7caf.jpg&w=1920&q=75'`);
        await queryRunner.query(`ALTER TABLE "pizza_extras" ALTER COLUMN "image" SET DEFAULT 'https://delivery.pizza4ps.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2F4ps_strapi%2FPizza_Combo_195_K_38158f7caf%2FPizza_Combo_195_K_38158f7caf.jpg&w=1920&q=75'`);
        await queryRunner.query(`ALTER TABLE "pizza_crust" ALTER COLUMN "image" SET DEFAULT 'https://delivery.pizza4ps.com/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2F4ps_strapi%2FPizza_Combo_195_K_38158f7caf%2FPizza_Combo_195_K_38158f7caf.jpg&w=1920&q=75'`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "outerCrustId"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "sizeId"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "extraId"`);
        await queryRunner.query(`ALTER TABLE "cart_items" DROP COLUMN "crustTypeId"`);
        await queryRunner.query(`ALTER TABLE "pizza_outer_crust" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "ingredients" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD "crustType" character varying NOT NULL DEFAULT 'Thin'`);
        await queryRunner.query(`ALTER TABLE "cart_items" ADD "size" character varying NOT NULL`);
    }

}
