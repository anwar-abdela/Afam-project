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
exports.SavingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const savings_member_entity_1 = require("./savings-member.entity");
const savings_contribution_entity_1 = require("./savings-contribution.entity");
let SavingsService = class SavingsService {
    constructor(membersRepo, contribRepo) {
        this.membersRepo = membersRepo;
        this.contribRepo = contribRepo;
    }
    getMembers() {
        return this.membersRepo.find({ where: { isActive: true } });
    }
    createMember(dto) {
        const member = this.membersRepo.create(dto);
        return this.membersRepo.save(member);
    }
    async addContribution(dto) {
        const member = await this.membersRepo.findOne({
            where: { id: dto.memberId, isActive: true },
        });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        const contribution = this.contribRepo.create(dto);
        return this.contribRepo.save(contribution);
    }
    async getMemberReport(memberId) {
        const member = await this.membersRepo.findOne({ where: { id: memberId } });
        if (!member)
            throw new common_1.NotFoundException('Member not found');
        const summary = await this.contribRepo
            .createQueryBuilder('c')
            .select('SUM(c.amount)', 'totalSaved')
            .addSelect('COUNT(CASE WHEN c.is_missed = true THEN 1 END)', 'missedCount')
            .addSelect('COUNT(c.id)', 'totalEntries')
            .where('c.member_id = :memberId', { memberId })
            .getRawOne();
        const contributions = await this.contribRepo.find({
            where: { memberId },
            order: { date: 'DESC' },
        });
        return {
            member,
            totalSaved: Number(summary.totalSaved) || 0,
            missedCount: Number(summary.missedCount) || 0,
            totalEntries: Number(summary.totalEntries) || 0,
            contributions,
        };
    }
    async getGroupReport(year, month) {
        const qb = this.contribRepo
            .createQueryBuilder('c')
            .leftJoinAndSelect('c.member', 'm')
            .orderBy('m.name', 'ASC')
            .addOrderBy('c.date', 'DESC');
        if (year)
            qb.andWhere('EXTRACT(YEAR  FROM c.date) = :year', { year });
        if (month)
            qb.andWhere('EXTRACT(MONTH FROM c.date) = :month', { month });
        const [contributions, allMembers] = await Promise.all([
            qb.getMany(),
            this.membersRepo.find({ where: { isActive: true } })
        ]);
        const byMember = {};
        for (const m of allMembers) {
            byMember[m.id] = {
                member: m,
                total: 0,
                missed: 0,
                entries: [],
                totalEntries: 0
            };
        }
        for (const c of contributions) {
            const mid = c.memberId;
            if (!byMember[mid]) {
                byMember[mid] = { member: c.member, total: 0, missed: 0, entries: [], totalEntries: 0 };
            }
            byMember[mid].total += Number(c.amount);
            if (c.isMissed)
                byMember[mid].missed += 1;
            byMember[mid].entries.push(c);
            byMember[mid].totalEntries += 1;
        }
        const groupTotal = Object.values(byMember).reduce((sum, m) => sum + m.total, 0);
        return { members: Object.values(byMember), groupTotal };
    }
    async getMonthlyTotals() {
        return this.contribRepo
            .createQueryBuilder('c')
            .select("TO_CHAR(c.date, 'YYYY-MM')", 'month')
            .addSelect('SUM(c.amount)', 'total')
            .addSelect('COUNT(CASE WHEN c.is_missed = true THEN 1 END)', 'missed')
            .groupBy("TO_CHAR(c.date, 'YYYY-MM')")
            .orderBy("TO_CHAR(c.date, 'YYYY-MM')", 'DESC')
            .getRawMany();
    }
};
exports.SavingsService = SavingsService;
exports.SavingsService = SavingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(savings_member_entity_1.SavingsMember)),
    __param(1, (0, typeorm_1.InjectRepository)(savings_contribution_entity_1.SavingsContribution)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SavingsService);
//# sourceMappingURL=savings.service.js.map