import { Injectable } from '@nestjs/common';
import { User } from './entities';
import { BaseService } from '@common/base/base.service';
import { UserRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { Organization, OrganizationService } from '../organizations';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    private userRepo: UserRepository,
    private organizationService: OrganizationService,
  ) {
    super(userRepo, User);
  }

  async findUserByEmail(data: { email: string }): Promise<User | undefined> {
    return this.userRepo.findByEmail(data.email);
  }

  async createUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    organization?: Organization;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const createdOrg = await this.organizationService.create(data.organization);

    const newUser = new User();
    newUser.firstName = data.firstName;
    newUser.lastName = data.lastName;
    newUser.email = data.email;
    newUser.hashed_password = hashedPassword;
    if (createdOrg) {
      newUser.organization = createdOrg;
    }

    return super.create(newUser);
  }
}
