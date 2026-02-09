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
    console.log('Database initialized successfully.');
}

if (require.main === module) {
    initDb();
}

module.exports = initDb;
