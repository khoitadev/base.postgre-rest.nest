import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsUrl,
  IsPhoneNumber,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(10)
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsOptional()
  @IsUrl()
  readonly avatar?: string;

  @IsOptional()
  @IsPhoneNumber()
  readonly phone?: string;

  @IsString()
  @IsNotEmpty()
  readonly language?: string;

  @IsString()
  @IsNotEmpty()
  readonly typeLogin?: string;

  @IsString()
  @IsNotEmpty()
  readonly uid?: string;

  @IsString()
  @IsNotEmpty()
  readonly status?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  readonly countryCode?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  readonly ip?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(10)
  readonly name: string;

  @IsOptional()
  @IsUrl()
  readonly avatar?: string;

  @IsOptional()
  @IsPhoneNumber()
  readonly phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  readonly language: string;
}

export class ResetPasswordDto {
  @IsString()
  @MinLength(6)
  readonly password: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly code: string;
}

export class UpdatePasswordDto {
  @IsString()
  @MinLength(6)
  readonly oldPassword: string;

  @IsString()
  @MinLength(6)
  readonly newPassword: string;
}

export class VerifyEmailDto {
  @IsString()
  @MinLength(6)
  readonly code: string;
}
