import { forwardRef, HttpModule, Module, CacheModule } from '@nestjs/common';

@Module({
  imports: [
    HttpModule.register({ timeout: 5000 }),
    CacheModule.register({
      ttl: 60, // seconds
      max: 10, // maximum number of items in cache
    }),
  ],
})
export class ExternalModule { }
