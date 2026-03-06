import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from '../sales/sale.entity';
import { Product } from '../products/product.entity';
import { SavingsMember } from '../savings/savings-member.entity';
import { SavingsContribution } from '../savings/savings-contribution.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Sale, Product, SavingsMember, SavingsContribution])],
    providers: [DashboardService],
    controllers: [DashboardController],
})
export class DashboardModule { }
