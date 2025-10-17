import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InvitationsController } from './invitations.controller';
import { InvitationsService } from './invitations.service';
import { InvitationsRepository } from './invitations.repository';
import { Invitation } from './entities/Invitation.entity';
import { AuthModule } from '@core/auth';
import { NotificationModule } from '@core/notification/notification.module';
import { OrganizationsModule } from '@platform/organizations';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invitation]),
    AuthModule,
    NotificationModule,
    OrganizationsModule,
  ],
  controllers: [InvitationsController],
  providers: [InvitationsService, InvitationsRepository],
  exports: [InvitationsService],
})
export class InvitationsModule {}
