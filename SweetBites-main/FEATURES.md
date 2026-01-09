# 🍰 SweetBites - Feature Documentation

## Quick Start

### For Windows:
Double-click `start.bat` in the project folder

### For Mac/Linux:
```bash
chmod +x start.sh
./start.sh
```

Or manually:
```bash
npm install
npm start
```

Then visit: **http://localhost:3000**

---

## ✨ New Dynamic Features

### 1. 🛒 Shopping Cart System

**What's New:**
- Add products directly from menu
- Persistent cart using localStorage
- Quantity controls (increase/decrease)
- Real-time cart count in header
- Checkout flow integrated with orders

**How to Use:**
1. Visit `/menu` page
2. Click "Add to Cart" button on any product
3. Cart count updates in top header
4. Click cart icon (🛒 Cart) to view cart
5. Adjust quantities or remove items
6. Click "Proceed to Checkout"
7. Fill in order form and submit

**Files:**
- `cart.html` - Shopping cart page
- `script.js` - Cart management functions
- `styles.css` - Cart styling

---

### 2. 📦 Dynamic Product Database

**What's New:**
- Products stored in SQLite database
- Add/edit/delete products without coding
- Menu automatically updates from database
- Categorized product display

**Included Products (Auto-Loaded):**
- Chocolate Fudge Cake (₱450)
- Red Velvet Slice (₱120)
- Strawberry Cheesecake Bites (₱85)
- Ube Macapuno Cupcake (₱420)
- Iced Coffee (₱95)
- Hot Chocolate (₱80)
- Mango Smoothie (₱110)

**How It Works:**
1. Server loads products from `products` table
2. Menu page makes API request to `/api/products/category/:category`
3. Products rendered dynamically with prices and images
4. Add to cart functionality integrated

**API Endpoints:**
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/category/:category` - Get by category
- `POST /api/products` - Add new product
- `DELETE /api/products/:id` - Remove product

---

### 3. 📋 Order Management System

**What's New:**
- Complete order lifecycle tracking
- Order status updates (pending → completed/cancelled)
- Order history stored in database
- Customer details and items tracking

**Order Workflow:**
1. Customer adds items to cart
2. Proceeds to checkout (`/contact`)
3. Fills form with name, phone, email, order type
4. Submits order
5. Order saved to database with status "pending"
6. Admin can view and update status
7. Customer can see order history

**Database Schema:**
```
orders table:
- id (auto-increment)
- name (customer name)
- email (contact email)
- phone (customer phone)
- orderType (Pickup/Delivery/Custom)
- address (delivery address)
- message (special instructions)
- total (order total in ₱)
- status (pending/completed/cancelled)
- created_at (timestamp)

order_items table:
- id (auto-increment)
- order_id (links to orders)
- product_id (links to products)
- quantity (items count)
- price (per-item price)
```

**API Endpoints:**
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update status
- `DELETE /api/orders/:id` - Delete order

---

### 4. 👨‍💼 Admin Dashboard

**Access:** http://localhost:3000/admin

**Features:**

#### Dashboard Stats
- Total Orders Count
- Total Revenue (₱)
- Total Products

#### Orders Management Tab
- View all orders in table
- See customer name, order type, total, status
- Update order status (pending/completed/cancelled)
- Delete orders
- Sort by newest first

#### Products Management Tab
- View all products with prices
- Add new product with form modal
- Edit existing products
- Delete products
- Search by name/category

**How to Use Admin Dashboard:**
1. Navigate to http://localhost:3000/admin
2. View stats at the top
3. Click "Orders" tab to manage orders
4. Click "Products" tab to manage catalog
5. Use action buttons (Edit/Delete) as needed
6. Add new products with "+ Add New Product" button

---

### 5. 💾 Backend API Server

**Technology Stack:**
- Node.js + Express
- SQLite3 database
- CORS enabled for frontend communication
- JSON API

**Server Features:**
- Automatic database initialization
- Seed data on first run
- RESTful API endpoints
- Static file serving (HTML, CSS, JS, images)
- Error handling

**How to Start:**
```bash
npm start          # Production mode
npm run dev        # Development with auto-reload (requires nodemon)
```

**Server Output:**
```
Database connected
Database seeded with initial products
🍰 SweetBites server running on http://localhost:3000
```

**Configuration:**
Edit `.env` file:
```
PORT=3000
NODE_ENV=development
```

---

## 🎯 Complete User Journey

### Customer Flow:
1. Visit home page (`/`)
2. Browse featured products
3. Click "View Menu" → `/menu`
4. See all products from database
5. Click "Add to Cart" on desired items
6. View cart at `/cart`
7. Adjust quantities if needed
8. Click "Proceed to Checkout"
9. Fill order form at `/contact`
10. Submit order
11. Redirected to `/thanks` page
12. Order saved to database

### Admin Flow:
1. Visit `/admin` dashboard
2. Review order statistics
3. Check pending orders in "Orders" tab
4. Update order statuses
5. Go to "Products" tab
6. Add new products or delete old ones
7. View product statistics

---

## 🔄 Data Persistence

### LocalStorage (Client-Side)
- **Cart items** - Survives page refresh
- **Theme preference** - Dark/Light mode selection

### SQLite Database (Server-Side)
- **Products** - Persists across server restarts
- **Orders** - Complete order history
- **Order Items** - Line items for each order

**Database Location:** `sweetbites.db` (auto-created)

---

## 🌍 API Reference

### Base URL
```
http://localhost:3000/api
```

### Products Endpoints

#### Get All Products
```
GET /api/products

