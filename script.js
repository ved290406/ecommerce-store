let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productsDiv = document.getElementById("products");
const cartItems = document.getElementById("cartItems");
const totalSpan = document.getElementById("total");
const cartCount = document.getElementById("cartCount");

// Load JSON
async function loadProducts() {
  let res = await fetch("products.json");
  products = await res.json();
  showProducts();
}

// Show Products
function showProducts() {
  if (!productsDiv) return;

  let search = document.getElementById("search").value.toLowerCase();
  let filter = document.getElementById("filter").value;

  productsDiv.innerHTML = "";

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
    productsDiv.innerHTML += `
      <div class="card" onclick="openProduct(${p.id})">
        <img src="${p.img}">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="event.stopPropagation(); addToCart(${p.id})">Add</button>
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

// Remove
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
}

// Save
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
        ${item.name} - ₹${item.price}
        <button onclick="removeFromCart(${index})">❌</button>
      </li>
    `;
  });

  totalSpan.innerText = total;
  cartCount.innerText = cart.length;
}

// Open Product Page
function openProduct(id) {
  localStorage.setItem("productId", id);
  window.location.href = "product.html";
}

// Product Page Load
if (document.getElementById("productPage")) {
  loadProducts().then(() => {
    let id = localStorage.getItem("productId");
    let product = products.find(p => p.id == id);

    document.getElementById("productPage").innerHTML = `
      <div class="card">
        <img src="${product.img}">
        <h2>${product.name}</h2>
        <p>₹${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
  });
}

// Events
if (document.getElementById("search")) {
  document.getElementById("search").addEventListener("input", showProducts);
  document.getElementById("filter").addEventListener("change", showProducts);
}

// Init
loadProducts();
updateCart();
let isLogin = true;

function toggleAuth() {
  isLogin = !isLogin;
  document.getElementById("formTitle").innerText = isLogin ? "Login" : "Signup";
}

function handleAuth() {
  let user = document.getElementById("username").value;
  let pass = document.getElementById("password").value;

  if (isLogin) {
    let savedUser = JSON.parse(localStorage.getItem("user"));

    if (savedUser && savedUser.username === user && savedUser.password === pass) {
      alert("Login successful");
      window.location.href = "index.html";
    } else {
      alert("Invalid credentials");
    }
  } else {
    localStorage.setItem("user", JSON.stringify({ username: user, password: pass }));
    alert("Signup successful");
  }
}
function placeOrder() {
  alert("🎉 Order placed successfully!");
  localStorage.removeItem("cart");
  window.location.href = "index.html";
}function goToCheckout() {
  window.location.href = "checkout.html";
}
document.getElementById("search").addEventListener("input", showProducts);
document.getElementById("filter").addEventListener("change", showProducts);