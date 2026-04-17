/* ===============================
   GLOBAL DATA
================================ */

let products = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

/* ===============================
   LOAD PRODUCTS
================================ */

async function loadProducts() {
  try {
    let res = await fetch("products.json");
    products = await res.json();
    showProducts();
  } catch (err) {
    console.error("Error:", err);
  }
}

/* ===============================
   SHOW PRODUCTS
================================ */

function showProducts() {
  const container = document.getElementById("products");
  if (!container) return;

  container.innerHTML = "";

  products.forEach((p, index) => {
    container.innerHTML += `
      <div class="card" onclick="openProduct(${index})">
        <img src="${p.img}" onerror="this.src='https://via.placeholder.com/200'">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>

        <button onclick="event.stopPropagation(); addToCart(${index})">
          Add
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
  const container = document.getElementById("productPage");
  if (!container) return;

  const product = JSON.parse(localStorage.getItem("selectedProduct"));
  if (!product) return;

  container.innerHTML = `
    <div class="product-wrapper">
      <img src="${product.img}" onerror="this.src='https://via.placeholder.com/300'">

      <div>
        <h2>${product.name}</h2>
        <p class="price">₹${product.price}</p>

        <button onclick="addToCartFromProduct()">Add to Cart</button>
        <button onclick="buyNow()">Buy Now</button>
      </div>
    </div>
  `;
}

function addToCartFromProduct() {
  const product = JSON.parse(localStorage.getItem("selectedProduct"));
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Added to cart");
}

function buyNow() {
  const product = JSON.parse(localStorage.getItem("selectedProduct"));
  localStorage.setItem("cart", JSON.stringify([product]));
  window.location.href = "checkout.html";
}

/* ===============================
   CART
================================ */

function addToCart(index) {
  cart.push(products[index]);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

function updateCart() {
  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("total");
  const count = document.getElementById("cartCount");

  cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (count) count.innerText = cart.length;
  if (!container) return;

  container.innerHTML = "";

  let total = 0;

  cart.forEach((item, i) => {
    total += item.price;

    container.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}">
        <div>
          <h3>${item.name}</h3>
          <p>₹${item.price}</p>
        </div>
        <button onclick="removeFromCart(${i})">Remove</button>
      </div>
    `;
  });

  if (totalEl) totalEl.innerText = total;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCart();
}

/* ===============================
   CHECKOUT
================================ */

function placeOrder() {

  if (!validateCheckout()) return;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let paymentMethod = document.querySelector('input[name="payment"]:checked');

  if (!paymentMethod) {
    alert("Select payment method ❌");
    return;
  }

  let order = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    items: cart,
    status: "Processing",
    step: 1,

    // 🔥 NEW
    paymentStatus: paymentMethod.value === "COD" ? "Unpaid ❌" : "Paid ✅",
    paymentMethod: paymentMethod.value
  };

  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);

  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.removeItem("cart");

  alert("Order Placed Successfully 🎉");

  window.location.href = "orders.html";
}
function validateCheckout() {
  let name = document.getElementById("name").value.trim();
  let address = document.getElementById("address").value.trim();
  let phone = document.getElementById("phone").value.trim();

  if (!name || !address || !phone) {
    alert("⚠️ Please fill all details before placing order");
    return false;
  }

  // Phone validation (simple)
  if (!/^[0-9]{10}$/.test(phone)) {
    alert("📱 Enter valid 10-digit phone number");
    return false;
  }

  return true;
}
/* ===============================
   ORDERS
================================ */

