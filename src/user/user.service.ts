import { PrismaService } from '$prisma';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { ResetPasswordDto, UpdatePasswordDto } from '~/dto';
import { EmailService } from '~/email/email.service';
import { MailKeyword, StatusGeneratorOtp, TypeOtp } from '~/enum';
import { encryptionPassword, validatePassword } from '~/helper/auth.helper';
import { OtpGenerator, UpdateInfoSocial } from '~/interface';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput | any,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  remove(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  async sendMailOtp(id: number): Promise<object> {
    const user: User = await this.findOne({ id });
    if (user.emailVerified)
      throw new HttpException('email-verified', HttpStatus.CONFLICT);

    const generator: OtpGenerator = await this.emailService.generatorOtp({
      email: user.email,
      type: TypeOtp.VerifyEmail,
    });

    if (generator.status === StatusGeneratorOtp.New) {
      this.emailService.sendMail({
        to: user.email,
        language: user.language,
        keyword: MailKeyword.Verify,
        name: user.name,
        otp: generator.otp.code,
      });
    }

    return { message: 'success', status: 200 };
  }

  async verifyEmail(id: number, code: string): Promise<User> {
    const user: User = await this.findOne({ id });
    const status: boolean = await this.emailService.verifyOtp({
      code,
      type: TypeOtp.VerifyEmail,
      email: user.email,
    });
    if (!status)
      throw new HttpException(
        'code-not-verify',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    return this.update({ where: { id }, data: { emailVerified: true } });
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<User> {
    const { password, code, email } = resetPasswordDto;
    const user: User = await this.findOne({ email });
    if (!user) throw new HttpException('user-not-found', HttpStatus.NOT_FOUND);

    const status: boolean = await this.emailService.verifyOtp({
      code,
      type: TypeOtp.ForgotPassword,
      email,
    });
    if (!status)
      throw new HttpException(
        'code-not-verify',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    const newPassword = encryptionPassword(password);

    return this.update({
      where: { email },
      data: {
        password: newPassword,
      },
    });
  }

  async updatePassword(
    id: number,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const { oldPassword, newPassword } = updatePasswordDto;
    if (oldPassword === newPassword)
      throw new HttpException('new-password-must-not-old-password', 422);

    const user: User = await this.findOne({ id });
    const validateOldPass = validatePassword(oldPassword, user.password);
    if (!validateOldPass)
      throw new HttpException(
        'old-password-is-incorrect',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    const newPasswordEncrypt = encryptionPassword(newPassword);

    return this.update({
      where: { id },
      data: {
        password: newPasswordEncrypt,
      },
    });
  }

  updateInfoSocial(
    id: number,
    updateInfoSocial: UpdateInfoSocial,
  ): Promise<User> {
    return this.update({
      where: { id },
      data: updateInfoSocial,
    });
  }
}
