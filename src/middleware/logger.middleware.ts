import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request | any, res: Response, next: NextFunction) {
    console.log('Request...');
    // req.userName = 'khoitadev';
    // console.log('================>>>: req = ', req);
    next();
  }
}
