const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/purchases - Fetch all purchases
router.get('/', async (req, res) => {
    try {
        const result = await db.query(`
            SELECT p.*, s.name as supplier_name, COUNT(pi.id) as items_count 
            FROM purchases p 
            LEFT JOIN suppliers s ON p.supplier_id = s.id 
            LEFT JOIN purchase_items pi ON p.id = pi.purchase_id 
            GROUP BY p.id, s.name 
            ORDER BY p.timestamp DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/purchases - Create a new purchase (Order)
router.post('/', async (req, res) => {
    const { supplier_id, total, items } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Purchase must have at least one item' });
    }

    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // Create purchase record
        const purchaseResult = await client.query(
            'INSERT INTO purchases (supplier_id, total, status) VALUES ($1, $2, $3) RETURNING *',
            [supplier_id || null, total, 'pending']
        );

        const purchaseId = purchaseResult.rows[0].id;

        for (const item of items) {
            // Insert purchase item
            await client.query(
                'INSERT INTO purchase_items (purchase_id, product_id, quantity, cost_price) VALUES ($1, $2, $3, $4)',
                [purchaseId, item.product_id, item.quantity, item.cost_price]
            );
            // Stock is NOT updated here anymore
        }

        await client.query('COMMIT');

        res.status(201).json(purchaseResult.rows[0]);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Transaction Error:', err);
        res.status(500).json({ error: 'Internal Server Error: ' + err.message });
    } finally {
        client.release();
    }
});

// PUT /api/purchases/:id/receive - Mark purchase as received and update stock
router.put('/:id/receive', async (req, res) => {
    const purchaseId = req.params.id;
    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // Check current status
        const purchaseCheck = await client.query('SELECT status FROM purchases WHERE id = $1', [purchaseId]);
        if (purchaseCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Purchase not found' });
        }
        if (purchaseCheck.rows[0].status === 'received') {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Purchase already received' });
        }

        // Update status
        await client.query('UPDATE purchases SET status = $1 WHERE id = $2', ['received', purchaseId]);

        // Get items to update stock
        const itemsResult = await client.query('SELECT * FROM purchase_items WHERE purchase_id = $1', [purchaseId]);
        const items = itemsResult.rows;

        for (const item of items) {
            await client.query(
                'UPDATE products SET stock = stock + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
                [item.quantity, item.product_id]
            );
        }

        await client.query('COMMIT');
        res.json({ message: 'Purchase received and stock updated' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Transaction Error:', err);
        res.status(500).json({ error: 'Internal Server Error: ' + err.message });
    } finally {
        client.release();
    }
});

module.exports = router;
