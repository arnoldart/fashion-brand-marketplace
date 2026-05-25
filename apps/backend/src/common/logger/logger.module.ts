import { Module } from '@nestjs/common';
import { LoggerModule as NestjsPinoModule } from 'nestjs-pino';
import { CustomLoggerService } from './logger.service';
import { stdTimeFunctions, stdSerializers } from 'pino';

@Module({
  imports: [
    NestjsPinoModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
        timestamp: stdTimeFunctions.isoTime,
        serializers: {
          req: () => undefined,
          res: () => undefined,
          err: stdSerializers.err,
        },
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  colorize: true,
                  translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l o',
                },
              }
            : undefined,
        customSuccessMessage: (req, res, responseTime) => {
          return `${req.method} ${req.url} ${res.statusCode} - ${responseTime}ms`;
        },
        customErrorMessage: (req, res, err) => {
          return `${req.method} ${req.url} ${res.statusCode} - ${err.message}`;
        },
        customSuccessObject: (req, res, val: any) => {
          return {
            method: req.method,
            endpoint: req.url,
            statusCode: res.statusCode,
            responseTime: val.responseTime,
          };
        },
        customErrorObject: (req, res, err: any, val: any) => {
          return {
            method: req.method,
            endpoint: req.url,
            statusCode: res.statusCode,
            responseTime: val.responseTime,
            err,
          };
        },
      },
    }),
  ],
  providers: [CustomLoggerService],
  exports: [CustomLoggerService],
})
export class LoggerModule {}
