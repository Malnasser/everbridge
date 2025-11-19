import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { User } from './entities';
import { BaseService } from '@common/base/base.service';
import { UserRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { Organization, OrganizationService, OrgType } from '../organizations';

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

  async findUserById(
    id: string,
    relations?: string[],
  ): Promise<User | undefined> {
    return this.userRepo.findById(id, undefined, relations);
  }

  async createUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    organization?: Organization;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = new User();
    newUser.firstName = data.firstName;
    newUser.lastName = data.lastName;
    newUser.email = data.email;
    newUser.hashed_password = hashedPassword;

    return super.create(newUser);
  }

  async deactivate(
    currentUser: User,
    userIdToDeactivate: string,
  ): Promise<User> {
    const userToDeactivate = await this.findUserById(userIdToDeactivate);

    if (!userToDeactivate) {
      throw new NotFoundException('User not found');
    }

    // A user can only deactivate another user in the same organization
    if (currentUser.organization.id !== userToDeactivate.organizationId) {
      // Platform admin can deactivate any user
      if (currentUser.organization.type !== OrgType.PLATFORM) {
        throw new ForbiddenException(
          'You are not allowed to deactivate this user',
        );
      }
    }

    return await this.update(userToDeactivate.id, {
      isActive: false,
    });
  }
}
