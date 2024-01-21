import { MailKeyword, Status, StatusGeneratorOtp, TypeOtp } from '~/enum';

export interface DataSendMail {
  email?: string;
  name?: string;
  amount?: string;
  otp?: string;
  keyword: MailKeyword;
  language: string;
  to: string;
}

export interface OptionSendMail {
  from: string;
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export interface MailContent {
  vi: OptionContent;
  en: OptionContent;
}

export interface OptionContent {
  subject: string;
  body: string;
}

export interface EmailTemplate {
  id: number;
  name: string;
  content: MailContent;
  keyword: MailKeyword;
  status: Status;
}

export interface Otp {
  id: number;
  type: TypeOtp;
  email: string;
  code: string;
}

export interface VerifyOtp {
  type: TypeOtp;
  email: string;
  code: string;
}

export interface DataGeneratorOtp {
  type: TypeOtp;
  email: string;
}

export interface OtpGenerator {
  status: StatusGeneratorOtp;
  otp: Otp;
}
