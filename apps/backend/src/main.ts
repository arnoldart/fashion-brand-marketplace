import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set prefix global untuk semua API route
  app.setGlobalPrefix('api');

  // Mengaktifkan CORS (Cross-Origin Resource Sharing)
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Konfigurasi pipa validasi data global
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Konfigurasi Swagger API Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Fashion Brand Marketplace API')
    .setDescription('Dokumentasi lengkap REST API backend untuk marketplace fashion monorepo.')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Masukkan token JWT Anda',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
