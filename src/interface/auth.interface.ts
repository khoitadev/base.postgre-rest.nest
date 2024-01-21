import { Request } from 'express';

export interface ReqAuth extends Request {
  readonly user: DataAuth;
  readonly userId: number;
}

export interface DataAuth {
  readonly email: string;
  readonly id: number;
  readonly role?: string[];
  readonly iat: number;
  readonly exp: number;
}

export interface ReqRegister {
  readonly clientIp?: string;
  readonly clientCountry?: string;
}
