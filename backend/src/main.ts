import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  
  // Debug: Check if environment variables are loaded
  console.log('Environment variables check:');
  console.log('PORT:', configService.get('PORT'));
  console.log('CORS_ORIGIN:', configService.get('CORS_ORIGIN'));
  console.log('JWT_ACCESS_SECRET:', configService.get('JWT_ACCESS_SECRET') ? 'SET' : 'NOT SET');
  console.log('JWT_REFRESH_SECRET:', configService.get('JWT_REFRESH_SECRET') ? 'SET' : 'NOT SET');
  
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  
  app.use(cookieParser());
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useGlobalInterceptors(new ResponseInterceptor());
  
  const port = configService.get('PORT') || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
