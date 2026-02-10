const express = require('express');
const cors = require('cors');
require('dotenv').config();
const initDb = require('./init-db');

// Initialize Database
initDb();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173', 'http://localhost:4173', 'http://localhost'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || true) { // TEMPORARY: Allow all for debugging, better to restrict later
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
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
