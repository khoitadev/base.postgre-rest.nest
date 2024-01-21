import { Body, Controller, Post, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '~/auth/auth.service';
import { Public } from '~/auth/decorators/public.decorator';
import {
  LoginDto,
  LoginSocialDto,
  RefreshTokenDto,
  RegisterDto,
  ResetPasswordDto,
} from '~/dto';
import { ReqRegister } from '~/interface';
import { UserService } from '~/user/user.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.forgotPassword(resetPasswordDto);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.userService.resetPassword(resetPasswordDto);
  }

  @Public()
  @Post('register')
  async register(
    @Request() req: ReqRegister,
    @Body() registerDto: RegisterDto,
  ) {
    return await this.authService.register(req, registerDto);
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Public()
  @Post('login-google')
  async loginGoogle(
    @Request() req: ReqRegister,
    @Body() loginSocialDto: LoginSocialDto,
  ) {
    return await this.authService.loginGoogle(req, loginSocialDto.accessToken);
  }

  @Public()
  @Post('login-facebook')
  async loginFaceBook(
    @Request() req: ReqRegister,
    @Body() loginSocialDto: LoginSocialDto,
  ) {
    return await this.authService.loginFacebook(
      req,
      loginSocialDto.accessToken,
    );
  }

  @Public()
  @Post('admin-login')
  async adminLogin(@Body() loginDto: LoginDto) {
    return await this.authService.adminLogin(loginDto);
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}
