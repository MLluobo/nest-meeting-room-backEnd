import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './format-response.interceptor';
import { InvokeRecordInterceptor } from './invoke-record.interceptor';
import { CustomExceptionFilter } from './custom-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局验证器启用
  app.useGlobalPipes(new ValidationPipe());

  // 全局拦截启用
  app.useGlobalInterceptors(new FormatResponseInterceptor());

  app.useGlobalInterceptors(new InvokeRecordInterceptor());

  app.useGlobalFilters(new CustomExceptionFilter());

  // env配置
  const configService = app.get(ConfigService);

  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
