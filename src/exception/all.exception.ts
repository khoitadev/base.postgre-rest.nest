import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { logEvent } from '~/helper/log.helper';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown | any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const { name, message, response } = exception;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.BAD_REQUEST;
    const { url, method, rawHeaders }: any = request;
    const data = method === 'GET' ? request.query : request.body;
    const token = rawHeaders?.find((item: string) => item.startsWith('Bearer'));
    const messageResponse = response?.message ?? message;
    const contentLog = `URL : ${url}\nMETHOD: ${method}\nDATA: ${JSON.stringify(
      data,
    )}\nTOKEN: ${token}\nMESSAGE: ${messageResponse}\nCODE: ${httpStatus}\n======================== END LOG =========================`;
    logEvent(contentLog);

    const responseBody = {
      name,
      message: messageResponse,
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
