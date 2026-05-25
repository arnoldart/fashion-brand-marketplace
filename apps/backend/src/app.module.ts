import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './common/logger/logger.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [LoggerModule, HealthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

