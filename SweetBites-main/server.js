import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializeDatabase, seedDatabase } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Initialize database
const db = new sqlite3.Database('./sweetbites.db', (err) => {
  if (err) console.error('Database error:', err);
  else {
    console.log('Database connected');
    initializeDatabase(db);
    seedDatabase(db);
  }
});

// =================== API ENDPOINTS ===================

// Get all products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY category', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get products by category
app.get('/api/products/category/:category', (req, res) => {
  const { category } = req.params;
  db.all('SELECT * FROM products WHERE category = ? ORDER BY name', [category], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Product not found' });
    res.json(row);
  });
});

// Get all orders
app.get('/api/orders', (req, res) => {
  db.all('SELECT * FROM orders ORDER BY created_at DESC', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get single order with items
app.get('/api/orders/:id', (req, res) => {
  db.get('SELECT * FROM orders WHERE id = ?', [req.params.id], (err, order) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    db.all('SELECT * FROM order_items WHERE order_id = ?', [req.params.id], (err, items) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ...order, items });
    });
  });
});

// Create new order
app.post('/api/orders', (req, res) => {
  const { name, email, phone, orderType, address, message, items } = req.body;

  if (!name || !email || !phone || !orderType || !items?.length) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  db.run(
    'INSERT INTO orders (name, email, phone, orderType, address, message, total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, email, phone, orderType, address || '', message, total, 'pending'],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      const orderId = this.lastID;

      // Insert order items
      let completed = 0;
      items.forEach((item) => {
        db.run(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.price],
          (err) => {
            if (err) console.error(err);
            completed++;
            if (completed === items.length) {
              res.status(201).json({ id: orderId, message: 'Order created successfully' });
            }
          }
        );
      });
    }
  );
});

// Update order status (admin)
app.put('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status required' });

  db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Order updated' });
  });
});

// Delete order (admin)
app.delete('/api/orders/:id', (req, res) => {
  db.run('DELETE FROM orders WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Order deleted' });
  });
});

// Get stats
app.get('/api/stats', (req, res) => {
  db.get('SELECT COUNT(*) as totalOrders, SUM(total) as revenue FROM orders', (err, stats) => {
    if (err) return res.status(500).json({ error: err.message });
    db.get('SELECT COUNT(*) as products FROM products', (err, products) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ...stats, ...products });
    });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve all HTML files
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/menu', (req, res) => res.sendFile(path.join(__dirname, 'menu.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'about.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'contact.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.get('/cart', (req, res) => res.sendFile(path.join(__dirname, 'cart.html')));

app.listen(PORT, () => {
  console.log(`🍰 SweetBites server running on http://localhost:${PORT}`);
});
