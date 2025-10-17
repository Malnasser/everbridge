import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@platform/users';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto';
import { Organization } from '@platform/organizations';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto, org?: Organization) {
    const user = await this.usersService.createUser({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: dto.password,
      organization: org,
    });

    const payload = { sub: user.id, email: user.email, organization: org };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        organization: org,
      },
    };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findUserByEmail({ email });
    if (user && (await bcrypt.compare(pass, user.hashed_password))) {
      const { hashed_password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      orgId: user.organization?.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email, firstName: user.firstName },
    };
  }
}
