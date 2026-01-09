# 🏗️ SweetBites Architecture & Technical Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT SIDE (Browser)                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   index.html │  │   menu.html  │  │  cart.html   │      │
│  │   (Home)     │  │   (Products) │  │  (Shopping)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ about.html   │  │contact.html  │  │ admin.html   │      │
│  │   (About)    │  │  (Checkout)  │  │ (Dashboard)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│                    ┌────────────────┐                        │
│                    │   script.js    │                        │
│                    │ (All JS Logic) │                        │
│                    └────────────────┘                        │
│                                                               │
│                    ┌────────────────┐                        │
│                    │  styles.css    │                        │
│                    │   (Styling)    │                        │
│                    └────────────────┘                        │
│                                                               │
│                    ┌────────────────┐                        │
│                    │  localStorage  │                        │
│                    │   (Cart Data)  │                        │
│                    └────────────────┘                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/JSON
                    ┌──────────────────┐
                    │   Network (API)  │
                    └──────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    SERVER SIDE (Node.js)                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│                    ┌────────────────┐                        │
│                    │   server.js    │                        │
│                    │  (Express App) │                        │
│                    └────────────────┘                        │
│                           ↕                                  │
│         ┌─────────────────────────────────┐                 │
│         │      REST API Routes            │                 │
│         │  (/api/products, /api/orders)   │                 │
│         └─────────────────────────────────┘                 │
│                           ↕                                  │
│         ┌─────────────────────────────────┐                 │
│         │        Static File Server       │                 │
│         │  (HTML, CSS, JS, Images)        │                 │
│         └─────────────────────────────────┘                 │
│                           ↕                                  │
│         ┌─────────────────────────────────┐                 │
│         │        db.js (Database)         │                 │
│         │   Schema & Seed Functions       │                 │
│         └─────────────────────────────────┘                 │
│                           ↕                                  │
│         ┌─────────────────────────────────┐                 │
│         │    SQLite (sweetbites.db)       │                 │
│         │   (Persistent Data Storage)     │                 │
│         │                                 │                 │
│         │  ┌─────────────────────────┐    │                 │
│         │  │  products table         │    │                 │
│         │  │  orders table           │    │                 │
│         │  │  order_items table      │    │                 │
│         │  └─────────────────────────┘    │                 │
│         └─────────────────────────────────┘                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. Adding Product to Cart

```
User clicks "Add to Cart"
           ↓
   script.js detects click
           ↓
   addToCart(product) called
           ↓
   Retrieve cart from localStorage
           ↓
   Check if product exists in cart
           ├→ YES: increment quantity
           └→ NO: add new item
           ↓
   Save updated cart to localStorage
           ↓
   updateCartCount() refreshes header
           ↓
   Show "Added to cart" notification
           ↓
   User sees updated cart count
```

### 2. Loading Menu Products

```
User visits /menu
           ↓
   Page loads script.js
           ↓
   DOMContentLoaded event fires
           ↓
   loadProductsByCategory() called
           ↓
   Fetch GET /api/products/category/[name]
           ↓
   Express server receives request
           ↓
   Database query: SELECT * FROM products WHERE category = [name]
           ↓
   SQLite returns matching products
           ↓
   Express returns JSON to client
           ↓
   script.js renders HTML with products
           ↓
   Products display on page with "Add to Cart" buttons
```

### 3. Submitting an Order

```
User fills order form & submits
           ↓
   Validate form locally
           ↓
   Get cart items from localStorage
           ↓
   POST to /api/orders with customer data
           ↓
   Express validates data
           ↓
   Create order record in orders table
           ↓
   For each item in cart:
       Create record in order_items table
           ↓
   Return order ID to client
           ↓
   Clear cart from localStorage
           ↓
   Show success message
           ↓
   Redirect to /thanks page
           ↓
   Admin can now view order in dashboard
```

### 4. Admin Updating Order Status

```
Admin visits /admin dashboard
           ↓
   Fetch GET /api/orders
           ↓
   Display all orders in table
           ↓
   Admin clicks "Edit" on an order
           ↓
   Status modal pops up
           ↓
   Admin selects new status
           ↓
   Submit: PUT /api/orders/[id]/status
           ↓
   Express updates database
           ↓
   Return success response
           ↓
   Refresh orders table
           ↓
   Updated status displays immediately
```

