const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/sales - Fetch all sales
router.get('/', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT s.*, COUNT(si.id) as items_count 
            FROM sales s 
            LEFT JOIN sale_items si ON s.id = si.sale_id 
            GROUP BY s.id 
            ORDER BY s.timestamp DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/sales/:id - Fetch a single sale with items
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Get sale
        const saleResult = await db.query('SELECT * FROM sales WHERE id = $1', [id]);
        if (saleResult.rows.length === 0) {
            return res.status(404).json({ error: 'Sale not found' });
        }

        // Get sale items with product details
        const itemsResult = await db.query(`
            SELECT si.*, p.name as product_name, p.sku 
            FROM sale_items si 
            JOIN products p ON si.product_id = p.id 
            WHERE si.sale_id = $1
        `, [id]);

        const sale = saleResult.rows[0];
        sale.items = itemsResult.rows;

        res.json(sale);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/sales - Create a new sale
router.post('/', async (req, res) => {
    try {
        const { client_id, subtotal, total, payment_method, items } = req.body;

        // Validate required fields
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Sale must have at least one item' });
        }

        if (!payment_method) {
            return res.status(400).json({ error: 'Payment method is required' });
        }

        // Start transaction
        await db.query('BEGIN');

        try {
            // Validate stock for all items first
            for (const item of items) {
                const stockResult = await db.query(
                    'SELECT stock FROM products WHERE id = $1',
                    [item.product_id]
                );

                if (stockResult.rows.length === 0) {
                    throw new Error(`Product ${item.product_id} not found`);
                }

                const availableStock = stockResult.rows[0].stock;
                if (availableStock < item.quantity) {
                    throw new Error(`Insufficient stock for product ${item.product_id}. Available: ${availableStock}, Requested: ${item.quantity}`);
                }
            }

            // Create sale
            const saleResult = await db.query(
                'INSERT INTO sales (client_id, subtotal, total, payment_method) VALUES ($1, $2, $3, $4) RETURNING *',
                [client_id || null, subtotal, total, payment_method]
            );

            const saleId = saleResult.rows[0].id;

            // Create sale items and update stock
            for (const item of items) {
                // Insert sale item
                await db.query(
                    'INSERT INTO sale_items (sale_id, product_id, quantity, price_at_sale) VALUES ($1, $2, $3, $4)',
                    [saleId, item.product_id, item.quantity, item.price_at_sale]
                );

                // Update product stock
                await db.query(
                    'UPDATE products SET stock = stock - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
                    [item.quantity, item.product_id]
                );
            }

            // Commit transaction
            await db.query('COMMIT');

            res.status(201).json(saleResult.rows[0]);
        } catch (err) {
            // Rollback on error
            await db.query('ROLLBACK');
            throw err;
        }
    } catch (err) {
        console.error(err);
        const statusCode = err.message.includes('not found') || err.message.includes('Insufficient') ? 400 : 500;
        res.status(statusCode).json({ error: err.message || 'Internal Server Error' });
    }
});

module.exports = router;
