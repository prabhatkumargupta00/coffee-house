const swiper = new Swiper(".swiper", {
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  effect: "fade",
  loop: true,

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

let menu = document.querySelector(".menu");
let nums = document.querySelectorAll(".num");
let start = false;

window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  navbar.classList.toggle("sticky", window.scrollY > 0);

  if (window.scrollY >= menu.offsetTop) {
    if (!start) {
      nums.forEach((num) => {
        startCount(num);
      });
    }
    start = true;
  }
});

const startCount = (el) => {
  let max = el.dataset.val;
  let count = setInterval(() => {
    el.textContent++;
    if (el.textContent === max) {
      clearInterval(count);
    }
  }, 2000 / nums);
};

// Form Validation and Toast Notification
const bookingForm = document.getElementById("booking-form");
const toast = document.getElementById("toast");

if (bookingForm) {
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent page reload

    // At this point, HTML5 validation (required) has passed.
    // In a real app, you would send this data to a backend server via fetch/axios here.

    // Show success toast
    toast.classList.add("show");

    // Hide toast after 3.5 seconds
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3500);

    // Optional: Reset form fields
    bookingForm.reset();
  });
}

// Dynamic Footer Year
const yearSpan = document.getElementById("current-year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Cart Functionality
const cartIcon = document.getElementById("cart-icon");
const cartBadge = document.getElementById("cart-badge");
const cartDrawer = document.getElementById("cart-drawer");
const cartOverlay = document.getElementById("cart-overlay");
const closeCartBtn = document.getElementById("close-cart");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalPrice = document.getElementById("cart-total-price");
const addToCartBtns = document.querySelectorAll(".add-to-cart-btn");

let cart = [];

// Open Cart
if (cartIcon) {
  cartIcon.addEventListener("click", (e) => {
    e.preventDefault();
    cartDrawer.classList.add("show");
    cartOverlay.classList.add("show");
  });
}

// Close Cart
const closeCart = () => {
  cartDrawer.classList.remove("show");
  cartOverlay.classList.remove("show");
};

if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

// Add item to cart
addToCartBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    const name = e.target.getAttribute("data-name");
    const price = parseInt(e.target.getAttribute("data-price"));

    // Check if item already exists
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    // Show toast for feedback
    const toastMsg = document.getElementById("toast-message");
    if (toastMsg && toast) {
      toastMsg.textContent = `${name} added to cart!`;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2500);
    }

    updateCartUI();
  });
});

// Update UI
const updateCartUI = () => {
  // Update badge
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartBadge.textContent = totalItems;

  // Render items
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const itemEl = document.createElement("div");
    itemEl.classList.add("cart-item");
    itemEl.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.name} (x${item.quantity})</h4>
        <p>₹${item.price * item.quantity}</p>
      </div>
      <button class="remove-item" data-index="${index}">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  // Update total
  cartTotalPrice.textContent = `₹${total}`;

  // Add remove listeners
  const removeBtns = document.querySelectorAll(".remove-item");
  removeBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      // Find the closest button in case the icon was clicked
      const button = e.target.closest('.remove-item');
      if (button) {
        const index = button.getAttribute("data-index");
        cart.splice(index, 1);
        updateCartUI();
      }
    });
  });
};

// Checkout
const checkoutBtn = document.getElementById("checkout-btn");
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      // Cart is empty
      const toastMsg = document.getElementById("toast-message");
      if (toastMsg && toast) {
        toastMsg.textContent = "Your cart is empty!";
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2500);
      }
      return;
    }

    // Process checkout
    cart = []; // Empty cart
    updateCartUI(); // Re-render empty cart
    closeCart(); // Close the drawer

    // Show success toast
    const toastMsg = document.getElementById("toast-message");
    if (toastMsg && toast) {
      toastMsg.textContent = "Order placed successfully! Enjoy your coffee.";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2500);
    }
  });
}
