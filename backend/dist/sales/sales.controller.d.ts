import { SalesService } from './sales.service';
import { CreateSaleDto } from './sale.dto';
export declare class SalesController {
    private service;
    constructor(service: SalesService);
    create(dto: CreateSaleDto, user: any): Promise<import("./sale.entity").Sale>;
    findAll(from?: string, to?: string): Promise<import("./sale.entity").Sale[]>;
    getSummary(): Promise<{
        totalRevenue: number;
        totalProfit: number;
        totalCost: number;
        totalSales: number;
    }>;
    getHistorySummary(): Promise<{
        today: {
            revenue: number;
            profit: number;
            count: number;
        };
        overall: {
            revenue: number;
            profit: number;
        };
    }>;
}
