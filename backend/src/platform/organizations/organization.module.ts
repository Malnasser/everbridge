import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities';
import { OrganizationService } from './organizations.service';
import { OrganizationRepository } from './organizations.repository';
import { organziationsController } from './organizations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Organization])],
  controllers: [organziationsController],
  providers: [OrganizationService, OrganizationRepository],
  exports: [OrganizationService],
})
export class OrganizationsModule {}
