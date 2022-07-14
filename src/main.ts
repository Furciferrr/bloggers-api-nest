import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception.filter';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const errorsResponse = [];
        errors.forEach((error) => {
          const constrainsKeys = Object.keys(error.constraints);
          constrainsKeys.forEach((key) => {
            errorsResponse.push({
              message: error.constraints[key],
              field: error.property,
            });
          });
        });
        throw new BadRequestException(errorsResponse);
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(5001);
}
bootstrap();
