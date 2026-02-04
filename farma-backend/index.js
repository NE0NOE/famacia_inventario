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
app.use('/api/products', productRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
