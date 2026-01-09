// ==================== CONFIGURATION ====================
const API_URL = 'http://localhost:3000/api';

// ==================== THEME TOGGLE & ANIMATIONS ====================
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const currentTheme = localStorage.getItem("theme") || "light";
  document.body.classList.toggle("dark-theme", currentTheme === "dark");
  themeToggle.textContent = currentTheme === "dark" ? "Light" : "Dark";

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const newTheme = document.body.classList.contains("dark-theme") ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    themeToggle.textContent = newTheme === "dark" ? "Light" : "Dark";
  });

  // Fade-up animation on scroll
  const fadeUps = document.querySelectorAll(".fade-up");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.2 }
  );
  fadeUps.forEach((el) => observer.observe(el));

  // Update cart count
  updateCartCount();

  // Load dynamic products if on menu page
  if (document.getElementById('cakes-container')) {
    loadProductsByCategory('Cakes & Pastries', 'cakes-container');
    loadProductsByCategory('Drinks & Beverages', 'drinks-container');
  }
});

// ==================== CART MANAGEMENT ====================
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) {
    cartCountEl.textContent = count;
  }
}

function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  alert(`${product.name} added to cart!`);
}

// ==================== DYNAMIC PRODUCT LOADING ====================
async function loadProductsByCategory(category, containerId) {
  try {
    const response = await fetch(`${API_URL}/products/category/${encodeURIComponent(category)}`);
    if (!response.ok) {
      console.warn(`Products for ${category} not available. Using static data.`);
      return;
    }

    const products = await response.json();
    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = products.map(product => `
      <article class="card pop">
        <img src="${product.image}" alt="${product.name}">
        <div class="card-body">
          <h3>${product.name}</h3>
          <p class="muted">${product.description}</p>
          <p class="price">₱${product.price.toFixed(2)}</p>
          <button onclick="addToCart({id: '${product.id}', name: '${product.name}', price: ${product.price}, image: '${product.image}'})" class="btn" style="width: 100%; margin-top: 10px;">Add to Cart</button>
        </div>
      </article>
    `).join('');
  } catch (error) {
    console.error(`Error loading products for ${category}:`, error);
  }
}

// ==================== CONTACT FORM HANDLER ====================
(function () {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  function showStatus(msg, color = 'crimson') {
    if (!status) return alert(msg);
    status.style.color = color;
    status.textContent = msg;
  }

  function isLocalPhoneValid(v) {
    if (!v) return false;
    const digits = v.replace(/\D/g, '');
    return /^[9]\d{9}$/.test(digits);
  }

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const phoneRaw = form.querySelector('[name="phone"]').value.trim();
    const orderType = form.querySelector('[name="orderType"]').value.trim();
    const message = form.querySelector('[name="message"]').value.trim();
    const captcha = form.querySelector('#captcha').value.trim();

    if (!name || !email || !phoneRaw || !orderType || !message) {
      showStatus('Please complete all required fields.');
      return;
    }

    if (!isLocalPhoneValid(phoneRaw)) {
      showStatus('Phone must be 10 digits and start with 9 (e.g., 9123456789).');
      return;
    }

    if (captcha.replace(/\s+/g, '').toUpperCase() !== 'SWEET') {
      showStatus('Captcha word is incorrect. Please type SWEET exactly.');
      return;
    }

    const fullPhone = '+63' + phoneRaw.replace(/\D/g, '');
    
    // Get cart items if available
    const cartItems = JSON.parse(localStorage.getItem('checkout-items')) || [];
    const items = cartItems.length > 0 ? cartItems.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      price: item.price
    })) : [{
      product_id: null,
      quantity: 1,
      price: 0
    }];

    showStatus('⏳ Sending your order...', 'blue');

    try {
      // Send to backend
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: fullPhone,
          orderType,
          address: form.querySelector('[name="address"]')?.value || '',
          message,
          items
        })
      });

      if (!response.ok) {
        throw new Error('Order submission failed');
      }

      const result = await response.json();
      showStatus('✅ Order sent successfully!', 'green');
      form.reset();
      localStorage.removeItem('cart');
      localStorage.removeItem('checkout-items');
      updateCartCount();

      setTimeout(() => {
        window.location.href = 'thanks.html';
      }, 1500);
    } catch (err) {
      console.error(err);
      showStatus('⚠️ There was an error sending your order. Please try again.');
    }
  });
})();


