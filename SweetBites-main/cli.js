#!/usr/bin/env node

/**
 * SweetBites CLI Utility
 * Helpful commands for managing your bakery website
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = './sweetbites.db';
const commands = {
  'reset-db': resetDatabase,
  'list-products': listProducts,
  'list-orders': listOrders,
  'add-product': addProductCLI,
  'help': showHelp
};

const args = process.argv.slice(2);
const command = args[0] || 'help';

if (commands[command]) {
  commands[command](args.slice(1));
} else {
  console.error(`Unknown command: ${command}`);
  showHelp();
  process.exit(1);
}

// ==================== COMMANDS ====================

function showHelp() {
  console.log(`
╔════════════════════════════════════════╗
║     🍰 SweetBites CLI Utility          ║
╚════════════════════════════════════════╝

Usage: node cli.js [command] [options]

Commands:

  reset-db              Reset database to initial state
  list-products         Show all products
  list-orders           Show all orders
  add-product           Add a new product interactively
  help                  Show this help message

Examples:

  node cli.js reset-db
  node cli.js list-products
  node cli.js list-orders
  node cli.js add-product

For more information, check QUICKSTART.md or FEATURES.md
  `);
}

function resetDatabase() {
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('✅ Database reset successful');
    console.log('📝 Restart the server to reload with seed data: npm start');
  } else {
    console.log('ℹ️  Database doesn\'t exist yet');
  }
}

function listProducts() {
  const db = new sqlite3.Database(dbPath);
  
  db.all('SELECT id, name, category, price FROM products ORDER BY category, name', (err, rows) => {
    if (err) {
      console.error('❌ Error:', err.message);
      process.exit(1);
    }

    if (!rows || rows.length === 0) {
      console.log('No products found. Start the server first to initialize the database.');
      process.exit(0);
    }

    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║            📦 PRODUCT INVENTORY               ║');
    console.log('╚════════════════════════════════════════════════╝\n');

    let currentCategory = '';
    rows.forEach(product => {
      if (product.category !== currentCategory) {
        currentCategory = product.category;
        console.log(`\n${currentCategory}:`);
        console.log('─'.repeat(50));
      }
      console.log(`  [${product.id}] ${product.name.padEnd(35)} ₱${product.price.toFixed(2)}`);
    });

    console.log(`\n${'─'.repeat(50)}`);
    console.log(`Total: ${rows.length} products\n`);
    db.close();
  });
}

function listOrders() {
  const db = new sqlite3.Database(dbPath);
  
  db.all(`
    SELECT id, name, orderType, total, status, 
           datetime(created_at) as date 
    FROM orders 
    ORDER BY created_at DESC
  `, (err, rows) => {
    if (err) {
      console.error('❌ Error:', err.message);
      process.exit(1);
    }

    if (!rows || rows.length === 0) {
      console.log('\n📭 No orders yet\n');
      process.exit(0);
    }

    console.log('\n╔════════════════════════════════════════════════╗');
    console.log('║              📋 RECENT ORDERS                 ║');
    console.log('╚════════════════════════════════════════════════╝\n');

    rows.forEach(order => {
      const statusEmoji = {
        'pending': '⏳',
        'completed': '✅',
        'cancelled': '❌'
      }[order.status] || '❓';

      console.log(`Order #${order.id} - ${order.name}`);
      console.log(`  Type: ${order.orderType} | Total: ₱${order.total.toFixed(2)}`);
      console.log(`  Status: ${statusEmoji} ${order.status} | Date: ${order.date}`);
      console.log('');
    });

    db.close();
  });
}

function addProductCLI(args) {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  function ask(question) {
    return new Promise(resolve => {
      rl.question(question, resolve);
    });
  }

  (async () => {
    try {
      console.log('\n🍰 Add New Product\n');
      
      const name = await ask('Product name: ');
      const description = await ask('Description: ');
      const price = parseFloat(await ask('Price (₱): '));
      const categories = ['Cakes & Pastries', 'Drinks & Beverages', 'Other'];
      
      console.log('\nCategories:');
      categories.forEach((cat, i) => console.log(`  ${i + 1}. ${cat}`));
      const catChoice = parseInt(await ask('Select category (1-3): ')) - 1;
      const category = categories[catChoice] || 'Other';
      
      const image = await ask('Image path (e.g., images/product.jpg): ');

      // Add to database
      const db = new sqlite3.Database(dbPath);
      db.run(
        'INSERT INTO products (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)',
        [name, description, price, category, image],
        function(err) {
          if (err) {
            console.error('\n❌ Error adding product:', err.message);
          } else {
            console.log(`\n✅ Product added successfully! (ID: ${this.lastID})`);
          }
          db.close();
          rl.close();
        }
      );
    } catch (err) {
      console.error('Error:', err);
      rl.close();
      process.exit(1);
    }
  })();
}
