import { SavingsService } from './savings.service';
import { CreateContributionDto, CreateMemberDto } from './savings.dto';
export declare class SavingsController {
    private service;
    constructor(service: SavingsService);
    getMembers(): Promise<import("./savings-member.entity").SavingsMember[]>;
    createMember(dto: CreateMemberDto): Promise<import("./savings-member.entity").SavingsMember>;
    addContribution(dto: CreateContributionDto): Promise<import("./savings-contribution.entity").SavingsContribution>;
    getGroupReport(year?: string, month?: string): Promise<{
        members: any[];
        groupTotal: any;
    }>;
    getMonthlyTotals(): Promise<any[]>;
    getMemberReport(id: string): Promise<{
        member: import("./savings-member.entity").SavingsMember;
        totalSaved: number;
        missedCount: number;
        totalEntries: number;
        contributions: import("./savings-contribution.entity").SavingsContribution[];
    }>;
}
