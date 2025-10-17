import { MigrationInterface, QueryRunner } from "typeorm";

export class InviteModification1760457064461 implements MigrationInterface {
    name = 'InviteModification1760457064461'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation" ADD "firstName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invitation" ADD "lastName" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invitation" ADD "organizationType" character varying NOT NULL DEFAULT 'SUPPLIER'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation" DROP COLUMN "organizationType"`);
        await queryRunner.query(`ALTER TABLE "invitation" DROP COLUMN "lastName"`);
        await queryRunner.query(`ALTER TABLE "invitation" DROP COLUMN "firstName"`);
    }

}
