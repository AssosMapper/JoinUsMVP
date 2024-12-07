import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import '@shared/validations/config';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /**
   * Enable CORS
   */
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.use(morgan(process.env.LOG_LEVEL));

  /**
   * The ValidationPipe is a built-in pipe that uses the class-validator library to perform validation on the incoming request payload.
   */
  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: false,
      whitelist: false,
      forbidNonWhitelisted: false,
    }),
  );

  /**
   * Using versioning
   */
  app.enableVersioning({
    type: VersioningType.URI,
  });

  /**
   * Documentation using Swagger
   */
  const options = new DocumentBuilder()
    .setTitle('Join Us API')
    .setDescription(
      "Api for Join Us, a platform for sharing association's events.",
    )
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}
bootstrap();
