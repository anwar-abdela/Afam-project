import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
} from 'typeorm';

export enum UserRole {
    ADMIN = 'admin',
    MEMBER = 'member',
    VIEWER = 'viewer',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    name: string;

    @Column({ length: 150, unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ type: 'varchar', length: 20, default: UserRole.VIEWER })
    role: UserRole;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
