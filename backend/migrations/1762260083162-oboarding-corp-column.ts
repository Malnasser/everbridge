import { MigrationInterface, QueryRunner } from "typeorm";

export class OboardingCorpColumn1762260083162 implements MigrationInterface {
    name = 'OboardingCorpColumn1762260083162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" ADD "onboardingStatus" character varying NOT NULL DEFAULT 'INITITED'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "onboardingStatus"`);
    }

}
