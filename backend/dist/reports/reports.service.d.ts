import { Repository } from 'typeorm';
import { Sale } from '../sales/sale.entity';
import { Product } from '../products/product.entity';
import { SavingsContribution } from '../savings/savings-contribution.entity';
export declare class ReportsService {
    private salesRepo;
    private productsRepo;
    private contribRepo;
    constructor(salesRepo: Repository<Sale>, productsRepo: Repository<Product>, contribRepo: Repository<SavingsContribution>);
    private buildDateRange;
    getSalesReport(period: 'daily' | 'weekly' | 'monthly', refDate?: string): Promise<{
        period: "daily" | "weekly" | "monthly";
        from: Date;
        to: Date;
        totalRevenue: number;
        totalCost: number;
        totalProfit: number;
        sales: Sale[];
    }>;
    getMemberSavingsReport(memberId: string): Promise<SavingsContribution[]>;
    getPotentialProfit(): Promise<{
        potentialProfit: number;
    }>;
    getSummary(): Promise<{
        totalRevenue: number;
        totalProfit: number;
        totalProducts: number;
        lowStockCount: number;
    }>;
    getSalesTrend(): Promise<{
        date: string;
        revenue: number;
    }[]>;
}
