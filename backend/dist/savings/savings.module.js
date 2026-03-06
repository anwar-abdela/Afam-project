"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavingsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const savings_member_entity_1 = require("./savings-member.entity");
const savings_contribution_entity_1 = require("./savings-contribution.entity");
const savings_service_1 = require("./savings.service");
const savings_controller_1 = require("./savings.controller");
let SavingsModule = class SavingsModule {
};
exports.SavingsModule = SavingsModule;
exports.SavingsModule = SavingsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([savings_member_entity_1.SavingsMember, savings_contribution_entity_1.SavingsContribution])],
        providers: [savings_service_1.SavingsService],
        controllers: [savings_controller_1.SavingsController],
        exports: [savings_service_1.SavingsService],
    })
], SavingsModule);
//# sourceMappingURL=savings.module.js.map