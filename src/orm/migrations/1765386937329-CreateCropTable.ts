import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateCropTable1765386937329 implements MigrationInterface {
    name = 'CreateCropTable1765386937329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."crop_crop_status_enum" AS ENUM(
                'готується до посіву',
                'засівається',
                'активний',
                'готується до збору',
                'збирається',
                'завершений'
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "crop" (
                "crop_id" SERIAL NOT NULL,
                "cultivated_plant_name" character varying(20) NOT NULL,
                "crop_start_date" date NOT NULL,
                "crop_harvest_date" date NOT NULL,
                "actual_harvest_tons" smallint NOT NULL,
                "crop_status" "public"."crop_crop_status_enum" NOT NULL,
                "field_name" character varying(20),
                CONSTRAINT "PK_1813647a0d624f8860ebc7382d7" PRIMARY KEY ("crop_id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "crop"
            ADD CONSTRAINT "FK_0063e7fa7bbfe248db4cc8c4791" FOREIGN KEY ("field_name") REFERENCES "field"("field_name") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "crop" DROP CONSTRAINT "FK_0063e7fa7bbfe248db4cc8c4791"
        `);
        await queryRunner.query(`
            DROP TABLE "crop"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."crop_crop_status_enum"
        `);
    }
}