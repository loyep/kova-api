import { Module } from '@nestjs/common';
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
