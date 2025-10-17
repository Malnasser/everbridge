import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { UserRepository } from './users.repository';
import { OrganizationsModule } from '@platform/organizations';

@Module({
  imports: [TypeOrmModule.forFeature([User]), OrganizationsModule],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
