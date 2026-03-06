import { Repository, DataSource } from 'typeorm';
import { Sale } from './sale.entity';
import { Product } from '../products/product.entity';
import { CreateSaleDto } from './sale.dto';
export declare class SalesService {
    private salesRepo;
    private productsRepo;
    private dataSource;
    constructor(salesRepo: Repository<Sale>, productsRepo: Repository<Product>, dataSource: DataSource);
    create(dto: CreateSaleDto): Promise<Sale>;
    findAll(from?: string, to?: string): Promise<Sale[]>;
    getSummary(): Promise<{
        totalRevenue: number;
        totalProfit: number;
        totalCost: number;
        totalSales: number;
    }>;
}
