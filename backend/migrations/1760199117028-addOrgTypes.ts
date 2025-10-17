import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOrgTypes1760199117028 implements MigrationInterface {
    name = 'AddOrgTypes1760199117028'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" ADD "type" character varying NOT NULL DEFAULT 'CUSTOMER'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "type"`);
    }

}
