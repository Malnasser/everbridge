import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation } from './entities/Invitation.entity';
import { BaseRepository } from '@common/base';

@Injectable()
export class InvitationsRepository extends BaseRepository<Invitation> {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationsRepository: Repository<Invitation>,
  ) {
    super(invitationsRepository);
  }
}
