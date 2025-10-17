import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.req.dto';
import { LoginResponseDto } from './dto/login.res.dto';
import { Swag } from '@common/decorators/generic-swag.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.authService.login(user);
  }
}
