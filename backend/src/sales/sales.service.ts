import {
    Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Sale } from './sale.entity';
import { Product } from '../products/product.entity';
import { CreateSaleDto } from './sale.dto';

@Injectable()
export class SalesService {
    constructor(
        @InjectRepository(Sale) private salesRepo: Repository<Sale>,
        @InjectRepository(Product) private productsRepo: Repository<Product>,
        private dataSource: DataSource,
    ) { }

    async create(dto: CreateSaleDto): Promise<Sale> {
        return this.dataSource.transaction(async (manager) => {
            // 1. Lock the product row for update
            const product = await manager.findOne(Product, {
                where: { id: dto.productId, isArchived: false },
                lock: { mode: 'pessimistic_write' },
            });
            if (!product) throw new NotFoundException('Product not found');

            // 2. Prevent sale if insufficient stock
            if (product.quantity < dto.quantity) {
                throw new BadRequestException(
                    `Insufficient stock. Available: ${product.quantity}`,
                );
            }

            // 3. Calculate financials
            const unitPrice = Number(product.sellingPrice);
            const totalPrice = unitPrice * dto.quantity;
            const profit =
                (Number(product.sellingPrice) - Number(product.purchasePrice)) * dto.quantity;

            // 4. Deduct inventory
            product.quantity -= dto.quantity;
            await manager.save(Product, product);

            // 5. Record sale
            const sale = manager.create(Sale, {
                productId: dto.productId,
                quantity: dto.quantity,
                unitPrice,
                totalPrice,
                profit,
            });
            return manager.save(Sale, sale);
        });
    }

    async findAll(from?: string, to?: string) {
        const qb = this.salesRepo
            .createQueryBuilder('s')
            .leftJoinAndSelect('s.product', 'p')
            .orderBy('s.saleDate', 'DESC');

        if (from) qb.andWhere('s.saleDate >= :from', { from });
        if (to) qb.andWhere('s.saleDate <= :to', { to });

        return qb.getMany();
    }

    async getSummary() {
        const result = await this.salesRepo
            .createQueryBuilder('s')
            .select('SUM(s.total_price)', 'totalRevenue')
            .addSelect('SUM(s.profit)', 'totalProfit')
            .addSelect('COUNT(s.id)', 'totalSales')
            .getRawOne();
        return {
            totalRevenue: Number(result.totalRevenue) || 0,
            totalProfit: Number(result.totalProfit) || 0,
            totalCost: (Number(result.totalRevenue) || 0) - (Number(result.totalProfit) || 0),
            totalSales: Number(result.totalSales) || 0,
        };
    }
}
