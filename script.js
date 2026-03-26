/* ===============================
   GLOBAL VARIABLES
================================ */

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];


/* ===============================
   LOAD PRODUCTS (Home Page)
================================ */

async function loadProducts() {
  try {
    let res = await fetch("products.json");
    products = await res.json();
    showProducts();
  } catch (err) {
    console.error("Error loading products:", err);
  }
}


/* ===============================
   SHOW PRODUCTS (Home Page)
================================ */

function showProducts() {

  const productsDiv = document.getElementById("products");
  if (!productsDiv) return;

  let search = document.getElementById("search")?.value.toLowerCase() || "";
  let filter = document.getElementById("filter")?.value || "all";

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

  filtered.forEach((p, index) => {

    productsDiv.innerHTML += `
      <div class="card" onclick="openProduct(${index})">

        <img src="${p.img}" onerror="this.src='https://via.placeholder.com/200'">

        <h3>${p.name}</h3>

        <p>₹${p.price}</p>

        <button onclick="event.stopPropagation(); addToCart(${index})">
        Add to Cart
        </button>

        <button onclick="event.stopPropagation(); addToWishlist(${index})">
        ❤️
        </button>

      </div>
    `;

  });

}


/* ===============================
   PRODUCT PAGE
================================ */

function openProduct(index) {

  localStorage.setItem("selectedProduct", JSON.stringify(products[index]));

  window.location.href = "product.html";

}


function loadProductPage() {

  const product = JSON.parse(localStorage.getItem("selectedProduct"));

  if (!product) return;

  const container = document.getElementById("productPage");

  container.innerHTML = `
    <div class="product-details">

      <img id="mainImg" src="${product.img}">

      <h2>${product.name}</h2>

      <p>Price : ₹${product.price}</p>

      <button onclick="addToCartFromProduct()">Add To Cart</button>

      <button onclick="addToWishlistFromProduct()">❤️ Wishlist</button>

    </div>
  `;

}


function addToCartFromProduct() {

  const product = JSON.parse(localStorage.getItem("selectedProduct"));

  cart.push(product);

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Added to Cart");

  updateCart();

}


function addToWishlistFromProduct() {

  const product = JSON.parse(localStorage.getItem("selectedProduct"));

  wishlist.push(product);

  localStorage.setItem("wishlist", JSON.stringify(wishlist));

  alert("Added to Wishlist");

  updateWishlistCount();

}


/* ===============================
   CART PAGE
================================ */

function addToCart(index) {

  let product = products[index];

  cart.push(product);

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCart();

}


function updateCart() {

  const container = document.getElementById("cartItems");
  const totalSpan = document.getElementById("total");
  const cartCount = document.getElementById("cartCount");

  cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cartCount) cartCount.innerText = cart.length;

  if (!container) return;

  container.innerHTML = "";

  if (cart.length === 0) {

    container.innerHTML = "<h3>Your cart is empty 😢</h3>";

    if (totalSpan) totalSpan.innerText = 0;

    return;

  }

  let total = 0;

  cart.forEach((item, index) => {

    total += item.price;

    container.innerHTML += `
      <div class="cart-item">

        <img src="${item.img}" width="80">

        <div>
          <h3>${item.name}</h3>
          <p>₹${item.price}</p>
        </div>

        <button onclick="removeFromCart(${index})">
        Remove
        </button>

      </div>
    `;

  });

  if (totalSpan) totalSpan.innerText = total;

}


function removeFromCart(index) {

  cart.splice(index, 1);

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCart();

}


/* ===============================
   WISHLIST
================================ */

function addToWishlist(index) {

  let product = products[index];

  wishlist.push(product);

  localStorage.setItem("wishlist", JSON.stringify(wishlist));

  alert("Added to Wishlist ❤️");

  updateWishlistCount();

}


function updateWishlistCount() {

  const countEl = document.getElementById("wishlistCount");

  if (!countEl) return;

  countEl.innerText = wishlist.length;

}


/* ===============================
   CHECKOUT
================================ */

function goToCheckout() {

  window.location.href = "checkout.html";

}


function placeOrder() {

  if (cart.length === 0) {

    alert("Cart is empty");

    return;

  }

  let order = {

    date: new Date().toLocaleString(),

    items: cart

  };

  orders.push(order);

  localStorage.setItem("orders", JSON.stringify(orders));

  localStorage.removeItem("cart");

  cart = [];

  alert("Order Placed Successfully 🎉");

  window.location.href = "orders.html";

}


/* ===============================
   ORDERS PAGE
================================ */

function loadOrders() {

  const container = document.getElementById("orders");

  if (!container) return;

  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  if (orders.length === 0) {

    container.innerHTML = "<h3>No Orders Yet</h3>";

    return;

  }

  let html = "";

  orders.forEach(order => {

    html += `
      <div class="card">

        <h3>Order Date : ${order.date}</h3>
    `;

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

  container.innerHTML = html;

}


/* ===============================
   NAVIGATION FUNCTIONS
================================ */

function openCart() {
  window.location.href = "cart.html";
}

function goHome() {
  window.location.href = "index.html";
}


/* ===============================
   PAGE INIT
================================ */

window.addEventListener("DOMContentLoaded", () => {

  loadProducts();

  updateCart();

  updateWishlistCount();

  loadProductPage();

  loadOrders();

});