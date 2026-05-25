import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerLimitDetail } from '@nestjs/throttler';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    if (typeof rawIp === 'string') {
      return rawIp.split(',')[0].trim();
    }
    return Array.isArray(rawIp) ? rawIp[0] : rawIp;
  }

  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    throw new HttpException(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil(throttlerLimitDetail.timeToExpire / 1000),
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
