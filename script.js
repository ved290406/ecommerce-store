let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// Elements
const productsDiv = document.getElementById("products");
const cartItems = document.getElementById("cartItems");
const totalSpan = document.getElementById("total");
const cartCount = document.getElementById("cartCount");

// Load Products
async function loadProducts() {
  try {
    let res = await fetch("products.json");
    products = await res.json();
    showProducts();
  } catch (err) {
    console.error("Error loading products:", err);
  }
}

// Show Products
function showProducts() {
  if (!productsDiv) return;

  let search = document.getElementById("search").value.toLowerCase();
  let filter = document.getElementById("filter").value;

  productsDiv.innerHTML = "";

  let ratings = JSON.parse(localStorage.getItem("ratings")) || {};

  let filtered = products.filter(p => {
    let matchSearch = p.name.toLowerCase().includes(search);

    let matchFilter =
      filter === "all" ||
      (filter === "low" && p.price < 1000) ||
      (filter === "mid" && p.price >= 1000 && p.price <= 2000) ||
      (filter === "high" && p.price > 2000);

    return matchSearch && matchFilter;
  });

  filtered.forEach(p => {
    let rating = ratings[p.id] || p.rating || 0;

    productsDiv.innerHTML += `
      <div class="card" onclick="openProduct(${p.id})">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <p>⭐ ${rating}</p>

        <button onclick="event.stopPropagation(); addToCart(${p.id})">Add</button>
        <button onclick="event.stopPropagation(); addToWishlist(${p.id})">❤️</button>
      </div>
    `;
  });
}

// Add to Cart
function addToCart(id) {
  let item = products.find(p => p.id === id);
  cart.push(item);
  saveCart();
}

// Remove from Cart
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
}

// Save Cart
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

// Update Cart
function updateCart() {
  if (!cartItems) return;

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    cartItems.innerHTML += `
      <li>
        <img src="${item.img}" width="40">
        ${item.name} - ₹${item.price}
        <button onclick="removeFromCart(${index})">❌</button>
      </li>
    `;
  });

  totalSpan.innerText = total;
  cartCount.innerText = cart.length;
}

// Wishlist
function addToWishlist(id) {
  if (!wishlist.includes(id)) {
    wishlist.push(id);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert("Added to wishlist ❤️");
  } else {
    alert("Already in wishlist");
  }
}

// Open Product Page
function openProduct(id) {
  localStorage.setItem("productId", id);
  window.location.href = "product.html";
}

// Product Page
if (document.getElementById("productPage")) {
  loadProducts().then(() => {
    let id = localStorage.getItem("productId");
    let product = products.find(p => p.id == id);

    document.getElementById("productPage").innerHTML = `
      <div class="card">
        <img src="${product.img}">
        <h2>${product.name}</h2>
        <p>₹${product.price}</p>

        <button onclick="addToWishlist(${product.id})">❤️ Add to Wishlist</button>

        <p>Rate:</p>
        <button onclick="rateProduct(${product.id}, 5)">⭐⭐⭐⭐⭐</button>
        <button onclick="rateProduct(${product.id}, 4)">⭐⭐⭐⭐</button>
        <button onclick="rateProduct(${product.id}, 3)">⭐⭐⭐</button>

        <br><br>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
  });
}

// Rating
function rateProduct(id, rating) {
  let ratings = JSON.parse(localStorage.getItem("ratings")) || {};
  ratings[id] = rating;

  localStorage.setItem("ratings", JSON.stringify(ratings));
  alert("Rating saved ⭐");
}

// Search + Filter
if (document.getElementById("search")) {
  document.getElementById("search").addEventListener("input", showProducts);
  document.getElementById("filter").addEventListener("change", showProducts);
}

// Auth
let isLogin = true;

function toggleAuth() {
  isLogin = !isLogin;
  document.getElementById("formTitle").innerText = isLogin ? "Login" : "Signup";
}

function handleAuth() {
  let user = document.getElementById("username").value;
  let pass = document.getElementById("password").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (isLogin) {
    let found = users.find(u => u.username === user && u.password === pass);
    if (found) {
      alert("Login success");
      window.location.href = "index.html";
    } else {
      alert("Invalid login");
    }
  } else {
    users.push({ username: user, password: pass });
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup success");
  }
}

// Checkout
function goToCheckout() {
  window.location.href = "checkout.html";
}

// Place Order
function placeOrder() {
  let nameInput = document.getElementById("name");
  let addressInput = document.getElementById("address");
  let phoneInput = document.getElementById("phone");

  let name = nameInput ? nameInput.value.trim() : "";
  let address = addressInput ? addressInput.value.trim() : "";
  let phone = phoneInput ? phoneInput.value.trim() : "";

  // DEBUG (optional)
  console.log(name, address, phone);

  if (!name || !address || !phone) {
    alert("⚠️ Please fill all details before placing order!");
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("🛒 Cart is empty!");
    return;
  }

  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  orders.push({
    items: cart,
    user: { name, address, phone },
    date: new Date().toLocaleString()
  });

  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.removeItem("cart");

  window.location.href = "success.html";
}
// Orders Page
if (document.getElementById("orders")) {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let html = "";

  orders.forEach(order => {
    html += `<div class="card">
      <h3>${order.date}</h3>`;

    order.items.forEach(item => {
      html += `
        <p>
          <img src="${item.img}" width="40">
          ${item.name} - ₹${item.price}
        </p>
      `;
    });

    html += "</div>";
  });

  document.getElementById("orders").innerHTML = html;
}

// Wishlist Page
if (document.getElementById("wishlist")) {
  loadProducts().then(() => {
    let wishlistIds = JSON.parse(localStorage.getItem("wishlist")) || [];
    let html = "";

    wishlistIds.forEach((id, index) => {
      let product = products.find(p => p.id == id);

      if (product) {
        html += `
          <div class="card">
            <img src="${product.img}">
            <h3>${product.name}</h3>
            <p>₹${product.price}</p>

            <button onclick="removeFromWishlist(${index})">❌ Remove</button>
          </div>
        `;
      }
    });

    document.getElementById("wishlist").innerHTML = html;
  });
}

function updateWishlistCount() {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  let countEl = document.getElementById("wishlistCount");

  if (countEl) {
    countEl.innerText = wishlist.length;
  }
}

function addToWishlist(id) {
  if (!wishlist.includes(id)) {
    wishlist.push(id);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistCount();
    alert("Added to wishlist ❤️");
  } else {
    alert("Already in wishlist");
  }
}

// refresh page
function removeFromWishlist(index) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlist.splice(index, 1);

  localStorage.setItem("wishlist", JSON.stringify(wishlist));

  location.reload(); // refresh page
}
// Dashboard
if (document.getElementById("totalOrders")) {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let totalSpent = 0;

  orders.forEach(order => {
    order.items.forEach(item => {
      totalSpent += item.price;
    });
  });

  document.getElementById("totalOrders").innerText = orders.length;
  document.getElementById("totalSpent").innerText = totalSpent;
}
function goHome() {
  window.location.href = "index.html";
}
// Init
loadProducts();
updateCart();
updateWishlistCount();
if (cartItems) {
  updateCart();
}