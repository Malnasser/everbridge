import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto, RefreshTokenDto } from './dto';
import { LoginResponseDto } from './dto/login.res.dto';
import { Swag } from '@common/decorators/generic-swag.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { User } from '@platform/users';
import { JwtRefreshGuard, OrgJwtGuard } from './guards';
import { ApiCookieAuth } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ResponseDto } from '@common/base/dto/response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Swag({
    summary: 'Log in a user',
    ok: {
      description: 'User logged in successfully.',
      type: LoginResponseDto,
    },
    responses: [{ status: 401, description: 'Invalid credentials.' }],
    orgHeader: false,
  })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ResponseDto<LoginResponseDto>> {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    console.log('User logged in:', user.email);

    const tokens = await this.authService.getTokens(user);
    const isProd = process.env.NODE_ENV === 'production';
    const tenMinutes = 10 * 60 * 1000;

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: this.configService.get('app.jwt.refreshExpiresIn') - tenMinutes,
    });

    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      path: '/',
      maxAge: this.configService.get('app.jwt.accessExpiresIn'),
    });

    return {
      message: 'User logged in successfully.',
      data: {
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailVerified: user.isEmailVerified,
          isActive: user.isActive,
          organizationId: user.organizationId,
        },
      },
      error: null,
    };
  }

  @ApiCookieAuth('refresh_token')
  @Swag({
    summary: 'Refresh User Access',
    ok: {
      description: 'Refreshed token successfully.',
      type: RefreshTokenDto,
    },
    guards: [JwtRefreshGuard],
    responses: [{ status: 401, description: 'Invalid credentials' }],
    orgHeader: false,
  })
  @Post('refresh')
  async refresh(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.getTokens(user);
    const isProd = process.env.NODE_ENV === 'production';
    const tenMinutes = 10 * 60 * 1000;

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: this.configService.get('app.jwt.refreshExpiresIn') - tenMinutes,
    });

    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      path: '/',
      maxAge: this.configService.get('app.jwt.accessExpiresIn') - tenMinutes,
    });

    return { message: 'Refreshed token successfully.' };
  }

  @Swag({
    summary: 'Log out a user',
    ok: {
      description: 'User logged out successfully.',
    },
    bearer: true,
    guards: [OrgJwtGuard],
    responses: [{ status: 401, description: 'Unauthorized.' }],
    orgHeader: false,
  })
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: User) {
    console.log(user);
    await this.authService.logout(user.id);
    return { message: 'successfully logout' };
  }
}
