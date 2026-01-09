#!/bin/bash
# SweetBites Quick Start Script

echo "🍰 SweetBites - Dynamic Bakery Website"
echo "====================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Installation complete!"
echo ""
echo "🚀 Starting server..."
echo ""
echo "════════════════════════════════════════"
echo "Server running at: http://localhost:3000"
echo "════════════════════════════════════════"
echo ""
echo "📖 Available Pages:"
echo "  - Home: http://localhost:3000"
echo "  - Menu: http://localhost:3000/menu"
echo "  - Cart: http://localhost:3000/cart"
echo "  - Admin: http://localhost:3000/admin"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
