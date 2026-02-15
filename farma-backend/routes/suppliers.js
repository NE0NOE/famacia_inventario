const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/suppliers - Fetch all suppliers
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM suppliers ORDER BY status ASC, name ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/suppliers - Create a new supplier
router.post('/', async (req, res) => {
    try {
        const { name, contact_person, phone, email, address, category } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const result = await db.query(
            'INSERT INTO suppliers (name, contact_person, phone, email, category, address, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [name, contact_person || null, phone || null, email || null, category || null, address || null, 'active']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT /api/suppliers/:id - Update a supplier
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, contact_person, phone, email, category, address } = req.body;

        const result = await db.query(
            'UPDATE suppliers SET name = $1, contact_person = $2, phone = $3, email = $4, category = $5, address = $6 WHERE id = $7 RETURNING *',
            [name, contact_person, phone, email, category, address || null, id]
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

// PUT /api/suppliers/:id/toggle-status - Toggle supplier active/inactive
router.put('/:id/toggle-status', async (req, res) => {
    try {
        const { id } = req.params;

        // Get current status
        const current = await db.query('SELECT status FROM suppliers WHERE id = $1', [id]);
        if (current.rows.length === 0) {
            return res.status(404).json({ error: 'Supplier not found' });
        }

        const newStatus = current.rows[0].status === 'active' ? 'inactive' : 'active';
        const result = await db.query(
            'UPDATE suppliers SET status = $1 WHERE id = $2 RETURNING *',
            [newStatus, id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