function loadOrders() {
  html += `order'
  <div class="order-card">

    <h3>📅 ${order.date}</h3>

    <p class="status">🚚 ${order.status}</p>

    <!-- 🔥 PAYMENT INFO -->
    <p class="payment">
      💳 Payment: ${order.paymentMethod}
    </p>

    <p class="payment-status 
      ${order.paymentStatus.includes('Paid') ? 'paid' : 'unpaid'}">
      ${order.paymentStatus}
    </p>

    ${getTrackingUI(order.step)}
`;
function getTrackingUI(step) {

  return `
    <div style="margin:10px 0;">
      <span ${step>=1 ? "style='color:green'" : ""}>● Processing</span> →
      <span ${step>=2 ? "style='color:green'" : ""}>● Shipped</span> →
      <span ${step>=3 ? "style='color:green'" : ""}>● Delivered</span>
    </div>
  `;
}
  const container = document.getElementById("orders");
  if (!container) return;

  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  if (orders.length === 0) {
    container.innerHTML = "<h3>No Orders Yet 😢</h3>";
    return;
  }

  container.innerHTML = "";

  orders.forEach((order, orderIndex) => {

    container.innerHTML += `
      <div class="order-card">

        <h3>📅 ${order.date}</h3>
        <p class="status">🚚 Status: ${order.status}</p>

        ${order.items.map((item, i) => `
          
          <div class="order-item">

            <img src="${item.img}" 
                 onerror="this.src='https://via.placeholder.com/80'">

            <div>
              <h4>${item.name}</h4>
              <p>₹${item.price}</p>

              <!-- REVIEW -->
              <textarea id="review-${orderIndex}-${i}" placeholder="Write review..."></textarea>

              <select id="rating-${orderIndex}-${i}">
                <option>⭐</option>
                <option>⭐⭐</option>
                <option>⭐⭐⭐</option>
                <option>⭐⭐⭐⭐</option>
                <option>⭐⭐⭐⭐⭐</option>
              </select>

              <button onclick="submitReview(${orderIndex}, ${i})">
                Submit Review
              </button>

              <p class="review-text" id="reviewText-${orderIndex}-${i}"></p>

            </div>

          </div>

        `).join("")}

      </div>
    `;
  });

  loadSavedReviews();
}

/* ===============================
   REVIEW SYSTEM (NEW FEATURE)
================================ */
function submitReview(orderIndex, itemIndex) {

  let text = document.getElementById(`review-${orderIndex}-${itemIndex}`).value;
  let rating = document.getElementById(`rating-${orderIndex}-${itemIndex}`).value;

  if (!text) {
    alert("Write something first ✍️");
    return;
  }

  let reviews = JSON.parse(localStorage.getItem("reviews")) || {};

  let key = `${orderIndex}-${itemIndex}`;

  reviews[key] = {
    text,
    rating
  };

  localStorage.setItem("reviews", JSON.stringify(reviews));

  loadSavedReviews();
}
function loadSavedReviews() {

  let reviews = JSON.parse(localStorage.getItem("reviews")) || {};

  Object.keys(reviews).forEach(key => {

    let el = document.getElementById(`reviewText-${key}`);

    if (el) {
      el.innerHTML = `
        ${reviews[key].rating} - ${reviews[key].text}
      `;
    }

  });
}
/* ===============================
   NAVIGATION
================================ */

function openCart() {
  window.location.href = "cart.html";
}


/* ===============================
   INIT
================================ */

window.onload = () => {
  loadProducts();
  updateCart();
  loadProductPage();
  loadOrders();
};
// NAVIGATION FUNCTIONS

function goHome() {
  window.location.href = "index.html";
}

function goToCheckout() {
  window.location.href = "checkout.html";
}
setTimeout(() => {

  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  orders.forEach(order => {
    order.status = "Delivered ✅";
  });

  localStorage.setItem("orders", JSON.stringify(orders));

}, 10000); // 10 sec later delivered
function showLoader(show) {
  const loader = document.getElementById("loader");
  if (!loader) return;
  loader.style.display = show ? "flex" : "none";
}

async function loadProducts() {
  try {
    showLoader(true);
    let res = await fetch("products.json");
    products = await res.json();
    showProducts();
  } catch (err) {
    console.error(err);
  } finally {
    showLoader(false);
  }
}
function startTracking(orderId) {

  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  let index = orders.findIndex(o => o.id === orderId);

  if (index === -1) return;

  // After 5 sec → Shipped
  setTimeout(() => {
    orders[index].status = "Shipped 🚚";
    orders[index].step = 2;
    localStorage.setItem("orders", JSON.stringify(orders));
  }, 5000);

  // After 10 sec → Delivered
  setTimeout(() => {
    orders[index].status = "Delivered ✅";
    orders[index].step = 3;
    localStorage.setItem("orders", JSON.stringify(orders));
  }, 10000);
  let generatedOTP = "";
}
function startPayment() {

  let total = 0;
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.forEach(item => total += item.price);

  // Fake popup
  let confirmPay = confirm(`Pay ₹${total} using Razorpay?`);

  if (!confirmPay) return;

  // simulate success
  setTimeout(() => {
    alert("Payment Successful 💳");
    placeOrder();
  }, 1500);
}