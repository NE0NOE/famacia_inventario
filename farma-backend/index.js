const express = require('express');
const cors = require('cors');
require('dotenv').config();
const initDb = require('./init-db');

// Initialize Database
initDb();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Farma Backend Running', timestamp: new Date() });
});

const productRoutes = require('./routes/products');
const clientRoutes = require('./routes/clients');
const supplierRoutes = require('./routes/suppliers');
const saleRoutes = require('./routes/sales');
const purchaseRoutes = require('./routes/purchases');

app.use('/api/products', productRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
