require('dotenv').config();
const { DataSource } = require('typeorm');

const ds = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'shop_db',
    synchronize: true,
    logging: true,
    entities: ['dist/**/*.entity.js'],
});

ds.initialize()
    .then(() => {
        console.log('\n✅ DataSource initialized successfully!\n');
        process.exit(0);
    })
    .catch((err) => {
        console.error('\n❌ DataSource init FAILED:\n', err.message);
        console.error('\nFull error:', err);
        process.exit(1);
    });
