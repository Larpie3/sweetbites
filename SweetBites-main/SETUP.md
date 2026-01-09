# SweetBites - Dynamic Bakery Website

A fully functional dynamic bakery website with shopping cart, order management, and admin dashboard.

## 🎯 Features

### Customer Features
- **Dynamic Product Catalog** - Products loaded from database
- **Shopping Cart** - Add/remove items, manage quantities
- **Order Management** - Place orders with delivery options
- **Order Tracking** - See order status in real-time
- **Dark Mode** - Theme toggle with localStorage persistence
- **Responsive Design** - Mobile-friendly interface

### Admin Features
- **Admin Dashboard** - View all orders and products
- **Order Management** - Update order status (pending/completed/cancelled)
- **Product Management** - Add, edit, delete products
- **Sales Statistics** - View total orders and revenue
- **Database Management** - SQLite database with order history

## 📋 Prerequisites

- Node.js 16+ and npm
- Windows, macOS, or Linux

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

This will install:
- **express** - Web framework
- **sqlite3** - Database
- **cors** - Cross-origin requests
- **dotenv** - Environment variables

### 2. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000`

### 3. Access the Website

- **Main Site**: http://localhost:3000
- **Menu Page**: http://localhost:3000/menu
- **Shopping Cart**: http://localhost:3000/cart
- **Order Checkout**: http://localhost:3000/contact
- **Admin Dashboard**: http://localhost:3000/admin

## 📁 Project Structure

```
SweetBites-main/
├── server.js           # Express server & API routes
├── db.js              # Database initialization & seeding
├── package.json       # Dependencies
├── script.js          # Client-side JavaScript
├── styles.css         # Styling
├── index.html         # Home page
├── menu.html          # Menu (dynamic)
├── cart.html          # Shopping cart
├── contact.html       # Checkout form
├── admin.html         # Admin dashboard
├── about.html         # About page
├── thanks.html        # Thank you page
└── images/            # Product images
```

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order with items
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order

### Stats
- `GET /api/stats` - Get sales statistics

## 💾 Database

### Tables

**products**
- id (Primary Key)
- name (Unique)
- description
- price
- category
- image
- created_at

**orders**
- id (Primary Key)
- name
- email
- phone
- orderType (Pickup/Delivery/Custom)
- address
- message
- total
- status (pending/completed/cancelled)
- created_at

**order_items**
- id (Primary Key)
- order_id (Foreign Key)
- product_id
- quantity
- price

## 🛒 Shopping Cart Workflow

1. User adds products to cart (stored in localStorage)
2. Cart count updates in header
3. User views cart at `/cart`
4. Proceeds to checkout at `/contact`
5. Form validates and submits order to backend
6. Order saved to database with status "pending"
7. Admin can view and update order status

## 👨‍💼 Admin Features

1. Visit `/admin` dashboard
2. View **orders** with customer details and status
3. Update order status (pending → completed/cancelled)
4. View **products** with prices
5. Add new products to catalog
6. View **statistics** (total orders, revenue, product count)

## 🎨 Customization

### Add New Products (Dynamic)

**Via API:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Red Velvet Cake",
    "description": "Classic red velvet with cream cheese frosting",
    "price": 550,
    "category": "Cakes & Pastries",
    "image": "images/red-velvet.jpg"
  }'
```

**Via Admin Dashboard:**
- Navigate to `/admin`
- Click "Products" tab
- Click "+ Add New Product"
- Fill form and submit

### Database Reset

Delete `sweetbites.db` file to reset the database. It will be recreated on next server start with seed data.

## 🔐 Security Notes

- Currently no authentication on admin endpoints
- For production, add:
  - Admin login/password protection
  - Input validation & sanitization
  - HTTPS/SSL certificate
  - CORS configuration
  - Rate limiting

## 📦 Deployment Options

### Render.com (Free)
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set build command: `npm install`
5. Set start command: `npm start`

### Heroku
```bash
heroku create sweetbites-app
git push heroku main
```

### Vercel + Firebase
- Host frontend on Vercel
- Use Firebase Realtime Database for backend

## 🐛 Troubleshooting

### Port Already in Use
```bash
lsof -i :3000  # Check what's using port 3000
kill -9 <PID>  # Kill the process
```

### Database Issues
```bash
rm sweetbites.db
npm start  # Recreates database with seed data
```

### Products Not Loading
- Check API_URL in script.js matches your server
- Ensure server is running: `npm start`
- Check browser console for errors

### Cart Not Working
- Check localStorage is enabled in browser
- Clear localStorage and refresh

## 📝 License

MIT License - Free to use and modify

## 🍰 Credits

SweetBites Bakery Website
Built with Node.js, Express, SQLite3, and Vanilla JavaScript

---

**Questions or Issues?** Check the console for error messages and ensure the server is running on port 3000.
