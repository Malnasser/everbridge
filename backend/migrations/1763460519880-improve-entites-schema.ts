import { MigrationInterface, QueryRunner } from "typeorm";

export class ImproveEntitesSchema1763460519880 implements MigrationInterface {
    name = 'ImproveEntitesSchema1763460519880'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."onboarding_applications_onboardingtype_enum" AS ENUM('SME_ONBOARDING', 'BUYER_ONBOARDING')`);
        await queryRunner.query(`CREATE TYPE "public"."onboarding_applications_state_enum" AS ENUM('created', 'submitted', 'approved', 'rejected', 'returned')`);
        await queryRunner.query(`CREATE TABLE "onboarding_applications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "onboardingType" "public"."onboarding_applications_onboardingtype_enum" NOT NULL, "adminAssigned" character varying, "state" "public"."onboarding_applications_state_enum" NOT NULL DEFAULT 'created', "schema" jsonb NOT NULL, "data" jsonb DEFAULT '{}', "registrationNumber" character varying, "approvedBy" uuid, "ownerId" uuid, CONSTRAINT "PK_a16b04e61cb1e7bf9d87280de67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9fd75df8d0e4b98c63ceb5385e" ON "onboarding_applications" ("state") `);
        await queryRunner.query(`CREATE TYPE "public"."onboarding_applications_history_action_enum" AS ENUM('created', 'submitted', 'approved', 'rejected', 'returned', 'edited', 'assigned_admin')`);
        await queryRunner.query(`CREATE TABLE "onboarding_applications_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "action" "public"."onboarding_applications_history_action_enum" NOT NULL, "previousState" character varying, "newState" character varying, "metadata" jsonb, "applicationId" uuid, "performedBy" uuid, CONSTRAINT "PK_2181a46834787e5c581c220baf6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invitations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "token" character varying NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "acceptedAt" TIMESTAMP WITH TIME ZONE, "invitedByUserId" uuid, CONSTRAINT "UQ_97ab59cb592c7cec109741b592d" UNIQUE ("email"), CONSTRAINT "UQ_e577dcf9bb6d084373ed3998509" UNIQUE ("token"), CONSTRAINT "PK_5dec98cfdfd562e4ad3648bbb07" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "onboarding_applications" ADD CONSTRAINT "FK_1aa4cd9d86ec7d2412611b145b5" FOREIGN KEY ("approvedBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onboarding_applications" ADD CONSTRAINT "FK_4f15cbbfb7464db4595444f3c21" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onboarding_applications_history" ADD CONSTRAINT "FK_5d68477b45c30fc6b6f7f76dbd8" FOREIGN KEY ("applicationId") REFERENCES "onboarding_applications"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "onboarding_applications_history" ADD CONSTRAINT "FK_4c4ad6fc6da00e8e921134770b5" FOREIGN KEY ("performedBy") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitations" ADD CONSTRAINT "FK_b7423cfb362a842b7ea0a3763b9" FOREIGN KEY ("invitedByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitations" DROP CONSTRAINT "FK_b7423cfb362a842b7ea0a3763b9"`);
        await queryRunner.query(`ALTER TABLE "onboarding_applications_history" DROP CONSTRAINT "FK_4c4ad6fc6da00e8e921134770b5"`);
        await queryRunner.query(`ALTER TABLE "onboarding_applications_history" DROP CONSTRAINT "FK_5d68477b45c30fc6b6f7f76dbd8"`);
        await queryRunner.query(`ALTER TABLE "onboarding_applications" DROP CONSTRAINT "FK_4f15cbbfb7464db4595444f3c21"`);
        await queryRunner.query(`ALTER TABLE "onboarding_applications" DROP CONSTRAINT "FK_1aa4cd9d86ec7d2412611b145b5"`);
        await queryRunner.query(`DROP TABLE "invitations"`);
        await queryRunner.query(`DROP TABLE "onboarding_applications_history"`);
        await queryRunner.query(`DROP TYPE "public"."onboarding_applications_history_action_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9fd75df8d0e4b98c63ceb5385e"`);
        await queryRunner.query(`DROP TABLE "onboarding_applications"`);
        await queryRunner.query(`DROP TYPE "public"."onboarding_applications_state_enum"`);
        await queryRunner.query(`DROP TYPE "public"."onboarding_applications_onboardingtype_enum"`);
    }

}
