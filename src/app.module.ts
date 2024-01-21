import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AdminController } from '~/admin/admin.controller';
import { AdminModule } from '~/admin/admin.module';
import { AdminService } from '~/admin/admin.service';
import { AppService } from '~/app.service';
import { AuthController } from '~/auth/auth.controller';
import { AuthModule } from '~/auth/auth.module';
import { AuthService } from '~/auth/auth.service';
import { AuthGuard } from '~/auth/guard/auth.guard';
import { CommonModule } from '~/common/common.module';
import { EmailModule } from '~/email/email.module';
import { FileController } from '~/file/file.controller';
import { FileModule } from '~/file/file.module';
import { FileService } from '~/file/file.service';
import { LanguageController } from '~/language/language.controller';
import { LanguageModule } from '~/language/language.module';
import { LanguageService } from '~/language/language.service';
import { LoggerMiddleware } from '~/middleware/logger.middleware';
import { PrismaModule } from '~/prisma/prisma.module';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    LanguageModule,
    UserModule,
    AuthModule,
    FileModule,
    EmailModule,
    PrismaModule,
    CommonModule,
    AdminModule,
  ],
  controllers: [
    AuthController,
    AdminController,
    FileController,
    UserController,
    LanguageController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AppService,
    AuthService,
    AdminService,
    LanguageService,
    FileService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('language');
  }
}
