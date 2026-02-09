const db = require('./db');

async function check() {
    try {
        const res = await db.query("SELECT to_regclass('public.clients')");
        if (res.rows[0].to_regclass) {
            console.log("Table exists");
        } else {
            console.log("Table MISSING");
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
