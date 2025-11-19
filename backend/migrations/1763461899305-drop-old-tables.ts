import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropOldTables1763461899305 implements MigrationInterface {
  name = 'DropOldTables1763461899305';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop onboarding_application_history and related objects
    await queryRunner.query(
      `ALTER TABLE "onboarding_application_history" DROP CONSTRAINT "FK_90b22ca9936ed34236618fdcdf4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "onboarding_application_history" DROP CONSTRAINT "FK_126641eaaa8606f4d0db8a6cec1"`,
    );
    await queryRunner.query(`DROP TABLE "onboarding_application_history"`);
    await queryRunner.query(
      `DROP TYPE "public"."onboarding_application_history_action_enum"`,
    );

    // Drop onboarding_application and related objects
    await queryRunner.query(
      `ALTER TABLE "onboarding_application" DROP CONSTRAINT "FK_c18f6765b6257f36a4542a5b2d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "onboarding_application" DROP CONSTRAINT "FK_b728aadb0ee9cb0d7c9a1e31464"`,
    );
    await queryRunner.query(`DROP TABLE "onboarding_application"`);
    await queryRunner.query(
      `DROP TYPE "public"."onboarding_application_onboardingtype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."onboarding_application_state_enum"`,
    );

    // Drop invitation
    await queryRunner.query(
      `ALTER TABLE "invitation" DROP CONSTRAINT "FK_a421da13b2fe31ed22805caa283"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation" DROP CONSTRAINT "FK_5df23b7999dd0ccaedd210bf42c"`,
    );
    await queryRunner.query(`DROP TABLE "invitation"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Recreate invitation table
    await queryRunner.query(
      `CREATE TABLE "invitation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "email" character varying NOT NULL, "organizationName" character varying, "token" character varying NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "acceptedAt" TIMESTAMP WITH TIME ZONE, "targetOrgId" uuid, "invitedByUserId" uuid, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "organizationType" character varying NOT NULL DEFAULT 'SME', CONSTRAINT "UQ_bcb0a0d2333443083582a05cdd8" UNIQUE ("email"), CONSTRAINT "UQ_e061236e6abd8503aa3890af94c" UNIQUE ("token"), CONSTRAINT "PK_beb994737756c0f18a1c1f8669c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation" ADD CONSTRAINT "FK_a421da13b2fe31ed22805caa283" FOREIGN KEY ("invitedByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invitation" ADD CONSTRAINT "FK_5df23b7999dd0ccaedd210bf42c" FOREIGN KEY ("targetOrgId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // Recreate onboarding_application and related types
    await queryRunner.query(
      `CREATE TYPE "public"."onboarding_application_state_enum" AS ENUM('created', 'submitted', 'approved', 'rejected', 'returned')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."onboarding_application_onboardingtype_enum" AS ENUM('SME_ONBOARDING', 'BUYER_ONBOARDING')`,
    );
    await queryRunner.query(
      `CREATE TABLE "onboarding_application" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "adminAssigned" character varying, "state" "public"."onboarding_application_state_enum" NOT NULL DEFAULT 'created', "schema" jsonb, "data" jsonb, "ownerId" uuid, "approvedBy" uuid, "onboardingType" "public"."onboarding_application_onboardingtype_enum" NOT NULL, "registrationNumber" character varying, CONSTRAINT "PK_259a80807f01a6990e4a89f1e69" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_55578bf6445acf270cbc5d40be" ON "onboarding_application" ("state") `,
    );
    await queryRunner.query(
      `ALTER TABLE "onboarding_application" ADD CONSTRAINT "FK_b728aadb0ee9cb0d7c9a1e31464" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "onboarding_application" ADD CONSTRAINT "FK_c18f6765b6257f36a4542a5b2d1" FOREIGN KEY ("approvedBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    // Recreate onboarding_application_history and related types
    await queryRunner.query(
      `CREATE TYPE "public"."onboarding_application_history_action_enum" AS ENUM('created', 'submitted', 'approved', 'rejected', 'returned', 'edited', 'assigned_admin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "onboarding_application_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "action" "public"."onboarding_application_history_action_enum" NOT NULL, "previousState" character varying, "newState" character varying, "metadata" jsonb, "applicationId" uuid, "performedBy" uuid, CONSTRAINT "PK_8006d0077e983ecec282830af9b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "onboarding_application_history" ADD CONSTRAINT "FK_126641eaaa8606f4d0db8a6cec1" FOREIGN KEY ("applicationId") REFERENCES "onboarding_application"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "onboarding_application_history" ADD CONSTRAINT "FK_90b22ca9936ed34236618fdcdf4" FOREIGN KEY ("performedBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
