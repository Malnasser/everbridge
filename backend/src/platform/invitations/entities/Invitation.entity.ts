import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '@platform/users';
import { BaseEntity } from '@common/database/base.entity';

@Entity('invitations')
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
}
