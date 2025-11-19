import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOnnboardingAppHistory1763449417863
  implements MigrationInterface
{
  name = 'AddOnnboardingAppHistory1763449417863';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."onboarding_application_history_action_enum" AS ENUM('created', 'submitted', 'approved', 'rejected', 'returned', 'edited', 'assigned_admin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "onboarding_application_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "action" "public"."onboarding_application_history_action_enum" NOT NULL, "previousState" character varying, "newState" character varying, "metadata" jsonb, "applicationId" uuid, "performedBy" uuid, CONSTRAINT "PK_8006d0077e983ecec282830af9b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."onboarding_application_state_enum" RENAME TO "onboarding_application_state_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."onboarding_application_state_enum" AS ENUM('created', 'submitted', 'approved', 'rejected', 'returned')`,
    );
    await queryRunner.query(
      `ALTER TABLE "onboarding_application" ALTER COLUMN "state" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "onboarding_application" ALTER COLUMN "state" TYPE "public"."onboarding_application_state_enum" USING "state"::"text"::"public"."onboarding_application_state_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "onboarding_application" ALTER COLUMN "state" SET DEFAULT 'created'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."onboarding_application_state_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "onboarding_application_history" ADD CONSTRAINT "FK_126641eaaa8606f4d0db8a6cec1" FOREIGN KEY ("applicationId") REFERENCES "onboarding_application"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "onboarding_application_history" ADD CONSTRAINT "FK_90b22ca9936ed34236618fdcdf4" FOREIGN KEY ("performedBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "onboarding_application_history" DROP CONSTRAINT "FK_90b22ca9936ed34236618fdcdf4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "onboarding_application_history" DROP CONSTRAINT "FK_126641eaaa8606f4d0db8a6cec1"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."onboarding_application_state_enum_old" AS ENUM('draft', 'submitted', 'approved', 'rejected', 'returned')`,
    );
    await queryRunner.query(
      `ALTER TABLE "onboarding_application" ALTER COLUMN "state" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "onboarding_application" ALTER COLUMN "state" TYPE "public"."onboarding_application_state_enum_old" USING "state"::"text"::"public"."onboarding_application_state_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "onboarding_application" ALTER COLUMN "state" SET DEFAULT 'draft'`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."onboarding_application_state_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."onboarding_application_state_enum_old" RENAME TO "onboarding_application_state_enum"`,
    );
    await queryRunner.query(`DROP TABLE "onboarding_application_history"`);
    await queryRunner.query(
      `DROP TYPE "public"."onboarding_application_history_action_enum"`,
    );
  }
}
