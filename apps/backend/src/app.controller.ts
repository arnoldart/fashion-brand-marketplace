import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Mendapatkan pesan sapaan sistem (hello world)' })
  @ApiResponse({
    status: 200,
    description: 'Sapaan berhasil dikembalikan.',
    type: String,
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
