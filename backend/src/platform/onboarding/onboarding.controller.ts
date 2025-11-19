import {
  Controller,
  Post,
  Inject,
  HttpStatus,
  HttpException,
  Body,
} from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { BaseController } from '@common/base';
import { OnboardingApplication, OnboardingType } from './entities';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ResponseDto } from '@common/base/dto/response.dto';
import { InitOnboardingResponseDto } from './dto/init-onboarding.res.dto';
import { InitOnboardingReqDto } from './dto/init-onboarding.req.dto';
import { User } from '@platform/users';
import { Swag } from '@common/decorators/generic-swag.decorator';
import { OrgJwtGuard } from '@core/auth/guards';

@Controller('onboarding')
export class OnboardingController extends BaseController<OnboardingApplication> {
  constructor(
    @Inject(OnboardingService)
    private readonly onboardingService: OnboardingService,
  ) {
    super(onboardingService);
  }

  @Post('/init')
  @Swag({
    tag: 'Onboarding',
    summary: 'Initialize a new onboarding application',
    notes: [
      'This endpoint will init onboarding session for users without an org.',
      'If user have an existing onboarding application, the endpoint will return the existing application.',
    ],
    ok: { type: ResponseDto<InitOnboardingResponseDto> },
    guards: [OrgJwtGuard],
    bearer: true,
    orgHeader: false,
  })
  async initOnboarding(
    @CurrentUser() currentUser: User,
    @Body() body: InitOnboardingReqDto,
  ): Promise<ResponseDto<InitOnboardingResponseDto>> {
    const createdApplication =
      await this.onboardingService.createdOnboardingApplication({
        onboardingType: OnboardingType.SME_ONBOARDING,
        initiator: currentUser,
        registrationNumber: body.registrationNumber,
        organizationName: body.organizationName,
      });

    if (createdApplication instanceof Error) {
      throw new HttpException(
        {
          message: createdApplication.message,
          data: null,
          error: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      message: 'Onboarding application created successfully.',
      data: {
        onboardingType: createdApplication.onboardingType,
        state: createdApplication.state,
        schema: createdApplication.schema,
        data: createdApplication.data,
        registrationNumber: createdApplication.registrationNumber,
        organizationName: createdApplication.organizationName,
      },
      error: null,
    };
  }
}
