import { MigrationInterface, QueryRunner } from "typeorm";

export class HumanTaskAttachmentSetup1763832506090 implements MigrationInterface {
    name = 'HumanTaskAttachmentSetup1763832506090'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task_attachments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "uploadId" uuid, "humanTaskId" uuid NOT NULL, "fieldKey" character varying NOT NULL, "notes" character varying, CONSTRAINT "PK_34eb9e5133310a488eaba0be28a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "task_attachments" ADD CONSTRAINT "FK_49c1f1849e6d15774bee13d8c7b" FOREIGN KEY ("uploadId") REFERENCES "uploads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_attachments" ADD CONSTRAINT "FK_5c9432a04300c3cbe97108993e8" FOREIGN KEY ("humanTaskId") REFERENCES "human_tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task_attachments" DROP CONSTRAINT "FK_5c9432a04300c3cbe97108993e8"`);
        await queryRunner.query(`ALTER TABLE "task_attachments" DROP CONSTRAINT "FK_49c1f1849e6d15774bee13d8c7b"`);
        await queryRunner.query(`DROP TABLE "task_attachments"`);
    }

}
