import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateFieldWorkTable1765388339856 implements MigrationInterface {
    name = 'CreateFieldWorkTable1765388339856'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."field_work_work_type_enum" AS ENUM(
                'орка',
                'сівба',
                'обробіток міжрядь',
                'полив',
                'внесення добрив',
                'захист від шкідників',
                'збирання врожаю',
                'зяблева оранка',
                'лушення',
                'боронування',
                'прибирання пожнивних залишків',
                'мульчування',
                'підживлення',
                'обприскування',
                'просаджування',
                'кошення',
                'валкування',
                'тюкування'
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "field_work" (
                "work_id" SERIAL NOT NULL,
                "employee_id" integer NOT NULL,
                "machinery_id" integer NOT NULL,
                "work_type" "public"."field_work_work_type_enum" NOT NULL,
                "work_start_date" date NOT NULL,
                "work_end_date" date NOT NULL,
                "crop_id" integer,
                CONSTRAINT "PK_274ab2014c50a3cbbcaf744d7fc" PRIMARY KEY ("work_id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "field_work"
            ADD CONSTRAINT "FK_3404870557b8611414fec2c6d27" FOREIGN KEY ("crop_id") REFERENCES "crop"("crop_id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "field_work" DROP CONSTRAINT "FK_3404870557b8611414fec2c6d27"
        `);
        await queryRunner.query(`DROP TABLE "field_work"`);
        await queryRunner.query(`DROP TYPE "public"."field_work_work_type_enum"`);
    }
}