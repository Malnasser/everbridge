import { MigrationInterface, QueryRunner } from "typeorm";

export class InviteSetupExtra1760371413684 implements MigrationInterface {
    name = 'InviteSetupExtra1760371413684'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation" ALTER COLUMN "organizationName" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation" ALTER COLUMN "organizationName" SET NOT NULL`);
    }

}
