import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Onboarding } from './entities/onboarding.entity';
import { BaseRepository } from '@common/base/base.repository';

@Injectable()
export class OnboardingRepository extends BaseRepository<Onboarding> {
  constructor(
    @InjectRepository(Onboarding)
    private readonly onboardingRepository: Repository<Onboarding>,
  ) {
    super(onboardingRepository);
  }
}
