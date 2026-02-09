const express = require('express');
const router = express.Router();
const db = require('../db');
const { hashPassword } = require('../utils/password');

// Get all users
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT id, username, role, created_at FROM users ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create new user
router.post('/', async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Datos incompletos' });

    try {
        const hash = hashPassword(password);
        const result = await db.query(
            'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role',
            [username, hash, role || 'seller']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: 'El nombre de usuario ya existe' });
        }
        res.status(500).json({ error: err.message });
    }
});

// Update user (password or role)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { password, role } = req.body;

    try {
        if (password) {
            const hash = hashPassword(password);
            await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, id]);
        }
        if (role) {
            await db.query('UPDATE users SET role = $1 WHERE id = $2', [role, id]);
        }
        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM users WHERE id = $1', [id]);
        res.json({ message: 'Usuario eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
