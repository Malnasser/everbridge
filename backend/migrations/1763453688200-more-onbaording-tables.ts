import { MigrationInterface, QueryRunner } from "typeorm";

export class MoreOnbaordingTables1763453688200 implements MigrationInterface {
    name = 'MoreOnbaordingTables1763453688200'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "onboarding_application" DROP COLUMN "approved_by"`);
        await queryRunner.query(`ALTER TABLE "onboarding_application" ADD "approvedBy" uuid`);
        await queryRunner.query(`ALTER TABLE "onboarding_application" DROP COLUMN "onboardingType"`);
        await queryRunner.query(`CREATE TYPE "public"."onboarding_application_onboardingtype_enum" AS ENUM('SME_ONBOARDING', 'BUYER_ONBOARDING')`);
        await queryRunner.query(`ALTER TABLE "onboarding_application" ADD "onboardingType" "public"."onboarding_application_onboardingtype_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "onboarding_application" ADD CONSTRAINT "FK_c18f6765b6257f36a4542a5b2d1" FOREIGN KEY ("approvedBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "onboarding_application" DROP CONSTRAINT "FK_c18f6765b6257f36a4542a5b2d1"`);
        await queryRunner.query(`ALTER TABLE "onboarding_application" DROP COLUMN "onboardingType"`);
        await queryRunner.query(`DROP TYPE "public"."onboarding_application_onboardingtype_enum"`);
        await queryRunner.query(`ALTER TABLE "onboarding_application" ADD "onboardingType" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "onboarding_application" DROP COLUMN "approvedBy"`);
        await queryRunner.query(`ALTER TABLE "onboarding_application" ADD "approved_by" character varying`);
    }

}
