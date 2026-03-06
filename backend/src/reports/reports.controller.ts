import { Controller, Get, Query, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
    constructor(private service: ReportsService) { }

    @Get('sales/daily')
    daily(@Query('date') date?: string) {
        return this.service.getSalesReport('daily', date);
    }

    @Get('sales/weekly')
    weekly(@Query('date') date?: string) {
        return this.service.getSalesReport('weekly', date);
    }

    @Get('sales/monthly')
    monthly(@Query('date') date?: string) {
        return this.service.getSalesReport('monthly', date);
    }

    @Get('savings/member/:id')
    memberSavings(@Param('id', ParseUUIDPipe) id: string) {
        return this.service.getMemberSavingsReport(id);
    }

    @Get('stock/potential-profit')
    potentialProfit() {
        return this.service.getPotentialProfit();
    }
}
