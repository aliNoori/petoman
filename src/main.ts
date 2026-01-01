import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {join} from "path";
import {NestExpressApplication} from "@nestjs/platform-express";
import {ValidationPipe, VersioningType} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

async function bootstrap() {

    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Swagger config
    const config = new DocumentBuilder()
        .setTitle('Petoman API')
        .setDescription('Petoman API list')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
        prefix: '/uploads/',
        setHeaders: (res,path) => {
            // اضافه کردن هدرهای لازم برای نمایش امن تصویر
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
            res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
            res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');

            // 👇 اصلاح MIME type برای ویدیو
            if (path.endsWith('.mp4')) {
                res.setHeader('Content-Type', 'video/mp4');
            }
            if (path.endsWith('.m3u8')) {
                res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
            }
            if (path.endsWith('.ts')) {
                res.setHeader('Content-Type', 'video/mp2t');
            }
        },
    });

    app.setGlobalPrefix('api', {});
    app.enableVersioning({type: VersioningType.URI});

    ///Set global validation
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));

    app.enableCors({
        origin: [
            'http://localhost:5174',
            'http://localhost:3002',
            'http://localhost:3005',
            'http://localhost:6501',
            'http://localhost:6505',
            'https://dash.petoman.com',
            'https://petoman.com'
        ],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true
    })

    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
