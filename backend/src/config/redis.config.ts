import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  keyPrefix: 'pm:', // Project Management prefix
  ttl: {
    default: 300, // 5 minutes
    projects: 300,
    tasks: 300,
    comments: 300,
    rateLimit: 60,
  },
  maxMemory: '256mb',
  maxMemoryPolicy: 'allkeys-lru',
}));
