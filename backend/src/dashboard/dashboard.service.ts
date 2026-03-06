import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from '../sales/sale.entity';
import { Product } from '../products/product.entity';
import { SavingsMember } from '../savings/savings-member.entity';
import { SavingsContribution } from '../savings/savings-contribution.entity';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Sale) private salesRepo: Repository<Sale>,
        @InjectRepository(Product) private productsRepo: Repository<Product>,
        @InjectRepository(SavingsMember) private membersRepo: Repository<SavingsMember>,
        @InjectRepository(SavingsContribution) private contribRepo: Repository<SavingsContribution>,
    ) { }

    async getSummary() {
        // Sales totals
        const salesData = await this.salesRepo
            .createQueryBuilder('s')
            .select('SUM(s.total_price)', 'totalRevenue')
            .addSelect('SUM(s.profit)', 'totalProfit')
            .addSelect('COUNT(s.id)', 'totalSales')
            .getRawOne();

        const totalRevenue = Number(salesData.totalRevenue) || 0;
        const totalProfit = Number(salesData.totalProfit) || 0;

        // Stock info
        const products = await this.productsRepo.find({ where: { isArchived: false } });
        const totalProducts = products.length;
        const soldOutProducts = products.filter((p) => p.quantity === 0).length;
        const potentialProfit = products.reduce(
            (sum, p) =>
                sum + (Number(p.sellingPrice) - Number(p.purchasePrice)) * p.quantity,
            0,
        );

        // Today's sales
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
        const todaySales = await this.salesRepo
            .createQueryBuilder('s')
            .select('SUM(s.total_price)', 'revenue')
            .addSelect('SUM(s.profit)', 'profit')
            .addSelect('COUNT(s.id)', 'count')
            .where('s.saleDate >= :today AND s.saleDate < :tomorrow', { today, tomorrow })
            .getRawOne();

        // Savings summary
        const savingsData = await this.contribRepo
            .createQueryBuilder('c')
            .select('SUM(c.amount)', 'totalSavings')
            .addSelect('COUNT(CASE WHEN c.is_missed = true THEN 1 END)', 'totalMissed')
            .getRawOne();

        const members = await this.membersRepo.find({ where: { isActive: true } });

        return {
            sales: {
                totalRevenue,
                totalCost: totalRevenue - totalProfit,
                totalProfit,
                totalSalesCount: Number(salesData.totalSales) || 0,
            },
            today: {
                revenue: Number(todaySales.revenue) || 0,
                profit: Number(todaySales.profit) || 0,
                count: Number(todaySales.count) || 0,
            },
            inventory: { totalProducts, soldOutProducts, potentialProfit },
            savings: {
                totalSavings: Number(savingsData.totalSavings) || 0,
                totalMissed: Number(savingsData.totalMissed) || 0,
                activeMembers: members.length,
            },
        };
    }
}