Response:
[
  {
    "id": 1,
    "name": "Chocolate Fudge Cake",
    "description": "8-inch with rich ganache",
    "price": 450,
    "category": "Cakes & Pastries",
    "image": "images/Chocolate Fudge Cake.jpg",
    "created_at": "2025-01-09T10:00:00Z"
  },
  ...
]
```

#### Get Products by Category
```
GET /api/products/category/Cakes%20%26%20Pastries

Response: [filtered products array]
```

### Orders Endpoints

#### Create Order
```
POST /api/orders

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+639123456789",
  "orderType": "Delivery",
  "address": "123 Main St",
  "message": "Extra icing please",
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 450
    }
  ]
}

Response:
{
  "id": 1,
  "message": "Order created successfully"
}
```

#### Get All Orders
```
GET /api/orders

Response: [array of all orders]
```

#### Update Order Status
```
PUT /api/orders/1/status

Body:
{
  "status": "completed"
}

Response:
{
  "message": "Order updated"
}
```

### Statistics
```
GET /api/stats

Response:
{
  "totalOrders": 5,
  "revenue": 2500,
  "products": 7
}
```

---

## 🛠️ Customization Guide

### Add Your Logo
Edit `index.html` and replace "SweetBites" text in header with an `<img>` tag:
```html
<div class="brand">
  <a href="index.html">
    <img src="images/logo.png" alt="SweetBites" height="40">
  </a>
</div>
```

### Change Colors
Edit `styles.css` root variables:
```css
:root{
  --beige:#f7efe6;      /* Main background */
  --brown:#6b3f26;      /* Text color */
  --soft:#e9dfd4;       /* Light background */
  --muted:#8f7f73;      /* Secondary text */
  --accent:#c7a15a;     /* Button color */
}
```

### Add New Category
1. Add products with new category via admin dashboard
2. Menu page automatically loads them
3. Or manually add section to `menu.html`:
```html
<section class="container title" id="custom-section">
  <h1 class="section-title">Your Category</h1>
  <div class="cards grid-3" id="custom-container"></div>
</section>
```

Then in `script.js`:
```javascript
loadProductsByCategory('Your Category', 'custom-container');
```

---

## ⚠️ Important Notes

### Database Reset
To start fresh with new seed data:
```bash
# Stop the server (Ctrl+C)
# Delete the database file
rm sweetbites.db
# Restart server
npm start
```

### CORS Issues
If products don't load on menu page:
- Ensure server is running: `npm start`
- Check browser console for error messages
- Verify API_URL in `script.js` matches your server

### Port Conflicts
If port 3000 is already in use:
```bash
# Change port in .env
PORT=3001

# Or kill the process using the port
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -i :3000
```

---

## 📱 Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

---

## 🔒 Security Considerations

For **production** deployments:

1. **Add Authentication**
   - Admin dashboard password protection
   - User login for order tracking

2. **Validate Input**
   - Sanitize all form inputs
   - Check data types on backend

3. **Use HTTPS**
   - Get SSL certificate
   - Force HTTPS in production

4. **Limit API Access**
   - Add rate limiting
   - Implement API key authentication
   - Restrict admin endpoints

5. **Backup Database**
   - Regular SQLite backups
   - Version control for code

---

## 🚀 Deployment

### Deploy to Render.com (Free)

1. Push code to GitHub
2. Visit https://render.com
3. Create new "Web Service"
4. Connect GitHub repo
5. Settings:
   - Build command: `npm install`
   - Start command: `npm start`
   - Environment: Node.js
6. Deploy!

Your site will be live at a Render URL automatically.

---

## 🐛 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Products not showing on menu | Server not running | Run `npm start` |
| Cart doesn't persist | localStorage disabled | Enable cookies in browser |
| Can't access admin panel | Wrong URL | Use `http://localhost:3000/admin` |
| Database error | Corrupted DB | Delete `sweetbites.db` and restart |
| Port 3000 already in use | Another app using it | Change PORT in `.env` |

---

## 📞 Support

For issues:
1. Check browser console (F12 → Console tab)
2. Check terminal output from `npm start`
3. Ensure Node.js 16+ is installed
4. Try stopping and restarting the server

---

## 🎉 You're All Set!

Your SweetBites website is now fully dynamic with:
- ✅ Shopping cart
- ✅ Product database
- ✅ Order management
- ✅ Admin dashboard
- ✅ Backend API server

Happy baking! 🍰
