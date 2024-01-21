import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateUserInput {
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
