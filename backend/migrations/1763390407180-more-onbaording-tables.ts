import { MigrationInterface, QueryRunner } from 'typeorm';

export class MoreOnbaordingTables1763390407180 implements MigrationInterface {
  name = 'MoreOnbaordingTables1763390407180';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."onboarding_application_state_enum" AS ENUM('draft', 'submitted', 'approved', 'rejected', 'returned')`,
    );
    await queryRunner.query(
      `CREATE TABLE "onboarding_application" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "onboardingType" character varying NOT NULL, "adminAssigned" character varying, "state" "public"."onboarding_application_state_enum" NOT NULL DEFAULT 'draft', "schema" jsonb, "data" jsonb, "approved_by" character varying, "ownerId" uuid, CONSTRAINT "PK_259a80807f01a6990e4a89f1e69" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_55578bf6445acf270cbc5d40be" ON "onboarding_application" ("state") `,
    );
    await queryRunner.query(
      `ALTER TABLE "onboarding_application" ADD CONSTRAINT "FK_b728aadb0ee9cb0d7c9a1e31464" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "onboarding_application" DROP CONSTRAINT "FK_b728aadb0ee9cb0d7c9a1e31464"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_55578bf6445acf270cbc5d40be"`,
    );
    await queryRunner.query(`DROP TABLE "onboarding_application"`);
    await queryRunner.query(
      `DROP TYPE "public"."onboarding_application_state_enum"`,
    );
  }
}
