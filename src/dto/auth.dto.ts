import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  IsJWT,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MinLength(6)
  readonly password: string;
}

export class RegisterDto {
  @IsString()
  @MinLength(10)
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MinLength(6)
  readonly password: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
}

export class LoginSocialDto {
  @IsString()
  @IsNotEmpty()
  readonly accessToken: string;
}

export class RefreshTokenDto {
  @IsJWT()
  readonly refreshToken: string;
}
