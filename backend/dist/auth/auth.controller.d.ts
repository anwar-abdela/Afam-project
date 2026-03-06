import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './auth.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: import("../users/user.entity").UserRole;
        createdAt: Date;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            name: string;
            email: string;
            role: import("../users/user.entity").UserRole;
        };
    }>;
    getMe(req: any): Promise<{
        id: string;
        name: string;
        email: string;
        role: import("../users/user.entity").UserRole;
        createdAt: Date;
    }>;
}
