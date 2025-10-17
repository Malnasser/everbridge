import { Injectable } from '@nestjs/common';
import { Organization } from './entities';
import { OrganizationRepository } from './organizations.repository';
import { BaseService } from '@common/base';

@Injectable()
export class OrganizationService extends BaseService<Organization> {
  constructor(private organizationRepository: OrganizationRepository) {
    super(organizationRepository, Organization);
  }
}
