import { Injectable } from '@nestjs/common';
import { OnboardingRepository } from './onboarding.repository';

@Injectable()
export class OnboardingService {
  constructor(private readonly onboardingRepo: OnboardingRepository) {}
}
