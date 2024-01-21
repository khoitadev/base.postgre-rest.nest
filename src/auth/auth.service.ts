import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Admin, User } from '@prisma/client';
import { jwtDecode } from 'jwt-decode';
import { AdminService } from '~/admin/admin.service';
import { CreateUserDto, ForgotPasswordDto, LoginDto, RegisterDto } from '~/dto';
import { EmailService } from '~/email/email.service';
import { MailKeyword, StatusGeneratorOtp, TypeOtp } from '~/enum';
import { encryptionPassword, validatePassword } from '~/helper/auth.helper';
import { OtpGenerator, ReqRegister, UpdateInfoSocial } from '~/interface';
import Fetch from '~/plugin/fetch.plugin';
import { UserService } from '~/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  private getNameFromEmail(email: string) {
    return email.slice(0, email.lastIndexOf('@'));
  }

  private async generatorAccessToken(payload: object) {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_TOKEN,
      expiresIn: '60d',
    });
  }

  private async generatorRefreshToken(payload: object) {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_REFRESH_TOKEN,
      expiresIn: '360d',
    });
  }

  async transformUser(user: User): Promise<any> {
    const result: any = JSON.parse(JSON.stringify(user));
    delete result.password;
    const payload = { email: result.email, id: result._id };
    result.accessToken = await this.generatorAccessToken(payload);
    result.refreshToken = await this.generatorRefreshToken(payload);
    return result;
  }

  async transformAdmin(admin: Admin): Promise<any> {
    const result: any = JSON.parse(JSON.stringify(admin));
    delete result.password;
    const payload = { email: result.email, id: result._id, role: admin.role };
    result.accessToken = await this.generatorAccessToken(payload);
    return result;
  }

  async register(req: ReqRegister, dataRegister: RegisterDto): Promise<any> {
    const { name } = dataRegister;
    let { email, password } = dataRegister;
    email = email.trim().toLowerCase();

    const userExists = await this.userService.findOne({ email });
    if (userExists)
      throw new HttpException('email-is-exist', HttpStatus.CONFLICT);

    password = encryptionPassword(password);
    const userRegister: CreateUserDto = {
      email,
      name,
      password,
      countryCode: req.clientCountry,
      ip: req.clientIp,
    };

    const user = await this.userService.create(userRegister);
    return this.transformUser(user);
  }

  async login(dataLogin: LoginDto): Promise<any> {
    const { password } = dataLogin;
    let { email } = dataLogin;
    email = email.trim().toLowerCase();

    const user = await this.userService.findOne({ email });
    const passwordValid = validatePassword(password, user.password);
    if (!passwordValid || !user) {
      throw new UnauthorizedException();
    }
    return this.transformUser(user);
  }

  async adminLogin(dataLogin: LoginDto): Promise<any> {
    const { password } = dataLogin;
    let { email } = dataLogin;
    email = email.trim().toLowerCase();

    const admin: Admin = await this.adminService.findOne({ email });
    const passwordValid = validatePassword(password, admin.password);
    if (!passwordValid || !admin) {
      throw new UnauthorizedException();
    }
    return this.transformAdmin(admin);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    let { email } = forgotPasswordDto;
    email = email.trim().toLowerCase();

    const user = await this.userService.findOne({ email });
    if (!user) throw new HttpException('user-not-found', HttpStatus.NOT_FOUND);

    const generator: OtpGenerator = await this.emailService.generatorOtp({
      email: email.trim().toLowerCase(),
      type: TypeOtp.ForgotPassword,
    });

    if (generator.status === StatusGeneratorOtp.New) {
      this.emailService.sendMail({
        to: user.email,
        language: user.language,
        keyword: MailKeyword.ForgotPassword,
        name: user.name,
        otp: generator.otp.code,
      });
    }

    return user;
  }

  async loginGoogle(req: ReqRegister, accessToken: string): Promise<object> {
    const dataGoogle: any = {};
    // login google sdk
    const dataSdk: any = await Fetch.get({
      path: `https://www.googleapis.com/oauth2/v2/tokeninfo?access_token=${accessToken}`,
    });
    if (dataSdk && dataSdk.user_id) {
      dataGoogle.uid = dataSdk.user_id;
      dataGoogle.email = dataSdk.email;
      dataGoogle.name = dataSdk.name || this.getNameFromEmail(dataSdk.email);
      dataGoogle.emailVerified = dataSdk.verified_email || false;
      dataGoogle.avatar = dataSdk.picture || '';
    }
    // login google popup
    else {
      const dataPopup: any = jwtDecode(accessToken);
      if (!dataPopup.sub && !dataSdk.user_id)
        throw new HttpException(
          'google-login-failed',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );

      dataGoogle.uid = dataPopup.sub;
      dataGoogle.email = dataPopup.email;
      dataGoogle.name =
        dataPopup.name || this.getNameFromEmail(dataPopup.email);
      dataGoogle.emailVerified = dataPopup.email_verified || false;
      dataGoogle.avatar = dataPopup.picture || '';
    }

    let user: User = await this.userService.findOne({
      OR: [
        { email: dataGoogle.email },
        { uid: dataGoogle.uid, typeLogin: 'google' },
      ],
    });
    const firstLogin = !user;
    if (firstLogin) {
      const userData: CreateUserDto = {
        ...dataGoogle,
        typeLogin: 'google',
        password: encryptionPassword(dataGoogle.uid),
        countryCode: req.clientCountry,
        ip: req.clientIp,
        language: req.clientCountry === 'VN' ? 'vi' : 'en',
      };

      user = await this.userService.create(userData);
    } else {
      const dataUpdate: any = {};
      !user.uid && (dataUpdate.uid = dataGoogle.uid);
      user.typeLogin !== 'google' && (dataUpdate.typeLogin = 'google');
      if (!user.name && dataGoogle.name) dataUpdate.name = dataGoogle.name;
      user = await this.userService.updateInfoSocial(user.id, dataUpdate);
    }

    return this.transformUser(user);
  }

  async loginFacebook(req: ReqRegister, accessToken: string): Promise<object> {
    const dataFacebook = await Fetch.get({
      path: `https://graph.facebook.com/me?fields=email,name,picture&access_token=${accessToken}`,
    });
    if (!dataFacebook.id)
      throw new HttpException(
        'facebook-login-failed',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    let user: User = await this.userService.findOne({
      OR: [
        { email: dataFacebook.email },
        { uid: dataFacebook.id, typeLogin: 'facebook' },
      ],
    });
    const firstLogin = !user;
    if (firstLogin) {
      const userData: CreateUserDto = {
        email: dataFacebook.email || `${dataFacebook.id}@gmail.com`,
        name:
          dataFacebook.name ||
          this.getNameFromEmail(dataFacebook.email) ||
          dataFacebook.id,
        avatar: `https://graph.facebook.com/${dataFacebook.id}/picture?type=large&redirect=true&width=300&height=300`,
        typeLogin: 'facebook',
        uid: dataFacebook.id,
        password: encryptionPassword(dataFacebook.id),
        language: req.clientCountry === 'VN' ? 'vi' : 'en',
        countryCode: req.clientCountry,
        ip: req.clientIp,
      };

      user = await this.userService.create(userData);
    } else {
      const dataUpdate: UpdateInfoSocial = {};
      !user.uid && (dataUpdate.uid = dataFacebook.id);
      user.typeLogin !== 'facebook' && (dataUpdate.typeLogin = 'facebook');
      user = await this.userService.updateInfoSocial(user.id, dataUpdate);
    }

    return this.transformUser(user);
  }

  async refreshToken(token: string): Promise<object> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_REFRESH_TOKEN,
      });
      delete payload.iat;
      delete payload.exp;
      const newAccessToken = await this.generatorAccessToken(payload);
      const newRefreshToken = await this.generatorRefreshToken(payload);

      return { newAccessToken, newRefreshToken };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
