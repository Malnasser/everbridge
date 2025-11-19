import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyAppTable1763454541837 implements MigrationInterface {
    name = 'ModifyAppTable1763454541837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "onboarding_application" ADD "registrationNumber" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "onboarding_application" DROP COLUMN "registrationNumber"`);
    }

}
