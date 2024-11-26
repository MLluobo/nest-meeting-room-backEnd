/**
 * 接口记录，访问的ip、user agent、请求的controller、method、接口耗时、响应部署、当前登录用户信息
 * user agent：http请求客户端软件的标识，通常包括浏览器类型、版本、操作系统等信息，服务端可以解析了解客户端环境
 *  从而提供优化的用户体验或适配不同环境
 */

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class InvokeRecordInterceptor implements NestInterceptor {
  private readonly logger = new Logger(InvokeRecordInterceptor.name);
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const userAgent = request.headers['user-agent'];

    const { ip, method, path } = request;

    this.logger.debug(
      `${method} ${path} ${ip} ${userAgent}: ${context.getClass().name} ${context.getHandler().name} invoked...`,
    );

    this.logger.debug(
      `user: ${request.user?.userId}, ${request.user?.username}`,
    );

    const now = Date.now();
    return next.handle().pipe(
      tap((res) => {
        this.logger.debug(
          `${method} ${path} ${ip} ${userAgent}: ${response.statusCode}: ${Date.now() - now}ms`,
        );
        this.logger.debug(`Response: ${JSON.stringify(res)}`);
      }),
    );
  }
}
