import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SavingsMember } from './savings-member.entity';
import { SavingsContribution } from './savings-contribution.entity';
import { CreateContributionDto, CreateMemberDto } from './savings.dto';

@Injectable()
export class SavingsService {
    constructor(
        @InjectRepository(SavingsMember)
        private membersRepo: Repository<SavingsMember>,
        @InjectRepository(SavingsContribution)
        private contribRepo: Repository<SavingsContribution>,
    ) { }

    /* ── Members ── */
    getMembers() {
        return this.membersRepo.find({ where: { isActive: true } });
    }

    createMember(dto: CreateMemberDto) {
        const member = this.membersRepo.create(dto);
        return this.membersRepo.save(member);
    }

    /* ── Contributions ── */
    async addContribution(dto: CreateContributionDto) {
        const member = await this.membersRepo.findOne({
            where: { id: dto.memberId, isActive: true },
        });
        if (!member) throw new NotFoundException('Member not found');

        const contribution = this.contribRepo.create(dto);
        return this.contribRepo.save(contribution);
    }

    async getMemberReport(memberId: string) {
        const member = await this.membersRepo.findOne({ where: { id: memberId } });
        if (!member) throw new NotFoundException('Member not found');

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

    async getGroupReport(year?: number, month?: number) {
        const qb = this.contribRepo
            .createQueryBuilder('c')
            .leftJoinAndSelect('c.member', 'm')
            .orderBy('m.name', 'ASC')
            .addOrderBy('c.date', 'DESC');

        if (year) qb.andWhere('EXTRACT(YEAR  FROM c.date) = :year', { year });
        if (month) qb.andWhere('EXTRACT(MONTH FROM c.date) = :month', { month });

        const [contributions, allMembers] = await Promise.all([
            qb.getMany(),
            this.membersRepo.find({ where: { isActive: true } })
        ]);

        // Group by member
        const byMember: Record<string, any> = {};

        // Initialize with all active members
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
            // Ensure member exists in map (might be inactive now but had contributions)
            if (!byMember[mid]) {
                byMember[mid] = { member: c.member, total: 0, missed: 0, entries: [], totalEntries: 0 };
            }
            byMember[mid].total += Number(c.amount);
            if (c.isMissed) byMember[mid].missed += 1;
            byMember[mid].entries.push(c);
            byMember[mid].totalEntries += 1;
        }

        const groupTotal = Object.values(byMember).reduce(
            (sum: number, m: any) => sum + m.total, 0,
        );

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
}
