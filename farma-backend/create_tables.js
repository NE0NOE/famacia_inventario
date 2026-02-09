const db = require('./db');

async function createTables() {
    try {
        console.log('Creating tables...');

        await db.query(`
            CREATE TABLE IF NOT EXISTS purchases (
                id SERIAL PRIMARY KEY,
                supplier_id INTEGER REFERENCES suppliers(id),
                total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
                status VARCHAR(50) DEFAULT 'completed',
                timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Table purchases created');

        await db.query(`
            CREATE TABLE IF NOT EXISTS purchase_items (
                id SERIAL PRIMARY KEY,
                purchase_id INTEGER REFERENCES purchases(id) ON DELETE CASCADE,
                product_id INTEGER REFERENCES products(id),
                quantity INTEGER NOT NULL,
                cost_price DECIMAL(10, 2) NOT NULL
            );
        `);
        console.log('✅ Table purchase_items created');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error creating tables:', err);
        process.exit(1);
    }
}

createTables();
