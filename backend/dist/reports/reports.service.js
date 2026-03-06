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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sale_entity_1 = require("../sales/sale.entity");
const product_entity_1 = require("../products/product.entity");
const savings_contribution_entity_1 = require("../savings/savings-contribution.entity");
let ReportsService = class ReportsService {
    constructor(salesRepo, productsRepo, contribRepo) {
        this.salesRepo = salesRepo;
        this.productsRepo = productsRepo;
        this.contribRepo = contribRepo;
    }
    buildDateRange(period, refDate) {
        const ref = refDate ? new Date(refDate) : new Date();
        let from, to;
        if (period === 'daily') {
            from = new Date(ref.toDateString());
            to = new Date(from);
            to.setDate(to.getDate() + 1);
        }
        else if (period === 'weekly') {
            const day = ref.getDay();
            from = new Date(ref);
            from.setDate(ref.getDate() - day);
            from = new Date(from.toDateString());
            to = new Date(from);
            to.setDate(to.getDate() + 7);
        }
        else {
            from = new Date(ref.getFullYear(), ref.getMonth(), 1);
            to = new Date(ref.getFullYear(), ref.getMonth() + 1, 1);
        }
        return { from, to };
    }
    async getSalesReport(period, refDate) {
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
    async getMemberSavingsReport(memberId) {
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
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(sale_entity_1.Sale)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(2, (0, typeorm_1.InjectRepository)(savings_contribution_entity_1.SavingsContribution)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map