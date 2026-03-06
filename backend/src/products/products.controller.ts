import {
    Controller, Get, Post, Put, Patch, Param, Body,
    UseGuards, Query, ParseUUIDPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
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
    @Roles(UserRole.ADMIN)
    create(@Body() dto: CreateProductDto) {
        return this.service.create(dto);
    }

    @Put(':id')
    @Roles(UserRole.ADMIN)
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProductDto) {
        return this.service.update(id, dto);
    }

    @Patch(':id/archive')
    @Roles(UserRole.ADMIN)
    archive(@Param('id', ParseUUIDPipe) id: string) {
        return this.service.archive(id);
    }
}
