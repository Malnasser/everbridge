import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@platform/users';
import * as bcrypt from 'bcrypt';
import { LoginResponseDto, RegisterDto } from './dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<LoginResponseDto | Error> {
    const userExists = await this.usersService.findUserByEmail({
      email: dto.email,
    });
    if (userExists) {
      return new Error('Cannot register with provided credentials');
    }

    const user = await this.usersService.createUser({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: dto.password,
    });

    const payload = { sub: user.id, email: user.email };
    const { access_token, refresh_token } = await this.getTokens(payload);

    return {
      access_token: access_token,
      refresh_token: refresh_token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isEmailVerified: user.emailVerified,
        isActive: user.isActive,
        organizationId: user.organizationId,
      },
    };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByEmail({ email });
    if (user && (await bcrypt.compare(pass, user.hashed_password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { hashed_password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const { access_token, refresh_token } = await this.getTokens(user);
    await this.usersService.update(user.id, {
      hashed_refresh_token: await bcrypt.hash(refresh_token, 10),
    });
    return {
      access_token,
      refresh_token,
      user: { id: user.id, email: user.email, firstName: user.firstName },
    };
  }

  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.usersService.findUserById(userId);
    if (!user) throw new NotFoundException('User not found');

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.hashed_refresh_token,
    );

    if (!isRefreshTokenMatching)
      throw new UnauthorizedException('Invalid refresh token');

    const { access_token, refresh_token: new_refresh_token } =
      await this.getTokens(user);
    await this.usersService.update(user.id, {
      hashed_refresh_token: await bcrypt.hash(new_refresh_token, 10),
    });

    return {
      access_token,
      refresh_token: new_refresh_token,
    };
  }

  async logout(userId: string) {
    return this.usersService.update(userId, { hashed_refresh_token: null });
  }

  async getTokens(payload) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('app.jwt.accessSecret'),
        expiresIn: this.configService.get<number>('app.jwt.accessExpiresIn'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('app.jwt.refreshSecret'),
        expiresIn: this.configService.get<number>('app.jwt.refreshExpiresIn'),
      }),
    ]);

    return { access_token, refresh_token };
  }
}
