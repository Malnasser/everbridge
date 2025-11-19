import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOnboarding1763544670187 implements MigrationInterface {
    name = 'UpdateOnboarding1763544670187'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "onboarding_applications" ADD "organizationName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."onboarding_applications_state_enum" RENAME TO "onboarding_applications_state_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."onboarding_applications_state_enum" AS ENUM('CREATED', 'SUBMITTED', 'APPROVED', 'REJECTED', 'RETURNED')`);
        await queryRunner.query(`ALTER TABLE "onboarding_applications" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "onboarding_applications" ALTER COLUMN "state" TYPE "public"."onboarding_applications_state_enum" USING "state"::"text"::"public"."onboarding_applications_state_enum"`);
        await queryRunner.query(`ALTER TABLE "onboarding_applications" ALTER COLUMN "state" SET DEFAULT 'CREATED'`);
        await queryRunner.query(`DROP TYPE "public"."onboarding_applications_state_enum_old"`);
        await queryRunner.query(`ALTER TABLE "onboarding_applications" ALTER COLUMN "registrationNumber" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "onboarding_applications" ALTER COLUMN "registrationNumber" DROP NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."onboarding_applications_state_enum_old" AS ENUM('created', 'submitted', 'approved', 'rejected', 'returned')`);
        await queryRunner.query(`ALTER TABLE "onboarding_applications" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "onboarding_applications" ALTER COLUMN "state" TYPE "public"."onboarding_applications_state_enum_old" USING "state"::"text"::"public"."onboarding_applications_state_enum_old"`);
        await queryRunner.query(`ALTER TABLE "onboarding_applications" ALTER COLUMN "state" SET DEFAULT 'created'`);
        await queryRunner.query(`DROP TYPE "public"."onboarding_applications_state_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."onboarding_applications_state_enum_old" RENAME TO "onboarding_applications_state_enum"`);
        await queryRunner.query(`ALTER TABLE "onboarding_applications" DROP COLUMN "organizationName"`);
    }

}
