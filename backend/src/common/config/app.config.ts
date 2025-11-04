import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    accessExpiresIn: parseInt(process.env.JWT_ACCESS_EXPIRES_IN || '3600', 10), // ✅ number
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: parseInt(
      process.env.JWT_REFRESH_EXPIRES_IN || '604800',
      10,
    ),
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
  aws: {
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT || 'http://localhost:8000',
    forcePathStyle: process.env.AWS_FORCE_PATH_STYLE === 'true',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucketName: process.env.AWS_BUCKET_NAME,
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '1025', 10),
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM,
  },
}));
