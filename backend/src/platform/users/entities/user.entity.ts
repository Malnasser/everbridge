import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '@common/database/base.entity';
import { Organization } from 'platform/organizations';
import { OnboardingApplication } from '@platform/onboarding/entities';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  hashed_password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  organizationId: string; // FK column

  @ManyToOne(() => Organization)
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;

  @Column({ nullable: true })
  hashed_refresh_token: string;

  @OneToMany(() => OnboardingApplication, (onboarding) => onboarding.owner)
  onboardingApplications: OnboardingApplication[];
}
