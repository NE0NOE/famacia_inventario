const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/products - Fetch all products
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM products ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/products/:id - Fetch a single product
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/products - Create a new product
router.post('/', async (req, res) => {
    try {
        const { sku, name, category, price, stock } = req.body;
        const result = await db.query(
            'INSERT INTO products (sku, name, category, price, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [sku, name, category, price, stock]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        if (err.code === '23505') { // Unique violation
            return res.status(400).json({ error: 'SKU already exists' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT /api/products/:id - Update an existing product
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { sku, name, category, price, stock } = req.body;
        const result = await db.query(
            'UPDATE products SET sku = $1, name = $2, category = $3, price = $4, stock = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
            [sku, name, category, price, stock, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE /api/products/:id - Remove a product
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
