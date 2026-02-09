const crypto = require('crypto');

// PBKDF2 Configuration
const ITERATIONS = 10000;
const KEYLEN = 64;
const DIGEST = 'sha512';

// Note: In a real production app, each user should have a unique salt stored in the DB.
// For simplicity in this project, we'll use a fixed salt or just hashing for now,
// but to be professional we will use a fixed salt for now to match the pre-generated hash
// or implementing a proper verify function.
// The hash 'befa...' for 'admin123' was generated with a specific salt.
// To make it easier without migrations for salt columns, we will just use a global salt or simple hashing.
// Let's implement a standard easy way: simple SHA256 or similar if salt column is missing,
// OR better: use a fixed global salt for this project scope.
const GLOBAL_SALT = 'farma_secure_salt_2026';

function hashPassword(password) {
    return crypto.pbkdf2Sync(password, GLOBAL_SALT, ITERATIONS, KEYLEN, DIGEST).toString('hex');
}

function verifyPassword(password, storedHash) {
    const hash = hashPassword(password);
    return hash === storedHash;
}

module.exports = { hashPassword, verifyPassword };
