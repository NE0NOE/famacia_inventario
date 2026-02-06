const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/clients - Fetch all clients
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM clients ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/clients/:id - Fetch a single client
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM clients WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/clients - Create a new client
router.post('/', async (req, res) => {
    try {
        const { client_id, name, phone, email } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const result = await db.query(
            'INSERT INTO clients (client_id, name, phone, email, points) VALUES ($1, $2, $3, $4, 0) RETURNING *',
            [client_id || null, name, phone || null, email || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT /api/clients/:id - Update an existing client
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { client_id, name, phone, email, points } = req.body;

        const result = await db.query(
            'UPDATE clients SET client_id = $1, name = $2, phone = $3, email = $4, points = $5 WHERE id = $6 RETURNING *',
            [client_id, name, phone, email, points, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE /api/clients/:id - Remove a client
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }

        res.json({ message: 'Client deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
