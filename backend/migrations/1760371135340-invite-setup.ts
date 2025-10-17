import { MigrationInterface, QueryRunner } from "typeorm";

export class InviteSetup1760371135340 implements MigrationInterface {
    name = 'InviteSetup1760371135340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "invitation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "updatedBy" character varying, "email" character varying NOT NULL, "organizationName" character varying NOT NULL, "token" character varying NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "acceptedAt" TIMESTAMP WITH TIME ZONE, "targetOrgId" uuid, "invitedByUserId" uuid, CONSTRAINT "UQ_bcb0a0d2333443083582a05cdd8" UNIQUE ("email"), CONSTRAINT "UQ_e061236e6abd8503aa3890af94c" UNIQUE ("token"), CONSTRAINT "PK_beb994737756c0f18a1c1f8669c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "invitation" ADD CONSTRAINT "FK_a421da13b2fe31ed22805caa283" FOREIGN KEY ("invitedByUserId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invitation" ADD CONSTRAINT "FK_5df23b7999dd0ccaedd210bf42c" FOREIGN KEY ("targetOrgId") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation" DROP CONSTRAINT "FK_5df23b7999dd0ccaedd210bf42c"`);
        await queryRunner.query(`ALTER TABLE "invitation" DROP CONSTRAINT "FK_a421da13b2fe31ed22805caa283"`);
        await queryRunner.query(`DROP TABLE "invitation"`);
    }

}
