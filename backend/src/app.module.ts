import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { SalesModule } from './sales/sales.module';
import { SavingsModule } from './savings/savings.module';
import { ReportsModule } from './reports/reports.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                url: config.get('DATABASE_URL'),
                host: config.get('DB_HOST'),
                port: +config.get<number>('DB_PORT'),
                username: config.get('DB_USERNAME'),
                password: config.get('DB_PASSWORD'),
                database: config.get('DB_NAME'),
                autoLoadEntities: true,
                synchronize: false,
                logging: config.get('NODE_ENV') === 'development',
                ssl: config.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        UsersModule,
        ProductsModule,
        SalesModule,
        SavingsModule,
        ReportsModule,
        DashboardModule,
        CategoriesModule,
    ],
})
export class AppModule { }
