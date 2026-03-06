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
exports.SavingsContribution = void 0;
const typeorm_1 = require("typeorm");
const savings_member_entity_1 = require("./savings-member.entity");
let SavingsContribution = class SavingsContribution {
};
exports.SavingsContribution = SavingsContribution;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SavingsContribution.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => savings_member_entity_1.SavingsMember, (m) => m.contributions, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'member_id' }),
    __metadata("design:type", savings_member_entity_1.SavingsMember)
], SavingsContribution.prototype, "member", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'member_id' }),
    __metadata("design:type", String)
], SavingsContribution.prototype, "memberId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], SavingsContribution.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', default: () => 'CURRENT_DATE' }),
    __metadata("design:type", String)
], SavingsContribution.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_missed', default: false }),
    __metadata("design:type", Boolean)
], SavingsContribution.prototype, "isMissed", void 0);
exports.SavingsContribution = SavingsContribution = __decorate([
    (0, typeorm_1.Entity)('savings_contributions')
], SavingsContribution);
//# sourceMappingURL=savings-contribution.entity.js.map