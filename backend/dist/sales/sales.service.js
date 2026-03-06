"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sale_entity_1 = require("./sale.entity");
const product_entity_1 = require("../products/product.entity");
let SalesService = class SalesService {
    constructor(salesRepo, productsRepo, dataSource) {
        this.salesRepo = salesRepo;
        this.productsRepo = productsRepo;
        this.dataSource = dataSource;
    }
    async create(dto) {
        return this.dataSource.transaction(async (manager) => {
            const product = await manager.findOne(product_entity_1.Product, {
                where: { id: dto.productId, isArchived: false },
                lock: { mode: 'pessimistic_write' },
            });
            if (!product)
                throw new common_1.NotFoundException('Product not found');
            if (product.quantity < dto.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock. Available: ${product.quantity}`);
            }
            const unitPrice = Number(product.sellingPrice);
            const totalPrice = unitPrice * dto.quantity;
            const profit = (Number(product.sellingPrice) - Number(product.purchasePrice)) * dto.quantity;
            product.quantity -= dto.quantity;
            await manager.save(product_entity_1.Product, product);
            const sale = manager.create(sale_entity_1.Sale, {
                productId: dto.productId,
                quantity: dto.quantity,
                unitPrice,
                totalPrice,
                profit,
            });
            return manager.save(sale_entity_1.Sale, sale);
        });
    }
    async findAll(from, to) {
        const qb = this.salesRepo
            .createQueryBuilder('s')
            .leftJoinAndSelect('s.product', 'p')
            .orderBy('s.saleDate', 'DESC');
        if (from)
            qb.andWhere('s.saleDate >= :from', { from });
        if (to)
            qb.andWhere('s.saleDate <= :to', { to });
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
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sale_entity_1.Sale)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], SalesService);
//# sourceMappingURL=sales.service.js.map