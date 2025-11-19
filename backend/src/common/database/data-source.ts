import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Organization, User } from 'platform';
import { Invitation } from '@platform/invitations/entities/Invitation.entity';
import {
  OnboardingApplication,
  OnboardingApplicationHistory,
} from '@platform/onboarding/entities';

config();

const requiredEnvVars = ['DB_HOST', 'DB_USERNAME', 'DB_PASSWORD', 'DB_NAME'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    Organization,
    User,
    Invitation,
    OnboardingApplication,
    OnboardingApplicationHistory,
  ],
  migrations: ['migrations/*.ts'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  extra: {
    connectionTimeoutMillis: 60000,
    query_timeout: 60000,
  },
});
