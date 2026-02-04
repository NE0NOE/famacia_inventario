const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'farma.db');
const db = new sqlite3.Database(dbPath);

module.exports = {
    query: (text, params) => {
        return new Promise((resolve, reject) => {
            // Convert PostgreSQL style $1, $2... to SQLite style ?, ?...
            const sqliteQuery = text.replace(/\$\d+/g, '?');

            if (sqliteQuery.trim().toUpperCase().startsWith('SELECT')) {
                db.all(sqliteQuery, params, (err, rows) => {
                    if (err) reject(err);
                    else resolve({ rows });
                });
            } else {
                db.run(sqliteQuery, params, function (err) {
                    if (err) reject(err);
                    else resolve({ rows: [], lastID: this.lastID, changes: this.changes });
                });
            }
        });
    },
};
