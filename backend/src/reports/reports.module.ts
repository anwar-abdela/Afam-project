import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from '../sales/sale.entity';
import { Product } from '../products/product.entity';
import { SavingsContribution } from '../savings/savings-contribution.entity';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Sale, Product, SavingsContribution])],
    providers: [ReportsService],
    controllers: [ReportsController],
})
export class ReportsModule { }
