import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from '../sales/sale.entity';
import { Product } from '../products/product.entity';
import { SavingsContribution } from '../savings/savings-contribution.entity';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Sale) private salesRepo: Repository<Sale>,
        @InjectRepository(Product) private productsRepo: Repository<Product>,
        @InjectRepository(SavingsContribution)
        private contribRepo: Repository<SavingsContribution>,
    ) { }

    private buildDateRange(period: 'daily' | 'weekly' | 'monthly', refDate?: string) {
        const ref = refDate ? new Date(refDate) : new Date();
        let from: Date, to: Date;

        if (period === 'daily') {
            from = new Date(ref.toDateString());
            to = new Date(from); to.setDate(to.getDate() + 1);
        } else if (period === 'weekly') {
            const day = ref.getDay();
            from = new Date(ref); from.setDate(ref.getDate() - day);
            from = new Date(from.toDateString());
            to = new Date(from); to.setDate(to.getDate() + 7);
        } else {
            from = new Date(ref.getFullYear(), ref.getMonth(), 1);
            to = new Date(ref.getFullYear(), ref.getMonth() + 1, 1);
        }
        return { from, to };
    }

    async getSalesReport(period: 'daily' | 'weekly' | 'monthly', refDate?: string) {
        const { from, to } = this.buildDateRange(period, refDate);

        const sales = await this.salesRepo
            .createQueryBuilder('s')
            .leftJoinAndSelect('s.product', 'p')
            .where('s.saleDate >= :from AND s.saleDate < :to', { from, to })
            .orderBy('s.saleDate', 'ASC')
            .getMany();

        const totalRevenue = sales.reduce((sum, s) => sum + Number(s.totalPrice), 0);
        const totalProfit = sales.reduce((sum, s) => sum + Number(s.profit), 0);
        const totalCost = totalRevenue - totalProfit;

        return { period, from, to, totalRevenue, totalCost, totalProfit, sales };
    }

    async getMemberSavingsReport(memberId: string) {
        return this.contribRepo
            .createQueryBuilder('c')
            .leftJoinAndSelect('c.member', 'm')
            .where('c.member_id = :memberId', { memberId })
            .orderBy('c.date', 'DESC')
            .getMany();
    }

    async getPotentialProfit() {
        const products = await this.productsRepo.find({
            where: { isArchived: false },
        });
        const potential = products.reduce((sum, p) => {
            return sum + (Number(p.sellingPrice) - Number(p.purchasePrice)) * p.quantity;
        }, 0);
        return { potentialProfit: potential };
    }

    async getSummary() {
        const [sales, products] = await Promise.all([
            this.salesRepo.find(),
            this.productsRepo.find({ where: { isArchived: false } }),
        ]);

        const totalRevenue = sales.reduce((sum, s) => sum + Number(s.totalPrice), 0);
        const totalProfit = sales.reduce((sum, s) => sum + Number(s.profit), 0);
        const lowStockCount = products.filter(p => p.quantity < 5).length;

        return {
            totalRevenue,
            totalProfit,
            totalProducts: products.length,
            lowStockCount,
        };
    }

    async getSalesTrend() {
        const sales = await this.salesRepo
            .createQueryBuilder('s')
            .select('DATE(s.saleDate)', 'date')
            .addSelect('SUM(s.total_price)', 'revenue')
            .groupBy('DATE(s.saleDate)')
            .orderBy('DATE(s.saleDate)', 'ASC')
            .limit(30)
            .getRawMany();

        return sales.map(s => ({
            date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            revenue: Number(s.revenue),
        }));
    }
}
