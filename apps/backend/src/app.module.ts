import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './common/logger/logger.module';
import { HealthModule } from './modules/health/health.module';
import { CustomThrottlerModule } from './common/throttler/throttler.module';
import { CustomThrottlerGuard } from './common/throttler/throttler.guard';

@Module({
  imports: [LoggerModule, CustomThrottlerModule, HealthModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule { }

