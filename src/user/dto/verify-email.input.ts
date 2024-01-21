import { IsString, MinLength } from 'class-validator';

export class VerifyEmailInput {
  @IsString()
  @MinLength(6)
  readonly code: string;
}
