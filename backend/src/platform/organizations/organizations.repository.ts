import { Injectable } from '@nestjs/common';
import { Organization } from './entities';
import { BaseRepository } from '@common/base/base.repository';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizationRepository extends BaseRepository<Organization> {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {
    super(organizationRepository);
  }
}
