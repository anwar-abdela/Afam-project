import {
    Controller, Get, Post, Body, Param, ParseUUIDPipe,
    UseGuards, Query,
} from '@nestjs/common';
import { SavingsService } from './savings.service';
import { CreateContributionDto, CreateMemberDto } from './savings.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Savings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('savings')
export class SavingsController {
    constructor(private service: SavingsService) { }

    @Get('members')
    getMembers() {
        return this.service.getMembers();
    }

    @Post('members')
    @Roles(UserRole.ADMIN)
    createMember(@Body() dto: CreateMemberDto) {
        return this.service.createMember(dto);
    }

    @Post('contributions')
    @Roles(UserRole.ADMIN, UserRole.MEMBER)
    addContribution(@Body() dto: CreateContributionDto) {
        return this.service.addContribution(dto);
    }

    @Get('report/group')
    getGroupReport(
        @Query('year') year?: string,
        @Query('month') month?: string,
    ) {
        return this.service.getGroupReport(
            year ? +year : undefined,
            month ? +month : undefined,
        );
    }

    @Get('report/monthly')
    getMonthlyTotals() {
        return this.service.getMonthlyTotals();
    }

    @Get('report/member/:id')
    getMemberReport(@Param('id', ParseUUIDPipe) id: string) {
        return this.service.getMemberReport(id);
    }
}
