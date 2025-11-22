import { MigrationInterface, QueryRunner } from "typeorm";

export class HumanTaskSetup1763832090144 implements MigrationInterface {
    name = 'HumanTaskSetup1763832090144'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "human_task_signals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "humanTaskId" uuid NOT NULL, "signal" character varying NOT NULL, "performedById" uuid, "metadata" jsonb, CONSTRAINT "PK_ffd6acd59f8d582442e7fe7cca3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."human_task_authorizations_authtype_enum" AS ENUM('group_org', 'group_org_type', 'user')`);
        await queryRunner.query(`CREATE TYPE "public"."human_task_authorizations_orgtype_enum" AS ENUM('PLATFORM', 'BUYER', 'SME', 'BANK')`);
        await queryRunner.query(`CREATE TABLE "human_task_authorizations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "humanTaskId" character varying NOT NULL, "authType" "public"."human_task_authorizations_authtype_enum" NOT NULL, "orgId" uuid, "orgType" "public"."human_task_authorizations_orgtype_enum", "groupId" character varying, "userId" uuid, "canClaim" boolean NOT NULL DEFAULT true, "canExecuteSignals" jsonb, CONSTRAINT "PK_362e703284926643ac22969e54d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."human_tasks_status_enum" AS ENUM('READY', 'CLAIMED', 'COMPLETED')`);
        await queryRunner.query(`CREATE TABLE "human_tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "businessProcessType" character varying NOT NULL, "businessProcessId" character varying NOT NULL, "name" character varying NOT NULL, "status" "public"."human_tasks_status_enum" NOT NULL DEFAULT 'READY', "schema" jsonb NOT NULL, "formData" jsonb NOT NULL DEFAULT '{}', "metadata" jsonb, "authorizationId" uuid, CONSTRAINT "REL_f0b462ca2a152689e085565151" UNIQUE ("authorizationId"), CONSTRAINT "PK_0140b8f2535f89a93aaa0d8ee72" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."comments_visibility_enum" AS ENUM('internal', 'cross_org')`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "entityType" character varying NOT NULL, "entityId" character varying NOT NULL, "visibility" "public"."comments_visibility_enum" NOT NULL DEFAULT 'internal', "content" text NOT NULL, "metadata" jsonb, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "human_task_signals" ADD CONSTRAINT "FK_c4f844c868a6996ab9294a66cd0" FOREIGN KEY ("humanTaskId") REFERENCES "human_tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "human_task_signals" ADD CONSTRAINT "FK_cc4fc4962e52b22e8fb03e90a3c" FOREIGN KEY ("performedById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "human_task_authorizations" ADD CONSTRAINT "FK_fff8925710ff9a0da0d10588266" FOREIGN KEY ("orgId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "human_task_authorizations" ADD CONSTRAINT "FK_6a5ad3c95be52dbc376ed7cfb2e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "human_tasks" ADD CONSTRAINT "FK_f0b462ca2a152689e085565151b" FOREIGN KEY ("authorizationId") REFERENCES "human_task_authorizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "human_tasks" DROP CONSTRAINT "FK_f0b462ca2a152689e085565151b"`);
        await queryRunner.query(`ALTER TABLE "human_task_authorizations" DROP CONSTRAINT "FK_6a5ad3c95be52dbc376ed7cfb2e"`);
        await queryRunner.query(`ALTER TABLE "human_task_authorizations" DROP CONSTRAINT "FK_fff8925710ff9a0da0d10588266"`);
        await queryRunner.query(`ALTER TABLE "human_task_signals" DROP CONSTRAINT "FK_cc4fc4962e52b22e8fb03e90a3c"`);
        await queryRunner.query(`ALTER TABLE "human_task_signals" DROP CONSTRAINT "FK_c4f844c868a6996ab9294a66cd0"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TYPE "public"."comments_visibility_enum"`);
        await queryRunner.query(`DROP TABLE "human_tasks"`);
        await queryRunner.query(`DROP TYPE "public"."human_tasks_status_enum"`);
        await queryRunner.query(`DROP TABLE "human_task_authorizations"`);
        await queryRunner.query(`DROP TYPE "public"."human_task_authorizations_orgtype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."human_task_authorizations_authtype_enum"`);
        await queryRunner.query(`DROP TABLE "human_task_signals"`);
    }

}
