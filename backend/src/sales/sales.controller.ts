import {
    Controller, Get, Post, Body, Query, UseGuards,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './sale.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole, User } from '../users/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Sales')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sales')
export class SalesController {
    constructor(private service: SalesService) { }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.MEMBER)
    create(@Body() dto: CreateSaleDto, @CurrentUser() user: any) {
        return this.service.create(dto, user.id);
    }

    @Get()
    findAll(@Query('from') from?: string, @Query('to') to?: string) {
        return this.service.findAll(from, to);
    }

    @Get('summary')
    getSummary() {
        return this.service.getSummary();
    }

    @Get('history-summary')
    getHistorySummary() {
        return this.service.getHistorySummary();
    }
}
