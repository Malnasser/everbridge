import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as passport from 'passport';
import { INestApplication } from '@nestjs/common';
import {
  Organization,
  OrganizationService,
  OrgType,
} from '@platform/organizations';
import { UsersService } from '@platform/users';
import * as cookieParser from 'cookie-parser';

async function seedPlatformData(app: INestApplication) {
  const orgSvc = app.get(OrganizationService);
  const userSvc = app.get(UsersService);

  const platformOrg = await orgSvc.findOne({ type: OrgType.PLATFORM });
  if (!platformOrg) {
    const newOrg = new Organization();
    newOrg.name = 'INTERNAL PLATFORM';
    newOrg.type = OrgType.PLATFORM;
    const org = await orgSvc.create(newOrg);

    await userSvc.createUser({
      firstName: 'root',
      lastName: 'root',
      email: 'root@root.com',
      password: 'password',
      organization: org,
    });
    console.log('✅ Platform org & root user created');
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  app.use(passport.initialize());
  const config = new DocumentBuilder()
    .setTitle('CMS Service')
    .setDescription('The CMS service API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.getHttpAdapter().get('/health', (_req, res) => {
    res.status(200).send('OK');
  });

  await seedPlatformData(app);

  await app.listen(3000);
}

bootstrap();
