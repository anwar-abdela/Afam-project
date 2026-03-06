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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sale_entity_1 = require("../sales/sale.entity");
const product_entity_1 = require("../products/product.entity");
const savings_member_entity_1 = require("../savings/savings-member.entity");
const savings_contribution_entity_1 = require("../savings/savings-contribution.entity");
let DashboardService = class DashboardService {
    constructor(salesRepo, productsRepo, membersRepo, contribRepo) {
        this.salesRepo = salesRepo;
        this.productsRepo = productsRepo;
        this.membersRepo = membersRepo;
        this.contribRepo = contribRepo;
    }
    async getSummary() {
        const salesData = await this.salesRepo
            .createQueryBuilder('s')
            .select('SUM(s.total_price)', 'totalRevenue')
            .addSelect('SUM(s.profit)', 'totalProfit')
            .addSelect('COUNT(s.id)', 'totalSales')
            .getRawOne();
        const totalRevenue = Number(salesData.totalRevenue) || 0;
        const totalProfit = Number(salesData.totalProfit) || 0;
        const products = await this.productsRepo.find({ where: { isArchived: false } });
        const totalProducts = products.length;
        const soldOutProducts = products.filter((p) => p.quantity === 0).length;
        const potentialProfit = products.reduce((sum, p) => sum + (Number(p.sellingPrice) - Number(p.purchasePrice)) * p.quantity, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const todaySales = await this.salesRepo
            .createQueryBuilder('s')
            .select('SUM(s.total_price)', 'revenue')
            .addSelect('SUM(s.profit)', 'profit')
            .addSelect('COUNT(s.id)', 'count')
            .where('s.saleDate >= :today AND s.saleDate < :tomorrow', { today, tomorrow })
            .getRawOne();
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
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sale_entity_1.Sale)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(savings_member_entity_1.SavingsMember)),
    __param(3, (0, typeorm_1.InjectRepository)(savings_contribution_entity_1.SavingsContribution)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map