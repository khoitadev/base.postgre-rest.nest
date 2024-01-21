import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class UpdateUserInput {
  readonly id: number;

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
