import { MigrationInterface, QueryRunner } from "typeorm";

export class OrgTypes1760453360922 implements MigrationInterface {
    name = 'OrgTypes1760453360922'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" ALTER COLUMN "type" SET DEFAULT 'SUPPLIER'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" ALTER COLUMN "type" SET DEFAULT 'CUSTOMER'`);
    }

}
