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

  let search = document.getElementById("search")?.value.toLowerCase() || "";
  let filter = document.getElementById("filter")?.value || "all";

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

// Cart
function addToCart(id) {
  let item = products.find(p => p.id === id);
  cart.push(item);
  saveCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

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

  if (totalSpan) totalSpan.innerText = total;
  if (cartCount) cartCount.innerText = cart.length;
}

// Wishlist
function addToWishlist(id) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  if (!wishlist.includes(id)) {
    wishlist.push(id);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    updateWishlistCount();
    alert("Added to wishlist ❤️");
  } else {
    alert("Already in wishlist");
  }
}

function removeFromWishlist(index) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  wishlist.splice(index, 1);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
  location.reload();
}

function updateWishlistCount() {
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  let countEl = document.getElementById("wishlistCount");
  if (countEl) countEl.innerText = wishlist.length;
}

// Product Page
function openProduct(id) {
  localStorage.setItem("productId", id);
  window.location.href = "product.html";
}

if (document.getElementById("productPage")) {
  loadProducts().then(() => {
    let id = localStorage.getItem("productId");
    let product = products.find(p => p.id == id);

    document.getElementById("productPage").innerHTML = `
      <div class="card">
        <img id="mainImg" src="${product.img}">

        <div>
          ${product.images ? product.images.map(img => `
            <img src="${img}" width="50" onclick="changeImage('${img}')">
          `).join("") : ""}
        </div>

        <h2>${product.name}</h2>
        <p>₹${product.price}</p>

        <button onclick="addToWishlist(${product.id})">❤️</button>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
  });
}

function changeImage(src) {
  document.getElementById("mainImg").src = src;
}

// Search Suggestion
let searchInput = document.getElementById("search");
let suggestionsDiv = document.getElementById("suggestions");

if (searchInput && suggestionsDiv) {
  searchInput.addEventListener("input", () => {
    let value = searchInput.value.toLowerCase();
    suggestionsDiv.innerHTML = "";

    if (!value) return;

    let matches = products.filter(p =>
      p.name.toLowerCase().includes(value)
    );

    matches.slice(0, 5).forEach(p => {
      suggestionsDiv.innerHTML += `
        <div onclick="openProduct(${p.id})">${p.name}</div>
      `;
    });
  });
}

// Checkout
function goToCheckout() {
  window.location.href = "checkout.html";
}

function placeOrder() {
  let name = document.getElementById("name")?.value.trim();
  let address = document.getElementById("address")?.value.trim();
  let phone = document.getElementById("phone")?.value.trim();
  let payment = document.querySelector('input[name="payment"]:checked');

  if (!name || !address || !phone) {
    alert("⚠️ Fill all details!");
    return;
  }

  if (!payment) {
    alert("💳 Select payment method!");
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Cart empty!");
    return;
  }

  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  orders.push({
    items: cart,
    user: { name, address, phone },
    payment: payment.value,
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
    html += `<div class="card"><h3>${order.date}</h3>`;
    order.items.forEach(item => {
      html += `<p><img src="${item.img}" width="40"> ${item.name} - ₹${item.price}</p>`;
    });
    html += "</div>";
  });

  document.getElementById("orders").innerHTML = html;
}

// Init
loadProducts();
updateCart();
updateWishlistCount();