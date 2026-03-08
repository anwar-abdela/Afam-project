import {
    Controller, Get, Post, Put, Patch, Param, Body,
    UseGuards, Query, ParseUUIDPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../users/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
    constructor(private service: ProductsService) { }

    @Get()
    findAll(@Query('archived') archived?: string) {
        return this.service.findAll(archived === 'true');
    }

    @Get('low-stock')
    getLowStock(@Query('threshold') threshold?: string) {
        return this.service.getLowStock(threshold ? +threshold : 5);
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.service.findOne(id);
    }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.MEMBER)
    create(@Body() dto: CreateProductDto, @CurrentUser() user: any) {
        return this.service.create(dto, user);
    }

    @Put(':id')
    @Roles(UserRole.ADMIN, UserRole.MEMBER)
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProductDto, @CurrentUser() user: any) {
        return this.service.update(id, dto, user);
    }

    @Patch(':id/archive')
    @Roles(UserRole.ADMIN, UserRole.MEMBER)
    archive(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
        return this.service.archive(id, user);
    }
}
