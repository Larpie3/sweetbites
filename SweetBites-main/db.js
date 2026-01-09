export function initializeDatabase(db) {
  db.serialize(() => {
    // Products table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Orders table
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        orderType TEXT NOT NULL,
        address TEXT,
        message TEXT,
        total REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Order items table
    db.run(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      )
    `);
  });
}

export function seedDatabase(db) {
  db.get("SELECT COUNT(*) as count FROM products", (err, result) => {
    if (err || result.count > 0) return; // Already seeded

    const products = [
      {
        name: 'Chocolate Fudge Cake',
        description: '8-inch with rich ganache',
        price: 450,
        category: 'Cakes & Pastries',
        image: 'images/Chocolate Fudge Cake.jpg',
      },
      {
        name: 'Red Velvet Slice',
        description: 'Cream cheese frosting, tender crumb',
        price: 120,
        category: 'Cakes & Pastries',
        image: 'images/Red Velvet.jpg',
      },
      {
        name: 'Strawberry Cheesecake Bites',
        description: 'Creamy, bite-sized',
        price: 85,
        category: 'Cakes & Pastries',
        image: 'images/Cheesecake Bites.jpg',
      },
      {
        name: 'Ube Macapuno Cupcake',
        description: 'Made-to-order boxes of 6',
        price: 420,
        category: 'Cakes & Pastries',
        image: 'images/Ube Macapuno Cupcake.jpg',
      },
      {
        name: 'Iced Coffee',
        description: 'Cold brew with milk and caramel',
        price: 95,
        category: 'Drinks & Beverages',
        image: 'images/Iced Coffee.jpg',
      },
      {
        name: 'Hot Chocolate',
        description: 'Rich cocoa with whipped cream',
        price: 80,
        category: 'Drinks & Beverages',
        image: 'images/Hot Chocolate.jpg',
      },
      {
        name: 'Mango Smoothie',
        description: 'Fresh mango with yogurt',
        price: 110,
        category: 'Drinks & Beverages',
        image: 'images/Mango Smoothie.jpg',
      },
    ];

    products.forEach((product) => {
      db.run(
        'INSERT OR IGNORE INTO products (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)',
        [product.name, product.description, product.price, product.category, product.image]
      );
    });

    console.log('Database seeded with initial products');
  });
}
