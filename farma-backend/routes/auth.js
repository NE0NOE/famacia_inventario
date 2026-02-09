const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyPassword } = require('../utils/password');

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const user = result.rows[0];
        const isValid = verifyPassword(password, user.password_hash);

        if (!isValid) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // In a real app we would issue a JWT here. For now, just return success.
        res.json({
            message: 'Login exitoso',
            user: { id: user.id, username: user.username, role: user.role }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;
