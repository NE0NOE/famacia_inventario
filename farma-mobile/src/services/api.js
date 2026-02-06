// API Service for Farma Backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Generic fetch wrapper with error handling
async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(error.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Products API
export const productsAPI = {
    // GET /api/products - Fetch all products
    getAll: () => fetchAPI('/products'),

    // GET /api/products/:id - Fetch a single product
    getById: (id) => fetchAPI(`/products/${id}`),

    // POST /api/products - Create a new product
    create: (product) => fetchAPI('/products', {
        method: 'POST',
        body: JSON.stringify(product),
    }),

    // PUT /api/products/:id - Update an existing product
    update: (id, product) => fetchAPI(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(product),
    }),

    // DELETE /api/products/:id - Remove a product
    delete: (id) => fetchAPI(`/products/${id}`, {
        method: 'DELETE',
    }),
};

// Future APIs (to be implemented)
export const clientsAPI = {
    getAll: () => fetchAPI('/clients'),
    getById: (id) => fetchAPI(`/clients/${id}`),
    create: (client) => fetchAPI('/clients', {
        method: 'POST',
        body: JSON.stringify(client),
    }),
    update: (id, client) => fetchAPI(`/clients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(client),
    }),
    delete: (id) => fetchAPI(`/clients/${id}`, {
        method: 'DELETE',
    }),
};

export const suppliersAPI = {
    getAll: () => fetchAPI('/suppliers'),
    getById: (id) => fetchAPI(`/suppliers/${id}`),
    create: (supplier) => fetchAPI('/suppliers', {
        method: 'POST',
        body: JSON.stringify(supplier),
    }),
    update: (id, supplier) => fetchAPI(`/suppliers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(supplier),
    }),
    delete: (id) => fetchAPI(`/suppliers/${id}`, {
        method: 'DELETE',
    }),
};

export const salesAPI = {
    getAll: () => fetchAPI('/sales'),
    getById: (id) => fetchAPI(`/sales/${id}`),
    create: (sale) => fetchAPI('/sales', {
        method: 'POST',
        body: JSON.stringify(sale),
    }),
};

export default {
    products: productsAPI,
    clients: clientsAPI,
    suppliers: suppliersAPI,
    sales: salesAPI,
};
