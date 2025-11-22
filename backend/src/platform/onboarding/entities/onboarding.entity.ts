import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from '@common/database/base.entity';
import { User } from '@platform/users';
import { Upload } from '@core/uploader';

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