---

## API Endpoint Hierarchy

```
/api
├── /health                          GET   Health check
├── /stats                           GET   Sales statistics
│
├── /products                        GET   All products
├── /products/:id                    GET   Single product
├── /products/category/:category     GET   Products by category
├── /products                        POST  Create product
├── /products/:id                    DELETE Delete product
│
├── /orders                          GET   All orders
├── /orders/:id                      GET   Single order with items
├── /orders                          POST  Create new order
├── /orders/:id/status               PUT   Update order status
└── /orders/:id                      DELETE Delete order
```

---

## Database Schema

### products table
```
┌─────────────────────────────────────────────┐
│ products                                    │
├─────────────────────────────────────────────┤
│ id (INTEGER, PK, AUTO_INCREMENT)           │
│ name (TEXT, UNIQUE)                        │
│ description (TEXT)                         │
│ price (REAL)                               │
│ category (TEXT)                            │
│ image (TEXT)                               │
│ created_at (DATETIME, DEFAULT NOW)         │
└─────────────────────────────────────────────┘
```

### orders table
```
┌─────────────────────────────────────────────┐
│ orders                                      │
├─────────────────────────────────────────────┤
│ id (INTEGER, PK, AUTO_INCREMENT)           │
│ name (TEXT)                                │
│ email (TEXT)                               │
│ phone (TEXT)                               │
│ orderType (TEXT)                           │
│ address (TEXT)                             │
│ message (TEXT)                             │
│ total (REAL)                               │
│ status (TEXT, DEFAULT 'pending')           │
│ created_at (DATETIME, DEFAULT NOW)         │
└─────────────────────────────────────────────┘
```

### order_items table
```
┌─────────────────────────────────────────────┐
│ order_items                                 │
├─────────────────────────────────────────────┤
│ id (INTEGER, PK, AUTO_INCREMENT)           │
│ order_id (INTEGER, FK → orders.id)         │
│ product_id (INTEGER, FK → products.id)     │
│ quantity (INTEGER)                         │
│ price (REAL)                               │
└─────────────────────────────────────────────┘
```

### Relationships
```
products ←─ order_items ─→ orders
```

---

## Technology Stack

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling (including dark mode)
- **Vanilla JavaScript** - No frameworks needed
  - localStorage API
  - Fetch API
  - DOM manipulation
  - Event handling

### Backend
- **Node.js 16+** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite3** - Database
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

### Deployment
- **Render.com** - Recommended free hosting
- **Heroku** - Alternative platform
- **Your own server** - Maximum control

---

## Request/Response Examples

### Example 1: Get Products by Category

**Request:**
```http
GET /api/products/category/Cakes%20%26%20Pastries HTTP/1.1
Host: localhost:3000
```

**Response:**
```json
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

### Example 2: Create Order

**Request:**
```http
POST /api/orders HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "name": "Juan Dela Cruz",
  "email": "juan@example.com",
  "phone": "+639123456789",
  "orderType": "Delivery",
  "address": "123 Maple St, Manila",
  "message": "Extra chocolate, less sugar",
  "items": [
    {
      "product_id": 1,
      "quantity": 1,
      "price": 450
    },
    {
      "product_id": 5,
      "quantity": 2,
      "price": 95
    }
  ]
}
```

**Response:**
```json
{
  "id": 1,
  "message": "Order created successfully"
}
```

### Example 3: Update Order Status

**Request:**
```http
PUT /api/orders/1/status HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "status": "completed"
}
```

**Response:**
```json
{
  "message": "Order updated"
}
```

---

## Component Interactions

### Shopping Cart Flow
```
index.html
    ↓
script.js::addToCart()
    ↓
localStorage.setItem('cart', JSON.stringify(cart))
    ↓
script.js::updateCartCount()
    ↓
Update cart-count in header
    ↓
User clicks cart icon → cart.html loads
    ↓
cart.html renders items from localStorage
    ↓
User adjusts quantity/removes
    ↓
localStorage updated
    ↓
