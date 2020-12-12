import { forwardRef, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from '@/user';

@Module({
  imports: [UserModule],
  providers: [
    // {
    //   provide: APP_GUARD,
    //   useClass: AllowGuard,
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard('jwt'),
    // },
    // {
    //   provide: APP_GUARD,
    //   useClass: RoleGuard,
    // },
  ],
})
export class AuthModule {}
