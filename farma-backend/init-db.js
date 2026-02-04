const db = require('./db');
const fs = require('fs');
const path = require('path');

async function initDb() {
    const sqlPath = path.resolve(__dirname, 'database.sql');
    let sql = fs.readFileSync(sqlPath, 'utf8');

    // Basic transformations for SQLite compatibility
    sql = sql.replace(/SERIAL PRIMARY KEY/ig, 'INTEGER PRIMARY KEY AUTOINCREMENT');
    sql = sql.replace(/TIMESTAMP WITH TIME ZONE/ig, 'DATETIME');
    sql = sql.replace(/VARCHAR\(\d+\)/ig, 'TEXT');
    sql = sql.replace(/DECIMAL\(\d+,\s*\d+\)/ig, 'NUMERIC');

    const statements = sql.split(';').filter(s => s.trim() !== '');

    console.log('Initializing SQLite database...');
    for (let statement of statements) {
        try {
            await db.query(statement);
        } catch (err) {
            console.error(`Error executing statement: ${statement}`);
            console.error(err);
        }
    }
    console.log('Database initialized successfully.');
}

if (require.main === module) {
    initDb();
}

module.exports = initDb;
