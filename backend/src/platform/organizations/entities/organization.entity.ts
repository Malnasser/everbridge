import { BaseEntity } from '@common/database/base.entity';
import { User } from 'platform/users';
import { Column, Entity, OneToMany } from 'typeorm';

export enum OrgType {
  PLATFORM = 'PLATFORM',
  SUPPLIER = 'SUPPLIER', // Seller (Business / Supplier) // This is the company that issued the invoice
  DEBTOR = 'DEBTOR', // Buyer (Customer / Debtor) // This is the company that owes payment on the invoice
  LENDER = 'LENDER', // Financier (Lender / Factor / Investor) // pays the seller upfront for the invoice — usually 70–90% of its value.
}

export enum OnboardingStatus {
  INITITED = 'INITITED',
  COMPLETED = 'COMPLETED',
}

@Entity('organizations')
export class Organization extends BaseEntity {
  @Column() name: string;

  @Column({ enum: OrgType, default: OrgType.SUPPLIER })
  type: OrgType;

  @Column({ enum: OnboardingStatus, default: OnboardingStatus.INITITED })
  onboardingStatus: OnboardingStatus;

  @OneToMany(() => User, (u) => u.organization)
  users: User[];
}
