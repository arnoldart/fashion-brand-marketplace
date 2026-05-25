import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

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
}

