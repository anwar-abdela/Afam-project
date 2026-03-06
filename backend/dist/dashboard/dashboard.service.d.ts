import { Repository } from 'typeorm';
import { Sale } from '../sales/sale.entity';
import { Product } from '../products/product.entity';
import { SavingsMember } from '../savings/savings-member.entity';
import { SavingsContribution } from '../savings/savings-contribution.entity';
export declare class DashboardService {
    private salesRepo;
    private productsRepo;
    private membersRepo;
    private contribRepo;
    constructor(salesRepo: Repository<Sale>, productsRepo: Repository<Product>, membersRepo: Repository<SavingsMember>, contribRepo: Repository<SavingsContribution>);
    getSummary(): Promise<{
        sales: {
            totalRevenue: number;
            totalCost: number;
            totalProfit: number;
            totalSalesCount: number;
        };
        today: {
            revenue: number;
            profit: number;
            count: number;
        };
        inventory: {
            totalProducts: number;
            soldOutProducts: number;
            potentialProfit: number;
        };
        savings: {
            totalSavings: number;
            totalMissed: number;
            activeMembers: number;
        };
    }>;
}
