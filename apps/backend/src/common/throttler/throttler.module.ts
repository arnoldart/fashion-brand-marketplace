import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: () => {
        const redisUrl = process.env.REDIS_URL;

        let storage;
        if (redisUrl) {
          storage = new ThrottlerStorageRedisService(
            new Redis(redisUrl, {
              maxRetriesPerRequest: null,
              enableReadyCheck: false,
            }),
          );
        }

        return {
          throttlers: [
            {
              name: 'default',
              ttl: Number(process.env.THROTTLE_TTL_DEFAULT) || 60000,
              limit: Number(process.env.THROTTLE_LIMIT_DEFAULT) || 100,
            },
          ],
          storage,
        };
      },
    }),
  ],
  exports: [ThrottlerModule],
})
export class CustomThrottlerModule { }
