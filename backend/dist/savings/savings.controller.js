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
exports.SavingsController = void 0;
const common_1 = require("@nestjs/common");
const savings_service_1 = require("./savings.service");
const savings_dto_1 = require("./savings.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const user_entity_1 = require("../users/user.entity");
const swagger_1 = require("@nestjs/swagger");
let SavingsController = class SavingsController {
    constructor(service) {
        this.service = service;
    }
    getMembers() {
        return this.service.getMembers();
    }
    createMember(dto) {
        return this.service.createMember(dto);
    }
    addContribution(dto) {
        return this.service.addContribution(dto);
    }
    getGroupReport(year, month) {
        return this.service.getGroupReport(year ? +year : undefined, month ? +month : undefined);
    }
    getMonthlyTotals() {
        return this.service.getMonthlyTotals();
    }
    getMemberReport(id) {
        return this.service.getMemberReport(id);
    }
};
exports.SavingsController = SavingsController;
__decorate([
    (0, common_1.Get)('members'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SavingsController.prototype, "getMembers", null);
__decorate([
    (0, common_1.Post)('members'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [savings_dto_1.CreateMemberDto]),
    __metadata("design:returntype", void 0)
], SavingsController.prototype, "createMember", null);
__decorate([
    (0, common_1.Post)('contributions'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MEMBER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [savings_dto_1.CreateContributionDto]),
    __metadata("design:returntype", void 0)
], SavingsController.prototype, "addContribution", null);
__decorate([
    (0, common_1.Get)('report/group'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SavingsController.prototype, "getGroupReport", null);
__decorate([
    (0, common_1.Get)('report/monthly'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SavingsController.prototype, "getMonthlyTotals", null);
__decorate([
    (0, common_1.Get)('report/member/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SavingsController.prototype, "getMemberReport", null);
exports.SavingsController = SavingsController = __decorate([
    (0, swagger_1.ApiTags)('Savings'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('savings'),
    __metadata("design:paramtypes", [savings_service_1.SavingsService])
], SavingsController);
//# sourceMappingURL=savings.controller.js.map