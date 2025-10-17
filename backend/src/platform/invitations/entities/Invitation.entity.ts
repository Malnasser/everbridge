import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Organization, OrgType } from 'platform/organizations';
import { User } from '@platform/users';
import { BaseEntity } from '@common/database/base.entity';

@Entity()
export class Invitation extends BaseEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  token: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'invitedByUserId' })
  invitedBy: User;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  acceptedAt: Date;

  @Column({ nullable: true })
  targetOrgId?: string;

  @Column({ nullable: true })
  organizationName: string;

  @Column({ enum: OrgType, default: OrgType.SUPPLIER })
  organizationType: OrgType;

  @ManyToOne(() => Organization, { nullable: true })
  @JoinColumn({ name: 'targetOrgId' })
  targetOrg?: Organization;
}
