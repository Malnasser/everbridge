import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '@common/database/base.entity';
import { User } from '@platform/users';

export enum OnboardingType {
  SME_ONBOARDING = 'SME_ONBOARDING',
  BUYER_ONBOARDING = 'BUYER_ONBOARDING',
}

export enum OnboardingState {
  CREATED = 'CREATED',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  RETURNED = 'RETURNED',
}

@Entity('onboarding_applications')
export class OnboardingApplication extends BaseEntity {
  @Column({ type: 'enum', enum: OnboardingType })
  onboardingType: OnboardingType;

  @Column({ nullable: true })
  adminAssigned: string;

  @Column({
    type: 'enum',
    enum: OnboardingState,
    default: OnboardingState.CREATED,
  })
  @Index()
  state: OnboardingState.CREATED;

  @Column({ type: 'jsonb', nullable: false })
  schema: any;

  @Column({ type: 'jsonb', nullable: true, default: {} })
  data: any;

  @Column({ nullable: false })
  organizationName: string;

  @Column({ nullable: false })
  registrationNumber: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'approvedBy' })
  approvedBy: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner: User;
}

export enum ApplicationAction {
  CREATED = 'created',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  RETURNED = 'returned',
  EDITED = 'edited',
  ASSIGNED_ADMIN = 'assigned_admin',
}

@Entity('onboarding_applications_history')
export class OnboardingApplicationHistory extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OnboardingApplication, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'applicationId' })
  application: OnboardingApplication;

  @Column({ type: 'enum', enum: ApplicationAction })
  action: ApplicationAction;

  @Column({ type: 'varchar', nullable: true })
  previousState: string;

  @Column({ type: 'varchar', nullable: true })
  newState: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any; // comments, reasons, changed fields

  @ManyToOne(() => User)
  @JoinColumn({ name: 'performedBy' })
  performedBy: User;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
