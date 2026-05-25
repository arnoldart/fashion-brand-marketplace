import { ApiProperty } from '@nestjs/swagger';

export class HealthCheckDto {
  @ApiProperty({
    description: 'The status of the backend application',
    example: 'ok',
  })
  status: string;

  @ApiProperty({
    description: 'The current ISO timestamp of the server',
    example: '2026-05-25T16:17:27.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'The application uptime in seconds',
    example: 120.45,
  })
  uptime: number;
}
