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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavingsMember = void 0;
const typeorm_1 = require("typeorm");
const savings_contribution_entity_1 = require("./savings-contribution.entity");
let SavingsMember = class SavingsMember {
};
exports.SavingsMember = SavingsMember;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SavingsMember.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], SavingsMember.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], SavingsMember.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => savings_contribution_entity_1.SavingsContribution, (c) => c.member),
    __metadata("design:type", Array)
], SavingsMember.prototype, "contributions", void 0);
exports.SavingsMember = SavingsMember = __decorate([
    (0, typeorm_1.Entity)('savings_members')
], SavingsMember);
//# sourceMappingURL=savings-member.entity.js.map