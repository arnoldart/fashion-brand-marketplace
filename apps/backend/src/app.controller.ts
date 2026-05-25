import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get greeting message' })
  @ApiResponse({
    status: 200,
    description: 'The greeting message has been successfully retrieved.',
    type: String,
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-auth')
  @Throttle({
    default: {
      limit: Number(process.env.THROTTLE_LIMIT_AUTH) || 5,
      ttl: Number(process.env.THROTTLE_TTL_AUTH) || 60000,
    },
  })
  @ApiOperation({ summary: 'Test endpoint with strict auth rate limits (5 req/min)' })
  @ApiResponse({
    status: 200,
    description: 'Successful response if under rate limit.',
    type: String,
  })
  getTestAuth(): string {
    return 'Authorized request successful!';
  }
}

