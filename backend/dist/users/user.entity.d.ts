export declare enum UserRole {
    ADMIN = "admin",
    MEMBER = "member",
    VIEWER = "viewer"
}
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    createdAt: Date;
}
