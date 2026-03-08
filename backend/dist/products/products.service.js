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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./product.entity");
let ProductsService = class ProductsService {
    constructor(repo) {
        this.repo = repo;
    }
    async findAll(includeArchived = false) {
        return this.repo.find({
            where: includeArchived ? {} : { isArchived: false },
            order: { createdAt: 'DESC' },
            relations: ['category', 'owner']
        });
    }
    async findOne(id) {
        const product = await this.repo.findOne({ where: { id }, relations: ['category'] });
        if (!product)
            throw new common_1.NotFoundException(`Product ${id} not found`);
        return product;
    }
    async create(dto, owner) {
        const existing = await this.repo.findOne({ where: { sku: dto.sku } });
        if (existing)
            throw new common_1.BadRequestException('SKU already exists');
        let productData = { ...dto };
        if (dto.categoryId !== undefined) {
            productData.category = dto.categoryId ? { id: dto.categoryId } : null;
            delete productData.categoryId;
        }
        if (owner) {
            productData.owner = { id: owner.id };
        }
        const product = this.repo.create(productData);
        return this.repo.save(product);
    }
    async update(id, dto, currentUser) {
        const product = await this.repo.findOne({ where: { id }, relations: ['owner'] });
        if (!product)
            throw new common_1.NotFoundException(`Product ${id} not found`);
        const isAdmin = currentUser?.role === 'admin';
        const isOwner = product.owner?.id === currentUser?.id;
        if (!isAdmin && !isOwner) {
            throw new common_1.BadRequestException('Unauthorized: You do not own this product');
        }
        let updateData = { ...dto };
        if (dto.categoryId !== undefined) {
            updateData.category = dto.categoryId ? { id: dto.categoryId } : null;
            delete updateData.categoryId;
        }
        Object.assign(product, updateData);
        return this.repo.save(product);
    }
    async archive(id, currentUser) {
        const product = await this.repo.findOne({ where: { id }, relations: ['owner'] });
        if (!product)
            throw new common_1.NotFoundException(`Product ${id} not found`);
        const isAdmin = currentUser?.role === 'admin';
        const isOwner = product.owner?.id === currentUser?.id;
        if (!isAdmin && !isOwner) {
            throw new common_1.BadRequestException('Unauthorized: You do not own this product');
        }
        product.isArchived = true;
        return this.repo.save(product);
    }
    async getLowStock(threshold = 5) {
        return this.repo
            .createQueryBuilder('p')
            .where('p.quantity <= :threshold', { threshold })
            .andWhere('p.is_archived = false')
            .getMany();
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map