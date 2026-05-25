import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Fashion Brand Marketplace API')
    .setDescription(
      'Fashion Brand Marketplace is an e-commerce platform for fashion brands and consumers',
    )
    .setVersion('1.0')
    .addTag('fashion-brand-marketplace')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  console.log('Server is running on port ' + (process.env.PORT ?? 4000));
  console.log('Swagger UI is available at /api');
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();

