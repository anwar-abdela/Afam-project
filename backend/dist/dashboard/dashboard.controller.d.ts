import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private service;
    constructor(service: DashboardService);
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
