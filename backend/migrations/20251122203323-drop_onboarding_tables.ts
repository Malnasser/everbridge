import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropOnboardingTables20251122203323 implements MigrationInterface {
  name = 'DropOnboardingTables20251122203323';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints for onboarding_application_uploads if they exist
    await queryRunner.query(
      `ALTER TABLE "onboarding_application_uploads" DROP CONSTRAINT IF EXISTS "FK_26f455a9f5f19620ae952d56346"`,
    );
    await queryRunner.query(
      `ALTER TABLE "onboarding_application_uploads" DROP CONSTRAINT IF EXISTS "FK_bf6adc6a57ed1a6a757669f6b01"`,
    );
    // Drop the table onboarding_application_uploads if it exists
    await queryRunner.query(
      `DROP TABLE IF EXISTS "onboarding_application_uploads"`,
    );

    // Drop foreign key constraints for onboarding_applications_history if they exist
    await queryRunner.query(
      `ALTER TABLE "onboarding_applications_history" DROP CONSTRAINT IF EXISTS "FK_4c4ad6fc6da00e8e921134770b5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "onboarding_applications_history" DROP CONSTRAINT IF EXISTS "FK_5d68477b45c30fc6b6f7f76dbd8"`,
    );
    // Drop the table onboarding_applications_history if it exists
    await queryRunner.query(
      `DROP TABLE IF EXISTS "onboarding_applications_history"`,
    );
    // Drop the enum type if it exists
    await queryRunner.query(
      `DROP TYPE IF EXISTS "public"."onboarding_applications_history_action_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE public.onboarding_applications_history_action_enum AS ENUM('created', 'submitted', 'approved', 'rejected', 'returned', 'edited', 'assigned_admin')`,
    );
    await queryRunner.query(
      `CREATE TABLE onboarding_applications_history (id uuid NOT NULL DEFAULT uuid_generate_v4(), createdAt TIMESTAMP NOT NULL DEFAULT now(), updatedAt TIMESTAMP NOT NULL DEFAULT now(), createdBy character varying, updatedBy character varying, action public.onboarding_applications_history_action_enum NOT NULL, previousState character varying, newState character varying, metadata jsonb, applicationId uuid, performedBy uuid, CONSTRAINT PK_2181a46834787e5c581c220baf6 PRIMARY KEY (id))`,
    );
    await queryRunner.query(
      `CREATE TABLE onboarding_application_uploads (id uuid NOT NULL DEFAULT uuid_generate_v4(), createdAt TIMESTAMP NOT NULL DEFAULT now(), updatedAt TIMESTAMP NOT NULL DEFAULT now(), createdBy character varying, updatedBy character varying, fieldKey character varying NOT NULL, notes character varying, uploadId uuid, applicationId uuid, CONSTRAINT PK_dd057af17422ff6a3ed507c0ef3 PRIMARY KEY (id))`,
    );
    await queryRunner.query(
      `ALTER TABLE onboarding_applications_history ADD CONSTRAINT FK_5d68477b45c30fc6b6f7f76dbd8 FOREIGN KEY (applicationId) REFERENCES onboarding_applications(id) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE onboarding_applications_history ADD CONSTRAINT FK_4c4ad6fc6da00e8e921134770b5 FOREIGN KEY (performedBy) REFERENCES users(id) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE onboarding_application_uploads ADD CONSTRAINT FK_bf6adc6a57ed1a6a757669f6b01 FOREIGN KEY (uploadId) REFERENCES uploads(id) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE onboarding_application_uploads ADD CONSTRAINT FK_26f455a9f5f19620ae952d56346 FOREIGN KEY (applicationId) REFERENCES onboarding_applications(id) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
