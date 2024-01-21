import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Public } from '~/auth/decorators/public.decorator';
import { Role } from '~/auth/decorators/role.decorator';
import { AuthGuard } from '~/auth/guard/auth.guard';
import { UpdatePasswordDto, UpdateUserDto, VerifyEmailDto } from '~/dto';
import { RoleAuth } from '~/enum';
import { ReqAuth } from '~/interface';
import { UserService } from '~/user/user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get('list')
  list(): Promise<User[]> {
    return this.userService.findAll({});
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  profile(@Request() req: ReqAuth) {
    this.userService.findOne({ id: req.userId });
  }

  @Get(':id')
  detail(@Param('id') id: number) {
    return this.userService.findOne({ id });
  }

  @UseGuards(AuthGuard)
  @Post('update-password')
  updatePassword(
    @Body()
    updatePasswordDto: UpdatePasswordDto,
    @Request() req: ReqAuth,
  ) {
    return this.userService.updatePassword(req.userId, updatePasswordDto);
  }

  @UseGuards(AuthGuard)
  @Post('mail-otp')
  sendMailOtp(@Request() req: ReqAuth) {
    return this.userService.sendMailOtp(req.userId);
  }

  @UseGuards(AuthGuard)
  @Post('verify-email')
  verifyEmail(@Request() req: ReqAuth, @Body() verifyEmailDto: VerifyEmailDto) {
    return this.userService.verifyEmail(req.userId, verifyEmailDto.code);
  }

  @Put(':id')
  async update(@Body() updateUserDto: UpdateUserDto, @Param('id') id: number) {
    return this.userService.update({ where: { id }, data: updateUserDto });
  }

  @UseGuards(AuthGuard)
  @Role(RoleAuth.Admin)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.userService.remove({ id });
  }
}
