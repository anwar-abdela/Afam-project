import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    // 6. ERROR HANDLING - Check for required environment variables
    if (!process.env.DATABASE_URL) {
        console.error('CRITICAL ERROR: DATABASE_URL environment variable is missing.');
    }
    if (!process.env.JWT_SECRET) {
        console.error('CRITICAL ERROR: JWT_SECRET environment variable is missing.');
    }

    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // 7. PRODUCTION SETTINGS - Enable CORS for frontend
    app.enableCors({
        origin: process.env.FRONTEND_URL || '*',
        credentials: true,
    });

    const config = new DocumentBuilder()
        .setTitle('A Fam API')
        .setDescription('API for A Fam shop management')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    // 1. PORT CONFIGURATION
    await app.listen(process.env.PORT || 3000);
    console.log(`Application running on port ${process.env.PORT || 3000}`);
}
bootstrap();
