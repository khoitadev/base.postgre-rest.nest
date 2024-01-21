import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUrl,
  IsOptional,
} from 'class-validator';

export class CreateLanguageDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly locale: string;

  @IsOptional()
  @IsUrl()
  readonly image?: string;

  @IsNumber()
  @IsOptional()
  readonly sort?: number;
}
