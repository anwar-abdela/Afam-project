import {
    Injectable, ConflictException, UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { RegisterDto, LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private usersRepo: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const existing = await this.usersRepo.findOne({ where: { email: dto.email } });
        if (existing) throw new ConflictException('Email already in use');

        const hashed = await bcrypt.hash(dto.password, 12);
        const user = this.usersRepo.create({ ...dto, password: hashed });
        await this.usersRepo.save(user);

        const { password, ...result } = user;
        return result;
    }

    async login(dto: LoginDto) {
        const user = await this.usersRepo.findOne({ where: { email: dto.email } });
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid) throw new UnauthorizedException('Invalid credentials');

        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            accessToken: this.jwtService.sign(payload),
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        };
    }

    async getMe(userId: string) {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user) throw new UnauthorizedException();
        const { password, ...result } = user;
        return result;
    }
}