User clicks checkout → contact.html
    ↓
Form submission → fetch(/api/orders)
    ↓
server.js processes order
    ↓
Database updated
    ↓
Response returned → thanks.html
```

### Admin Dashboard Flow
```
admin.html loads
    ↓
script.js fetches /api/stats
    ↓
Display: total orders, revenue, products
    ↓
Admin clicks "Orders" tab
    ↓
Fetch /api/orders
    ↓
Display orders table
    ↓
Admin clicks "Edit" → Modal opens
    ↓
Admin selects new status
    ↓
PUT /api/orders/:id/status
    ↓
Database updated
    ↓
Orders table refreshed
```

---

## Security Layers

### Current Implementation
```
Browser → localStorage (client-side cache)
       → Fetch API (HTTPS ready)
       ↓
Express Server → Input validation (server-side)
              → CORS enabled
              ↓
SQLite Database → Parameterized queries
               → Foreign keys enforced
```

### Recommended for Production
```
Add:
├── Admin authentication (password/token)
├── HTTPS/SSL certificate
├── Input sanitization
├── Rate limiting
├── Error logging
├── Database encryption
└── Backup strategy
```

---

## Performance Considerations

### Client-Side
- localStorage for cart (no server calls needed)
- Lazy loading images
- CSS animations via GPU
- Minimal JavaScript (no frameworks)

### Server-Side
- SQLite is fast for small-medium workloads
- API caching possible
- Database indexing on frequently queried fields
- Connection pooling not needed for SQLite

### Optimization Tips
1. Compress images
2. Minify CSS/JS for production
3. Add database indexes
4. Implement pagination for large order lists
5. Consider caching headers

---

## Scalability Path

### Current (Good for)
- Single bakery location
- Up to ~1000 orders/month
- Manual admin management

### Growth Stage 1
- Add authentication
- Setup backups
- Move to cloud database
- Add order notifications

### Growth Stage 2
- Multiple locations
- Payment integration (Stripe, PayMongo)
- Email/SMS notifications
- Advanced analytics

### Growth Stage 3
- Microservices architecture
- Load balancing
- Advanced caching
- Machine learning recommendations

---

## File Dependencies

```
server.js
├── requires: db.js
├── requires: express
├── requires: sqlite3
└── requires: cors

db.js
└── requires: sqlite3

script.js
├── DOM elements (HTML)
├── localStorage API
├── Fetch API
└── CSS classes (styles.css)

HTML files (index, menu, etc.)
├── link: styles.css
├── script: script.js
└── images/

cart.html
├── script: script.js (inline & referenced)
├── styles.css
└── localStorage

admin.html
├── script: script.js (inline & referenced)
├── styles.css
└── Fetch API for /api endpoints

package.json
├── depends: express@4.18.2
├── depends: sqlite3@5.1.6
├── depends: cors@2.8.5
└── depends: dotenv@16.0.3
```

---

## Testing Checklist

### Functional Testing
- [ ] Products load on menu page
- [ ] Can add items to cart
- [ ] Cart persists on refresh
- [ ] Can checkout and submit order
- [ ] Admin can view orders
- [ ] Can update order status
- [ ] Can add products via admin
- [ ] Dark mode toggles correctly

### Performance Testing
- [ ] Page loads in < 2 seconds
- [ ] Cart operations instant
- [ ] API responses < 500ms
- [ ] Works on mobile devices
- [ ] No memory leaks

### Security Testing
- [ ] No sensitive data in localStorage
- [ ] API validates all inputs
- [ ] CORS working correctly
- [ ] SQL injection prevention
- [ ] XSS prevention

---

## Debugging Tips

### Check Server Logs
```bash
# Terminal shows all API calls and errors
```

### Check Browser Console
```
F12 → Console tab
See all JavaScript errors and warnings
```

### Check Network Activity
```
F12 → Network tab
See all HTTP requests/responses
```

### Check Database
```bash
node cli.js list-products
node cli.js list-orders
```

### Test API Directly
```bash
curl http://localhost:3000/api/products
curl http://localhost:3000/api/stats
```

---

**This architecture is designed to be simple yet powerful, providing a solid foundation for your bakery business!** 🍰
