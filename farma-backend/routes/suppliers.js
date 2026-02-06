const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/suppliers - Fetch all suppliers
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM suppliers ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/suppliers/:id - Fetch a single supplier
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM suppliers WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/suppliers - Create a new supplier
router.post('/', async (req, res) => {
    try {
        const { name, contact_person, phone, email, category } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const result = await db.query(
            'INSERT INTO suppliers (name, contact_person, phone, email, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, contact_person || null, phone || null, email || null, category || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT /api/suppliers/:id - Update an existing supplier
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, contact_person, phone, email, category } = req.body;

        const result = await db.query(
            'UPDATE suppliers SET name = $1, contact_person = $2, phone = $3, email = $4, category = $5 WHERE id = $6 RETURNING *',
            [name, contact_person, phone, email, category, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Supplier not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE /api/suppliers/:id - Remove a supplier
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM suppliers WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Supplier not found' });
        }

        res.json({ message: 'Supplier deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
