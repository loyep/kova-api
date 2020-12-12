import {
  DiskHealthIndicator,
  DNSHealthIndicator,
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { APIPrefix } from '@/constants/constants';
// import { User } from '@/model/user.entity';
import { Controller, Get, Res } from '@nestjs/common';
import { ErrorCode } from './constants/error';
import { MyHttpException } from './core/exception/my-http.exception';

@Controller()
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly dns: DNSHealthIndicator,
    private readonly db: TypeOrmHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  @Get(`${APIPrefix}/health/ready`)
  @HealthCheck()
  async readiness(@Res() res) {
    const { status, details, error } = await this.health.check([
      () => this.memory.checkHeap('memory_heap', 200 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 3000 * 1024 * 1024),
      () =>
        this.disk.checkStorage('storage', { thresholdPercent: 0.8, path: '/' }),
    ]);
    if (status === 'ok') {
      return res.json({
        code: ErrorCode.SUCCESS.CODE,
        data: details,
      });
    } else {
      throw new MyHttpException({
        code: ErrorCode.ERROR.CODE,
        message: JSON.stringify(error),
      });
    }
  }
}
