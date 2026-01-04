import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateFieldTable1765384036741 implements MigrationInterface {
    name = 'CreateFieldTable1765384036741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."field_soil_type_enum" AS ENUM(
                'чорнозем',
                'супіщаний',
                'суглинковий',
                'піщаний',
                'торф''яний',
                'глинистий',
                'кам''янистий',
                'солончаковий',
                'болотистий'
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "field" (
                "field_name" character varying(20) NOT NULL,
                "area_hectares" numeric(10, 3) NOT NULL,
                "soil_type" "public"."field_soil_type_enum" NOT NULL,
                "field_location" character varying(20) NOT NULL,
                CONSTRAINT "UQ_58b5e2c1ab971581b8b366ae754" UNIQUE ("field_location"),
                CONSTRAINT "PK_f90bcf8ee2c5280ca7ed470ddf8" PRIMARY KEY ("field_name")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "field"`);
        await queryRunner.query(`DROP TYPE "public"."field_soil_type_enum"`);
    }
}