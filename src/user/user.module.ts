import { Global, Module } from '@nestjs/common';
import { EmailModule } from '~/email/email.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Global()
@Module({
  imports: [EmailModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
