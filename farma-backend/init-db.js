const db = require('./db');
const fs = require('fs');
const path = require('path');

async function initDb() {
    const sqlPath = path.resolve(__dirname, 'database.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    const statements = sql.split(';').filter(s => s.trim() !== '');

    console.log('Initializing PostgreSQL database...');
    for (let statement of statements) {
        try {
            await db.query(statement);
        } catch (err) {
            // Ignore "already exists" errors
            if (err.code !== '42P07') {
                console.error(`Error executing statement: ${statement}`);
                console.error(err);
            }
        }
    }

    // Migrations for existing databases
    const migrations = [
        "ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active'",
        "ALTER TABLE suppliers ADD COLUMN IF NOT EXISTS address TEXT",
        "ALTER TABLE clients ADD COLUMN IF NOT EXISTS last_visit TIMESTAMP WITH TIME ZONE",
    ];

    console.log('Running migrations...');
    for (let migration of migrations) {
        try {
            await db.query(migration);
        } catch (err) {
            // Ignore errors (column might already exist in non-PG databases)
            console.log(`Migration note: ${err.message}`);
        }
    }

    console.log('Database initialized successfully.');
}

if (require.main === module) {
    initDb();
}

module.exports = initDb;

