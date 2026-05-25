import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLoggerService implements LoggerService {
  constructor(private readonly logger: PinoLogger) {}

  setContext(context: string) {
    this.logger.setContext(context);
  }

  log(message: any, ...optionalParams: any[]) {
    if (typeof message === 'object') {
      this.logger.info(message, ...optionalParams);
    } else {
      const context = optionalParams.length > 0 ? optionalParams[optionalParams.length - 1] : undefined;
      const params = optionalParams.slice(0, -1);
      this.logger.info(
        typeof context === 'string' ? { context, ...params } : { ...optionalParams },
        message,
      );
    }
  }

  error(message: any, ...optionalParams: any[]) {
    let stack: string | undefined;
    let context: string | undefined;

    if (optionalParams.length > 0) {
      stack = optionalParams[0];
      if (optionalParams.length > 1) {
        context = optionalParams[1];
      }
    }

    if (message instanceof Error) {
      this.logger.error({ err: message, context }, message.message);
    } else if (stack) {
      const errorObj = new Error(message);
      errorObj.stack = stack;
      this.logger.error({ err: errorObj, context }, message);
    } else {
      this.logger.error(context ? { context } : {}, message);
    }
  }

  warn(message: any, ...optionalParams: any[]) {
    if (typeof message === 'object') {
      this.logger.warn(message, ...optionalParams);
    } else {
      const context = optionalParams.length > 0 ? optionalParams[optionalParams.length - 1] : undefined;
      const params = optionalParams.slice(0, -1);
      this.logger.warn(
        typeof context === 'string' ? { context, ...params } : { ...optionalParams },
        message,
      );
    }
  }

  debug(message: any, ...optionalParams: any[]) {
    if (typeof message === 'object') {
      this.logger.debug(message, ...optionalParams);
    } else {
      const context = optionalParams.length > 0 ? optionalParams[optionalParams.length - 1] : undefined;
      const params = optionalParams.slice(0, -1);
      this.logger.debug(
        typeof context === 'string' ? { context, ...params } : { ...optionalParams },
        message,
      );
    }
  }

  verbose(message: any, ...optionalParams: any[]) {
    if (typeof message === 'object') {
      this.logger.trace(message, ...optionalParams);
    } else {
      const context = optionalParams.length > 0 ? optionalParams[optionalParams.length - 1] : undefined;
      const params = optionalParams.slice(0, -1);
      this.logger.trace(
        typeof context === 'string' ? { context, ...params } : { ...optionalParams },
        message,
      );
    }
  }
}
