import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@common/base/base.repository';
import { OnboardingApplication } from './entities';

@Injectable()
export class OnboardingRepository extends BaseRepository<OnboardingApplication> {
  constructor(
    @InjectRepository(OnboardingApplication)
    private readonly onboardingRepository: Repository<OnboardingApplication>,
  ) {
    super(onboardingRepository);
  }
}
