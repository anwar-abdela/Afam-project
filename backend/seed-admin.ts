import { DataSource } from 'typeorm';
import { User, UserRole } from './src/users/user.entity';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

async function seed() {
    const dataSource = new DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'anwar*1020',
        database: process.env.DB_NAME || 'shop_db',
        entities: [User],
        synchronize: false,
    });

    try {
        await dataSource.initialize();
        const userRepo = dataSource.getRepository(User);

        const email = 'admin@artic.sync';
        const existing = await userRepo.findOne({ where: { email } });

        if (existing) {
            console.log('Admin user already exists.');
        } else {
            const hashedPassword = await bcrypt.hash('password123', 12);
            const admin = userRepo.create({
                name: 'System Admin',
                email: email,
                password: hashedPassword,
                role: UserRole.ADMIN,
            });
            await userRepo.save(admin);
            console.log('Admin user created successfully!');
            console.log('Email: admin@artic.sync');
            console.log('Password: password123');
        }
    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        await dataSource.destroy();
    }
}

seed();
