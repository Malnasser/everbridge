import { BaseEntity } from '@common/database/base.entity';
import { User } from 'platform/users';
import { Column, Entity, OneToMany } from 'typeorm';

export enum OrgType {
  PLATFORM = 'PLATFORM',
  SUPPLIER = 'SUPPLIER',
  DEBTOR = 'DEBTOR',
  LENDER = 'LENDER',
}

@Entity('organizations')
export class Organization extends BaseEntity {
  @Column() name: string;

  @Column({ enum: OrgType, default: OrgType.SUPPLIER })
  type: OrgType;

  @OneToMany(() => User, (u) => u.organization)
  users: User[];
}
