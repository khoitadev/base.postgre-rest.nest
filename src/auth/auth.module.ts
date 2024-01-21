import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminModule } from '~/admin/admin.module';
import { AuthController } from '~/auth/auth.controller';
import { AuthService } from '~/auth/auth.service';

@Global()
@Module({
  imports: [
    AdminModule,
    JwtModule.register({
      global: true,
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
