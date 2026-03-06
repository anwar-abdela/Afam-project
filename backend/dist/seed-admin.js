"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./src/users/user.entity");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
async function seed() {
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'anwar*1020',
        database: process.env.DB_NAME || 'shop_db',
        entities: [user_entity_1.User],
        synchronize: false,
    });
    try {
        await dataSource.initialize();
        const userRepo = dataSource.getRepository(user_entity_1.User);
        const email = 'admin@artic.sync';
        const existing = await userRepo.findOne({ where: { email } });
        if (existing) {
            console.log('Admin user already exists.');
        }
        else {
            const hashedPassword = await bcrypt.hash('password123', 12);
            const admin = userRepo.create({
                name: 'System Admin',
                email: email,
                password: hashedPassword,
                role: user_entity_1.UserRole.ADMIN,
            });
            await userRepo.save(admin);
            console.log('Admin user created successfully!');
            console.log('Email: admin@artic.sync');
            console.log('Password: password123');
        }
    }
    catch (error) {
        console.error('Error seeding admin:', error);
    }
    finally {
        await dataSource.destroy();
    }
}
seed();
//# sourceMappingURL=seed-admin.js.map