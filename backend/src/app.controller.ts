import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class AppController {
  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'Start.gg Station Manager Backend',
      timestamp: new Date().toISOString(),
    };
  }
}
