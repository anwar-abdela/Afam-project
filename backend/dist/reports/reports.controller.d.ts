import { ReportsService } from './reports.service';
export declare class ReportsController {
    private service;
    constructor(service: ReportsService);
    daily(date?: string): Promise<{
        period: "daily" | "weekly" | "monthly";
        from: Date;
        to: Date;
        totalRevenue: number;
        totalCost: number;
        totalProfit: number;
        sales: import("../sales/sale.entity").Sale[];
    }>;
    weekly(date?: string): Promise<{
        period: "daily" | "weekly" | "monthly";
        from: Date;
        to: Date;
        totalRevenue: number;
        totalCost: number;
        totalProfit: number;
        sales: import("../sales/sale.entity").Sale[];
    }>;
    monthly(date?: string): Promise<{
        period: "daily" | "weekly" | "monthly";
        from: Date;
        to: Date;
        totalRevenue: number;
        totalCost: number;
        totalProfit: number;
        sales: import("../sales/sale.entity").Sale[];
    }>;
    memberSavings(id: string): Promise<import("../savings/savings-contribution.entity").SavingsContribution[]>;
    potentialProfit(): Promise<{
        potentialProfit: number;
    }>;
}
