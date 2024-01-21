import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsNumber,
  IsObject,
} from 'class-validator';
import { MailKeyword } from '~/enum';

export class CreateEmailDto {
  @IsString()
  @MinLength(10)
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly keyword: string;

  @IsObject()
  @IsNotEmpty()
  readonly content: string;
}

export class UpdateEmailDto {
  @IsString()
  @MinLength(10)
  readonly name: string;

  @IsObject()
  readonly content: string;

  @IsNumber()
  @IsOptional()
  readonly code: number;
}

export class SendEmailDto {
  @IsString()
  readonly keyword: MailKeyword;

  @IsString()
  readonly language: string;

  @IsString()
  readonly to: string;
}
