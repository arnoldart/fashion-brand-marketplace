import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';

// Variable global untuk melakukan caching instance server express/nestjs
let cachedServer: express.Express;

export const bootstrap = async (): Promise<express.Express> => {
  if (!cachedServer) {
    const expressApp = express();
    
    // Inisialisasi NestJS menggunakan adaptor Express
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp)
    );

    // Konfigurasi route prefix global
    nestApp.setGlobalPrefix('api');

    // CORS configuration
    nestApp.enableCors({
      origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    // Pipa validasi data global
    nestApp.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true })
    );

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

    const document = SwaggerModule.createDocument(nestApp, swaggerConfig);
    SwaggerModule.setup('docs', nestApp, document);

    // Jalankan inisialisasi aplikasi tanpa memanggil .listen()
    await nestApp.init();

    cachedServer = expressApp;
  }
  
  return cachedServer;
};

// Handler utama yang diekspor untuk dipanggil oleh runtime Vercel serverless
export default async (req: any, res: any) => {
  const server = await bootstrap();
  return server(req, res);
};
