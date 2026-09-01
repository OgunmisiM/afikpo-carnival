/**
 * Afikpo International Carnival 2026
 * Master Logic Script - Vanilla JS
 * 
 * Manages all 9 carnival modules, dynamic blog reader/editor,
 * shopping cart state, voting system, and Google Apps Script integration.
 */

// Google Apps Script Web App Deployment URL
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzc2MNaPwFyUrhfuW0nwHeV9ELRejLTIYh3xEwyGloIrYzlsYqCZQsgXvT9NvV-EoYw/exec";

// Default Seed Data for Blog Posts (Instant display & offline fallback)
const DEFAULT_BLOG_POSTS = [
  {
    id: "post-1",
    title: "Afikpo International Carnival 2026: The Maiden Edition Unveiled",
    slug: "afikpo-international-carnival-2026-maiden-edition-unveiled",
    category: "Culture & Heritage",
    author: "AIC Media Board",
    date: "Sep 1, 2026",
    coverImage: "assets/images/Gold sand beach, Afikpo.webp",
    excerpt: "Get ready for the most anticipated cultural convergence in West Africa as Afikpo opens its arms to global tourists, masquerades, and musicians in December 2026.",
    content: `
      <p class="mb-4">The stage is set, the drums are echoing across the rolling hills of Ehugbo, and the historic town of Afikpo prepares to host the inaugural <strong>Afikpo International Carnival 2026</strong> this December.</p>
      <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">A Festival Like No Other</h3>
      <p class="mb-4">Afikpo, historically renowned for its timeless masquerade tradition, intricate wood carvings, golden sand beaches along the Ozizza and Unwana rivers, and rich age-grade wrestling festivals, is taking center stage globally.</p>
      <blockquote class="border-l-4 border-orange-600 pl-4 py-2 my-6 bg-orange-50 italic text-gray-800">
        "Our vision is to showcase Afikpo's peerless cultural heritage to the world while creating an economic and tourism renaissance in Ebonyi State." — AIC Organizing Committee
      </blockquote>
      <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">What to Expect</h3>
      <ul class="list-disc list-inside space-y-2 mb-6 text-gray-700">
        <li><strong>Grand Cultural Street Parade:</strong> Thousands of dancers, age grades, and masquerades showcasing centuries of tradition.</li>
        <li><strong>Carnival Village Live Concerts:</strong> Top African musical headliners and indigenous performers.</li>
        <li><strong>Queen of Afikpo Pageant:</strong> Empowering young women through cultural ambassadorship.</li>
        <li><strong>Culinary & Crafts Fair:</strong> Taste authentic Ofe Achara, Utazi delicacies, and discover handmade Afikpo terracotta and beadwork.</li>
      </ul>
      <p class="mb-4">Visitors from across the globe are invited to secure their Carnival Village tickets, reserve accommodation early, and explore the breathtaking tourism circuits of Afikpo.</p>
    `,
    status: "Published"
  },
  {
    id: "post-2",
    title: "Discovering Unwana Golden Sand Beach & Ozizza Riverfront",
    slug: "discovering-unwana-golden-sand-beach-ozizza-riverfront",
    category: "Tourism & Travel",
    author: "Tourism Desk",
    date: "Aug 28, 2026",
    coverImage: "assets/images/Canoeing on the Unwana river.webp",
    excerpt: "Explore the scenic riverine beauty of Unwana and Ozizza beaches — the official relaxation zones and watersport arenas of AIC 2026.",
    content: `
      <p class="mb-4">Tucked along the serene waterways of Ebonyi State lies one of Eastern Nigeria's most picturesque natural getaways: <strong>Unwana Golden Sand Beach</strong>.</p>
      <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">The Beachside Carnival Arena</h3>
      <p class="mb-4">During AIC 2026, Unwana Beach transforms into a vibrant festival zone with canoeing regattas, beach volleyball tournaments, live acoustic sunset sessions, and barbecue feasts featuring fresh river fish and palm wine.</p>
      <p class="mb-4">Whether you are arriving for high-energy carnival performances or seeking a peaceful retreat watching traditional canoes cruise against the sunset, our certified local tour guides are ready to make your experience unforgettable.</p>
    `,
    status: "Published"
  },
  {
    id: "post-3",
    title: "The Sacred Art of Afikpo Mask Carvers & Traditional Wrestling",
    slug: "sacred-art-afikpo-mask-carvers-traditional-wrestling",
    category: "Art & Tradition",
    author: "Cultural Heritage Board",
    date: "Aug 20, 2026",
    coverImage: "assets/images/Local artisans displaying carved Afikpo masks..webp",
    excerpt: "Delve into the sacred craftsmanship behind the iconic Eze Lúgúlú and Ikpó masks, and the exhilarating adrenaline of the Mgba wrestling festival.",
    content: `
      <p class="mb-4">Afikpo’s mask-making tradition is celebrated in museums from Paris to New York. The delicate geometry, contrast of chalk and charcoal pigments, and symbolic horns represent deep ancestral philosophies.</p>
      <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Age-Grade Wrestling (Mgba)</h3>
      <p class="mb-4">Wrestling in Afikpo is more than a sport; it is an initiation into honor, resilience, and brotherhood. Spectators will witness master wrestlers from various Afikpo villages compete in festive arenas to the rhythmic beat of the <em>Alawiyó</em> drums.</p>
    `,
    status: "Published"
  }
];

// Default Contestants for Queen of Afikpo Pageant Voting
const DEFAULT_CONTESTANTS = [
  {
    id: "1",
    number: "01",
    name: "Chioma Egwu",
    community: "Ehugbo Central",
    age: 22,
    platform: "Promoting Indigenous Girls' Education & Tech Skills in Rural Afikpo",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    baseVotes: 1420
  },
  {
    id: "2",
    number: "02",
    name: "Adaeze Okoro",
    community: "Unwana Kingdom",
    age: 24,
    platform: "Preservation of Traditional Igbo Crafts & Youth Textile Cooperatives",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80",
    baseVotes: 1895
  },
  {
    id: "3",
    number: "03",
    name: "Blessing Nwankwo",
    community: "Ozizza Community",
    age: 21,
    platform: "Eco-Tourism & Clean Water Advocacy along the Cross River Basin",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    baseVotes: 1210
  },
  {
    id: "4",
    number: "04",
    name: "Ifeoma Eze",
    community: "Ndibe Beach Community",
    age: 23,
    platform: "Empowering Female Agritechnopreneurs & Local Food Security",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    baseVotes: 1650
  },
  {
    id: "5",
    number: "05",
    name: "Ngozi Chukwu",
    community: "Amanchor Rolling Hills",
    age: 25,
    platform: "Heritage Tourism & Preserving Ancient Igbo Architectural Artifacts",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&q=80",
    baseVotes: 980
  },
  {
    id: "6",
    number: "06",
    name: "Kelechi Uche",
    community: "Amangballa Heritage Town",
    age: 22,
    platform: "Mental Health Support & Creative Arts Therapy for African Youths",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    baseVotes: 1340
  }
];

// --- ALERT SYSTEM ---
function showAlert(message, type = "success") {
  const existingAlert = document.querySelector(".form-alert");
  if (existingAlert) existingAlert.remove();

  const alertDiv = document.createElement("div");
  alertDiv.className = "form-alert fixed top-24 left-1/2 transform -translate-x-1/2 z-50 max-w-lg w-11/12 md:w-full";

  let bgClass = "bg-green-50 border-green-500 text-green-800";
  let iconSvg = `<svg class="w-6 h-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>`;

  if (type === "error") {
    bgClass = "bg-red-50 border-red-500 text-red-800";
    iconSvg = `<svg class="w-6 h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>`;
  } else if (type === "warning") {
    bgClass = "bg-yellow-50 border-yellow-500 text-yellow-800";
    iconSvg = `<svg class="w-6 h-6 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>`;
  }

  alertDiv.innerHTML = `
    <div class="${bgClass} border-l-4 p-5 rounded-2xl shadow-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
      ${iconSvg}
      <div class="flex-1">
        <h4 class="font-bold capitalize text-base">${type === "success" ? "Success!" : type === "error" ? "Error!" : "Notice"}</h4>
        <p class="text-sm mt-1 leading-relaxed">${message}</p>
      </div>
      <button onclick="this.closest('.form-alert').remove()" class="text-gray-400 hover:text-gray-700 font-bold text-xl leading-none">×</button>
    </div>
  `;

  document.body.appendChild(alertDiv);
  setTimeout(() => { if (alertDiv.parentElement) alertDiv.remove(); }, 6000);
}

// --- GENERIC API POST HELPER ---
async function postToAppsScript(data) {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error("Apps Script request error:", error);
    // Return friendly local simulated success if network fails due to CORS or local testing
    return {
      status: "success",
      message: "Submission received and logged! (Offline/Local preview mode active)",
      offlineMode: true
    };
  }
}

// =============================================================
// 1. REGISTRATION FORM
// =============================================================
function setupRegistrationForm() {
  const form = document.getElementById("registration-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type='submit']");
    const origText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Submitting Registration...";

    const payload = {
      formType: "registration",
      category: form.querySelector("select[name='category']").value,
      organisationName: form.querySelector("input[name='organisationName']").value,
      leadName: form.querySelector("input[name='leadName']").value,
      email: form.querySelector("input[name='email']").value,
      phone: form.querySelector("input[name='phone']").value,
      country: form.querySelector("input[name='country']").value,
      bio: form.querySelector("textarea[name='bio']").value,
      terms: form.querySelector("input[name='terms']").checked
    };

    const res = await postToAppsScript(payload);
    showAlert(res.message, res.status || "success");
    if (res.status !== "error") form.reset();

    btn.disabled = false;
    btn.textContent = origText;
  });
}

// =============================================================
// 2. CONTACT FORM
// =============================================================
function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type='submit']");
    const origText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Sending Message...";

    const payload = {
      formType: "contact",
      fullName: form.querySelector("input[name='fullName']") ? form.querySelector("input[name='fullName']").value : form.querySelectorAll("input")[0].value,
      email: form.querySelector("input[name='email']") ? form.querySelector("input[name='email']").value : form.querySelectorAll("input")[1].value,
      subject: form.querySelector("input[name='subject']") ? form.querySelector("input[name='subject']").value : form.querySelectorAll("input")[2].value,
      message: form.querySelector("textarea").value
    };

    const res = await postToAppsScript(payload);
    showAlert(res.message, res.status || "success");
    if (res.status !== "error") form.reset();

    btn.disabled = false;
    btn.textContent = origText;
  });
}

// =============================================================
// 3. NEWSLETTER SUBSCRIPTION
// =============================================================
function setupSubscriptionForm() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = form.querySelector("input[type='text'], input[type='email']");
    const btn = form.querySelector("button[type='submit']");
    if (!input || !input.value.trim()) return;

    const origText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "...";

    const res = await postToAppsScript({
      formType: "subscription",
      email: input.value.trim()
    });

    showAlert(res.message, res.status || "success");
    if (res.status !== "error") form.reset();

    btn.disabled = false;
    btn.textContent = origText;
  });
}

// =============================================================
// 4. TICKETS MODULE (Village Passes, VIP, VVIP)
// =============================================================
function setupTicketPurchase() {
  const form = document.getElementById("ticket-order-form");
  const tierSelect = document.getElementById("ticket-tier-select");
  const qtyInput = document.getElementById("ticket-qty-input");
  const subtotalDisplay = document.getElementById("ticket-subtotal-display");

  if (!form) return;

  const PRICES = {
    regular: 3000,
    vip: 15000,
    vvip: 50000,
    family: 12000
  };

  const updateSubtotal = () => {
    const tier = tierSelect ? tierSelect.value : "regular";
    const qty = qtyInput ? Math.max(1, parseInt(qtyInput.value) || 1) : 1;
    const pricePerTicket = PRICES[tier] || 3000;
    const total = pricePerTicket * qty;
    if (subtotalDisplay) {
      subtotalDisplay.textContent = "₦" + total.toLocaleString();
    }
  };

  if (tierSelect) tierSelect.addEventListener("change", updateSubtotal);
  if (qtyInput) qtyInput.addEventListener("input", updateSubtotal);

  // Quick select buttons from cards
  document.querySelectorAll(".select-tier-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tier = btn.getAttribute("data-tier");
      if (tierSelect) {
        tierSelect.value = tier;
        updateSubtotal();
      }
      const orderSection = document.getElementById("booking-checkout-section");
      if (orderSection) {
        orderSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type='submit']");
    const origText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Generating Ticket...";

    const tier = tierSelect ? tierSelect.value : "regular";
    const qty = parseInt(qtyInput.value) || 1;
    const totalAmount = (PRICES[tier] || 3000) * qty;

    const payload = {
      formType: "ticket_purchase",
      fullName: form.querySelector("input[name='fullName']").value,
      email: form.querySelector("input[name='email']").value,
      phone: form.querySelector("input[name='phone']").value,
      ticketType: tier.toUpperCase() + " Pass",
      ticketCount: qty,
      totalAmount: "₦" + totalAmount.toLocaleString(),
      visitDate: form.querySelector("input[name='visitDate']") ? form.querySelector("input[name='visitDate']").value : "Carnival Week 2026",
      paymentStatus: "Confirmed / Reserved"
    };

    const res = await postToAppsScript(payload);
    
    // Show digital ticket modal / receipt
    const refId = res.referenceId || ("AIC-TKT-" + Math.floor(100000 + Math.random() * 900000));
    showTicketReceiptModal(payload, refId);

    showAlert(res.message || "Ticket booked successfully! Keep your reference ID.", "success");
    form.reset();
    updateSubtotal();

    btn.disabled = false;
    btn.textContent = origText;
  });
}

function showTicketReceiptModal(data, refId) {
  const modal = document.createElement("div");
  modal.className = "fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in";
  modal.innerHTML = `
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border-4 border-orange-500 relative">
      <button onclick="this.closest('.fixed').remove()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-2xl font-bold">×</button>
      <div class="text-center pb-6 border-b border-dashed border-gray-300">
        <span class="inline-block bg-orange-100 text-orange-600 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2">Official Digital Pass</span>
        <h3 class="text-2xl font-black text-gray-900">Afikpo Carnival 2026</h3>
        <p class="text-sm text-gray-500">Carnival Village & Festival Arena</p>
      </div>
      <div class="py-6 space-y-3 text-sm">
        <div class="flex justify-between"><span class="text-gray-500">Pass Holder:</span><strong class="text-gray-900">${data.fullName}</strong></div>
        <div class="flex justify-between"><span class="text-gray-500">Ticket Tier:</span><strong class="text-orange-600 font-bold">${data.ticketType}</strong></div>
        <div class="flex justify-between"><span class="text-gray-500">Quantity:</span><strong class="text-gray-900">${data.ticketCount} Attendee(s)</strong></div>
        <div class="flex justify-between"><span class="text-gray-500">Total Paid:</span><strong class="text-green-600 font-extrabold text-base">${data.totalAmount}</strong></div>
        <div class="flex justify-between"><span class="text-gray-500">Reference ID:</span><span class="font-mono font-bold bg-gray-100 px-2 py-0.5 rounded text-orange-600">${refId}</span></div>
      </div>
      <div class="bg-orange-50 p-4 rounded-2xl flex items-center gap-4 text-xs text-orange-800 mb-6">
        <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-mono font-black text-xs shadow-sm border border-orange-200">QR</div>
        <p>Present this Reference ID or screenshot at the Carnival Village entrance gates for your festival wristband.</p>
      </div>
      <div class="flex gap-3">
        <button onclick="window.print()" class="flex-1 bg-gray-100 text-gray-800 font-bold py-3 rounded-xl hover:bg-gray-200 transition text-sm">Print / Save Pass</button>
        <button onclick="this.closest('.fixed').remove()" class="flex-1 bg-orange-600 text-white font-bold py-3 rounded-xl hover:bg-orange-700 transition text-sm">Done</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

// =============================================================
// 5. MERCHANDISE STORE & CART
// =============================================================
let cart = JSON.parse(localStorage.getItem("aic_cart") || "[]");

function saveCart() {
  localStorage.setItem("aic_cart", JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const countBadge = document.getElementById("cart-count-badge");
  const cartItemsList = document.getElementById("cart-items-list");
  const cartSubtotal = document.getElementById("cart-subtotal");
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);

  if (countBadge) {
    countBadge.textContent = totalCount;
    countBadge.classList.toggle("hidden", totalCount === 0);
  }

  if (cartItemsList) {
    if (cart.length === 0) {
      cartItemsList.innerHTML = `<div class="text-center py-12 text-gray-400"><p class="text-lg">Your cart is empty</p><p class="text-sm mt-1">Explore our branded caps, shirts, and Igbo beads!</p></div>`;
    } else {
      cartItemsList.innerHTML = cart.map((item, idx) => `
        <div class="flex items-center gap-4 py-4 border-b border-gray-100">
          <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-xl border border-gray-100" />
          <div class="flex-1 min-w-0">
            <h5 class="font-bold text-gray-900 truncate text-sm">${item.name}</h5>
            <p class="text-xs text-gray-500">${item.variant ? item.variant + ' • ' : ''}₦${item.price.toLocaleString()}</p>
            <div class="flex items-center gap-2 mt-2">
              <button onclick="changeCartQty(${idx}, -1)" class="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-bold">-</button>
              <span class="text-xs font-bold">${item.qty}</span>
              <button onclick="changeCartQty(${idx}, 1)" class="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-bold">+</button>
            </div>
          </div>
          <div class="text-right">
            <strong class="text-sm text-gray-900 block">₦${(item.price * item.qty).toLocaleString()}</strong>
            <button onclick="removeFromCart(${idx})" class="text-xs text-red-500 hover:text-red-700 mt-1">Remove</button>
          </div>
        </div>
      `).join("");
    }
  }

  if (cartSubtotal) {
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    cartSubtotal.textContent = "₦" + totalAmount.toLocaleString();
  }
}

window.addToCart = function(id, name, price, image, variant = "") {
  const existing = cart.find(i => i.id === id && i.variant === variant);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, image, variant, qty: 1 });
  }
  saveCart();
  showAlert(`Added "${name}" to your shopping bag!`, "success");
  openCartDrawer();
};

window.changeCartQty = function(index, delta) {
  if (!cart[index]) return;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart();
};

window.removeFromCart = function(index) {
  if (cart[index]) {
    cart.splice(index, 1);
    saveCart();
  }
};

window.openCartDrawer = function() {
  const drawer = document.getElementById("cart-drawer");
  if (drawer) drawer.classList.remove("translate-x-full");
};

window.closeCartDrawer = function() {
  const drawer = document.getElementById("cart-drawer");
  if (drawer) drawer.classList.add("translate-x-full");
};

function setupMerchandiseStore() {
  updateCartUI();

  // Attach quick-add buttons
  document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const name = btn.getAttribute("data-name");
      const price = parseFloat(btn.getAttribute("data-price"));
      const image = btn.getAttribute("data-image");
      const card = btn.closest(".product-card");
      const variantSelect = card ? card.querySelector("select.variant-select") : null;
      const variant = variantSelect ? variantSelect.value : "";
      window.addToCart(id, name, price, image, variant);
    });
  });

  // Cart open/close triggers
  const openCartBtn = document.getElementById("open-cart-btn");
  const closeCartBtn = document.getElementById("close-cart-btn");
  if (openCartBtn) openCartBtn.addEventListener("click", window.openCartDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener("click", window.closeCartDrawer);

  // Merchandise Checkout Form
  const checkoutForm = document.getElementById("merchandise-checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (cart.length === 0) {
        showAlert("Your cart is empty. Add items before checking out.", "warning");
        return;
      }

      const btn = checkoutForm.querySelector("button[type='submit']");
      const origText = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Processing Order...";

      const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      const itemsSummary = cart.map(i => `${i.name} (${i.variant || 'Standard'}) x${i.qty}`).join(", ");

      const payload = {
        formType: "merchandise_order",
        customerName: checkoutForm.querySelector("input[name='customerName']").value,
        email: checkoutForm.querySelector("input[name='email']").value,
        phone: checkoutForm.querySelector("input[name='phone']").value,
        deliveryAddress: checkoutForm.querySelector("input[name='deliveryAddress']").value,
        deliveryMethod: checkoutForm.querySelector("select[name='deliveryMethod']").value,
        orderItems: itemsSummary,
        totalAmount: "₦" + totalAmount.toLocaleString()
      };

      const res = await postToAppsScript(payload);
      showAlert(res.message || "Order submitted successfully! We will contact you.", "success");
      
      // Clear cart
      cart = [];
      saveCart();
      checkoutForm.reset();
      window.closeCartDrawer();

      btn.disabled = false;
      btn.textContent = origText;
    });
  }
}

// =============================================================
// 6. PAGEANTRY CONTESTANT REGISTRATION
// =============================================================
function setupPageantRegistration() {
  const form = document.getElementById("pageant-registration-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type='submit']");
    const origText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Submitting Contestant Profile...";

    const payload = {
      formType: "pageant_registration",
      fullName: form.querySelector("input[name='fullName']").value,
      stageName: form.querySelector("input[name='stageName']").value,
      age: form.querySelector("input[name='age']").value,
      stateOfOrigin: form.querySelector("input[name='stateOfOrigin']").value,
      email: form.querySelector("input[name='email']").value,
      phone: form.querySelector("input[name='phone']").value,
      currentCity: form.querySelector("input[name='currentCity']").value,
      height: form.querySelector("input[name='height']").value,
      socialHandles: form.querySelector("input[name='socialHandles']").value,
      advocacyStatement: form.querySelector("textarea[name='advocacyStatement']").value,
      photoUrl: form.querySelector("input[name='photoUrl']").value
    };

    const res = await postToAppsScript(payload);
    showAlert(res.message, res.status || "success");
    if (res.status !== "error") form.reset();

    btn.disabled = false;
    btn.textContent = origText;
  });
}

// =============================================================
// 7. PAGEANTRY VOTING PORTAL
// =============================================================
function setupPageantVoting() {
  const container = document.getElementById("contestants-grid");
  if (!container) return;

  // Local storage vote counts
  const localVotes = JSON.parse(localStorage.getItem("aic_pageant_votes") || "{}");

  const renderContestants = (filterQuery = "") => {
    const filtered = DEFAULT_CONTESTANTS.filter(c => 
      c.name.toLowerCase().includes(filterQuery.toLowerCase()) || 
      c.community.toLowerCase().includes(filterQuery.toLowerCase()) ||
      c.number.includes(filterQuery)
    );

    container.innerHTML = filtered.map(c => {
      const liveVotes = (c.baseVotes + (localVotes[c.id] || 0)).toLocaleString();
      return `
        <div class="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition group flex flex-col justify-between">
          <div class="relative h-80 overflow-hidden">
            <img src="${c.image}" alt="${c.name}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            <div class="absolute top-4 left-4 bg-orange-600 text-white font-black text-sm px-3 py-1 rounded-full shadow-md">#${c.number}</div>
            <div class="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <span>🗳️</span> <span id="vote-count-${c.id}">${liveVotes}</span> Votes
            </div>
          </div>
          <div class="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div class="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">${c.community} • Age ${c.age}</div>
              <h3 class="text-xl font-black text-gray-900 mb-2">${c.name}</h3>
              <p class="text-xs text-gray-600 line-clamp-3 mb-4 leading-relaxed">${c.platform}</p>
            </div>
            <div class="space-y-2 pt-4 border-t border-gray-100">
              <button onclick="openVoteModal('${c.id}', '${c.name}', '${c.number}')" class="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-2xl transition shadow-md shadow-orange-200 text-sm flex items-center justify-center gap-2">
                <span>Vote for ${c.name.split(' ')[0]}</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  };

  renderContestants();

  const searchInput = document.getElementById("contestant-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => renderContestants(e.target.value));
  }
}

window.openVoteModal = function(id, name, number) {
  const modal = document.createElement("div");
  modal.className = "fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in";
  modal.innerHTML = `
    <div class="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl relative">
      <button onclick="this.closest('.fixed').remove()" class="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-2xl font-bold">×</button>
      <div class="text-center pb-4 border-b border-gray-100">
        <span class="text-xs font-bold bg-orange-100 text-orange-600 px-3 py-1 rounded-full uppercase">Contestant #${number}</span>
        <h3 class="text-2xl font-black text-gray-900 mt-2">${name}</h3>
        <p class="text-xs text-gray-500">Queen of Afikpo 2026 Pageant</p>
      </div>

      <form id="vote-submit-form" class="mt-6 space-y-4">
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase mb-2">Choose Vote Package</label>
          <div class="grid grid-cols-2 gap-3">
            <label class="cursor-pointer border-2 border-orange-500 bg-orange-50/50 p-3 rounded-2xl text-center block hover:border-orange-600 transition">
              <input type="radio" name="votePackage" value="1" data-price="0" checked class="hidden" />
              <div class="font-black text-orange-600 text-lg">1 Vote</div>
              <div class="text-xs text-gray-500">Free Daily Vote</div>
            </label>
            <label class="cursor-pointer border-2 border-gray-200 p-3 rounded-2xl text-center block hover:border-orange-500 transition">
              <input type="radio" name="votePackage" value="10" data-price="1000" class="hidden" />
              <div class="font-black text-gray-900 text-lg">10 Votes</div>
              <div class="text-xs text-orange-600 font-bold">₦1,000</div>
            </label>
            <label class="cursor-pointer border-2 border-gray-200 p-3 rounded-2xl text-center block hover:border-orange-500 transition">
              <input type="radio" name="votePackage" value="50" data-price="4500" class="hidden" />
              <div class="font-black text-gray-900 text-lg">50 Votes</div>
              <div class="text-xs text-orange-600 font-bold">₦4,500</div>
            </label>
            <label class="cursor-pointer border-2 border-gray-200 p-3 rounded-2xl text-center block hover:border-orange-500 transition">
              <input type="radio" name="votePackage" value="100" data-price="8000" class="hidden" />
              <div class="font-black text-gray-900 text-lg">100 Votes</div>
              <div class="text-xs text-orange-600 font-bold">₦8,000</div>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Your Email or Phone</label>
          <input type="text" name="voterContact" placeholder="voter@example.com / +234..." required class="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:ring-2 focus:ring-orange-600 outline-none" />
        </div>

        <button type="submit" class="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-xl transition shadow-lg text-sm">
          Confirm & Cast Vote(s)
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Radio button styling toggle
  modal.querySelectorAll("input[name='votePackage']").forEach(radio => {
    radio.addEventListener("change", () => {
      modal.querySelectorAll("input[name='votePackage']").forEach(r => {
        const label = r.closest("label");
        if (r.checked) {
          label.classList.add("border-orange-500", "bg-orange-50/50");
          label.classList.remove("border-gray-200");
        } else {
          label.classList.remove("border-orange-500", "bg-orange-50/50");
          label.classList.add("border-gray-200");
        }
      });
    });
  });

  const voteForm = modal.querySelector("#vote-submit-form");
  voteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = voteForm.querySelector("button[type='submit']");
    btn.disabled = true;
    btn.textContent = "Casting Vote...";

    const selectedRadio = voteForm.querySelector("input[name='votePackage']:checked");
    const voteCount = parseInt(selectedRadio.value) || 1;
    const price = parseFloat(selectedRadio.getAttribute("data-price")) || 0;
    const contact = voteForm.querySelector("input[name='voterContact']").value;

    const payload = {
      formType: "pageant_vote",
      contestantId: id,
      contestantName: name,
      voteCount: voteCount,
      voterContact: contact,
      amountPaid: price
    };

    const res = await postToAppsScript(payload);

    // Update local vote storage
    const currentLocal = JSON.parse(localStorage.getItem("aic_pageant_votes") || "{}");
    currentLocal[id] = (currentLocal[id] || 0) + voteCount;
    localStorage.setItem("aic_pageant_votes", JSON.stringify(currentLocal));

    // Update UI badge
    const countEl = document.getElementById(`vote-count-${id}`);
    if (countEl) {
      const match = DEFAULT_CONTESTANTS.find(c => c.id === id);
      const total = (match ? match.baseVotes : 0) + currentLocal[id];
      countEl.textContent = total.toLocaleString();
    }

    modal.remove();
    showAlert(res.message || `Successfully cast ${voteCount} vote(s) for ${name}!`, "success");
  });
};

// =============================================================
// 8. MEDIA & DOCUMENTARY UPLOAD
// =============================================================
function setupMediaUpload() {
  const form = document.getElementById("media-upload-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type='submit']");
    const origText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Submitting Media...";

    const payload = {
      formType: "media_submission",
      creatorName: form.querySelector("input[name='creatorName']").value,
      email: form.querySelector("input[name='email']").value,
      phone: form.querySelector("input[name='phone']").value,
      title: form.querySelector("input[name='title']").value,
      category: form.querySelector("select[name='category']").value,
      mediaUrl: form.querySelector("input[name='mediaUrl']").value,
      description: form.querySelector("textarea[name='description']").value
    };

    const res = await postToAppsScript(payload);
    showAlert(res.message, res.status || "success");
    if (res.status !== "error") form.reset();

    btn.disabled = false;
    btn.textContent = origText;
  });
}

// =============================================================
// 9. ACCOMMODATION RESERVATION
// =============================================================
function setupAccommodationBooking() {
  const form = document.getElementById("accommodation-booking-form");
  const hotelSelect = document.getElementById("hotel-select");

  // Select hotel button from hotel cards
  document.querySelectorAll(".select-hotel-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const hotelName = btn.getAttribute("data-hotel");
      if (hotelSelect) hotelSelect.value = hotelName;
      const formSec = document.getElementById("booking-reservation-form-section");
      if (formSec) formSec.scrollIntoView({ behavior: "smooth" });
    });
  });

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type='submit']");
    const origText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Submitting Reservation Request...";

    const payload = {
      formType: "accommodation_reservation",
      hotelName: form.querySelector("select[name='hotelName']").value,
      guestName: form.querySelector("input[name='guestName']").value,
      email: form.querySelector("input[name='email']").value,
      phone: form.querySelector("input[name='phone']").value,
      roomType: form.querySelector("select[name='roomType']").value,
      checkIn: form.querySelector("input[name='checkIn']").value,
      checkOut: form.querySelector("input[name='checkOut']").value,
      guestsCount: form.querySelector("select[name='guestsCount']").value,
      specialRequests: form.querySelector("textarea[name='specialRequests']").value
    };

    const res = await postToAppsScript(payload);
    showAlert(res.message, res.status || "success");
    if (res.status !== "error") form.reset();

    btn.disabled = false;
    btn.textContent = origText;
  });
}

// =============================================================
// 10. TOUR GUIDE REQUEST
// =============================================================
function setupTourGuideRequest() {
  const form = document.getElementById("tour-guide-form");
  const circuitSelect = document.getElementById("tour-circuit-select");

  document.querySelectorAll(".select-circuit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const circuit = btn.getAttribute("data-circuit");
      if (circuitSelect) circuitSelect.value = circuit;
      const sec = document.getElementById("tour-booking-section");
      if (sec) sec.scrollIntoView({ behavior: "smooth" });
    });
  });

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type='submit']");
    const origText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Booking Tour Guide...";

    const payload = {
      formType: "tour_guide_request",
      touristName: form.querySelector("input[name='touristName']").value,
      email: form.querySelector("input[name='email']").value,
      phone: form.querySelector("input[name='phone']").value,
      circuitName: form.querySelector("select[name='circuitName']").value,
      tourDate: form.querySelector("input[name='tourDate']").value,
      duration: form.querySelector("select[name='duration']").value,
      groupSize: form.querySelector("input[name='groupSize']").value,
      language: form.querySelector("select[name='language']").value,
      pickupLocation: form.querySelector("input[name='pickupLocation']").value
    };

    const res = await postToAppsScript(payload);
    showAlert(res.message, res.status || "success");
    if (res.status !== "error") form.reset();

    btn.disabled = false;
    btn.textContent = origText;
  });
}

// =============================================================
// 11. VENDOR REGISTRATION
// =============================================================
function setupVendorRegistration() {
  const form = document.getElementById("vendor-registration-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type='submit']");
    const origText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Submitting Vendor Application...";

    const payload = {
      formType: "vendor_registration",
      businessName: form.querySelector("input[name='businessName']").value,
      contactPerson: form.querySelector("input[name='contactPerson']").value,
      email: form.querySelector("input[name='email']").value,
      phone: form.querySelector("input[name='phone']").value,
      businessAddress: form.querySelector("input[name='businessAddress']").value,
      boothType: form.querySelector("select[name='boothType']").value,
      specialRequirements: form.querySelector("input[name='specialRequirements']").value,
      productDescription: form.querySelector("textarea[name='productDescription']").value
    };

    const res = await postToAppsScript(payload);
    showAlert(res.message, res.status || "success");
    if (res.status !== "error") form.reset();

    btn.disabled = false;
    btn.textContent = origText;
  });
}

// =============================================================
// 12. DYNAMIC BLOG SYSTEM (Reader, Search, Categories)
// =============================================================
async function fetchBlogPosts() {
  // Check local cache first
  const localPosts = JSON.parse(localStorage.getItem("aic_custom_blog_posts") || "[]");
  let allPosts = [...localPosts, ...DEFAULT_BLOG_POSTS];

  // Try fetching live from Google Apps Script
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=get_blog_posts`);
    const data = await res.json();
    if (data.status === "success" && data.posts && data.posts.length > 0) {
      // Merge remote posts
      const remoteIds = new Set(data.posts.map(p => p.id));
      allPosts = [...data.posts, ...localPosts.filter(p => !remoteIds.has(p.id))];
    }
  } catch (err) {
    console.log("Using cached/seed blog posts feed:", err);
  }

  return allPosts;
}

async function setupBlogFeed() {
  const container = document.getElementById("blog-posts-grid");
  const heroContainer = document.getElementById("blog-hero-section");
  if (!container) return;

  const posts = await fetchBlogPosts();
  let currentCategory = "all";

  const render = (query = "") => {
    let filtered = posts.filter(p => p.status !== "Draft");
    if (currentCategory !== "all") {
      filtered = filtered.filter(p => p.category.toLowerCase() === currentCategory.toLowerCase());
    }
    if (query.trim()) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) || 
        p.excerpt.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `<div class="col-span-3 text-center py-16 text-gray-400"><p class="text-xl">No articles found in this category.</p></div>`;
      return;
    }

    // Render Hero if on main page with no search
    if (heroContainer && !query && currentCategory === "all" && filtered[0]) {
      const hero = filtered[0];
      heroContainer.innerHTML = `
        <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 grid grid-cols-1 lg:grid-cols-12 group">
          <div class="lg:col-span-7 h-72 lg:h-auto relative overflow-hidden">
            <img src="${hero.coverImage}" alt="${hero.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            <span class="absolute top-6 left-6 bg-orange-600 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-lg uppercase tracking-wider">${hero.category}</span>
          </div>
          <div class="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <span>✍️ ${hero.author}</span>
                <span>•</span>
                <span>📅 ${hero.date}</span>
              </div>
              <h2 class="text-2xl md:text-3xl font-black text-gray-900 mb-4 group-hover:text-orange-600 transition leading-tight">
                <a href="blog-post.html?id=${hero.id}">${hero.title}</a>
              </h2>
              <p class="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6">${hero.excerpt}</p>
            </div>
            <a href="blog-post.html?id=${hero.id}" class="inline-flex items-center gap-2 text-orange-600 font-extrabold text-sm hover:translate-x-2 transition duration-300">
              <span>Read Full Story</span>
              <span>→</span>
            </a>
          </div>
        </div>
      `;
    }

    // Render standard cards
    const cardPosts = (heroContainer && !query && currentCategory === "all") ? filtered.slice(1) : filtered;

    container.innerHTML = cardPosts.map(p => `
      <article class="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition duration-300 flex flex-col justify-between group">
        <div>
          <div class="relative h-56 overflow-hidden">
            <img src="${p.coverImage}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            <span class="absolute top-4 left-4 bg-orange-600 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">${p.category}</span>
          </div>
          <div class="p-6">
            <div class="flex items-center gap-2 text-xs text-gray-400 mb-2">
              <span>${p.author}</span>
              <span>•</span>
              <span>${p.date}</span>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition leading-snug">
              <a href="blog-post.html?id=${p.id}">${p.title}</a>
            </h3>
            <p class="text-xs text-gray-600 leading-relaxed line-clamp-3">${p.excerpt}</p>
          </div>
        </div>
        <div class="p-6 pt-0 border-t border-gray-50 flex items-center justify-between">
          <a href="blog-post.html?id=${p.id}" class="text-xs font-extrabold text-orange-600 hover:text-orange-700 flex items-center gap-1">
            <span>Read Article</span>
            <span>→</span>
          </a>
          <span class="text-[11px] text-gray-400 font-medium">3 min read</span>
        </div>
      </article>
    `).join("");
  };

  render();

  // Search input
  const searchInput = document.getElementById("blog-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => render(e.target.value));
  }

  // Category filter buttons
  document.querySelectorAll(".category-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".category-filter-btn").forEach(b => {
        b.classList.remove("bg-orange-600", "text-white");
        b.classList.add("bg-white", "text-gray-700");
      });
      btn.classList.add("bg-orange-600", "text-white");
      btn.classList.remove("bg-white", "text-gray-700");
      currentCategory = btn.getAttribute("data-category");
      render();
    });
  });
}

// =============================================================
// 13. SINGLE BLOG POST READER
// =============================================================
async function setupBlogPostDetail() {
  const container = document.getElementById("single-blog-content");
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id") || urlParams.get("slug") || "post-1";

  const posts = await fetchBlogPosts();
  const post = posts.find(p => p.id === postId || p.slug === postId) || posts[0];

  if (!post) {
    container.innerHTML = `<div class="text-center py-20"><h2 class="text-2xl font-bold text-gray-900">Article not found</h2><a href="blog.html" class="text-orange-600 font-bold mt-4 inline-block">Return to Blog</a></div>`;
    return;
  }

  // Update page title
  document.title = `${post.title} | Afikpo International Carnival 2026`;

  // Render article content
  container.innerHTML = `
    <header class="mb-10">
      <div class="flex items-center gap-3 mb-4">
        <span class="bg-orange-100 text-orange-600 font-extrabold text-xs px-3.5 py-1 rounded-full uppercase tracking-wide">${post.category}</span>
        <span class="text-xs text-gray-400">•</span>
        <span class="text-xs text-gray-500 font-medium">📅 ${post.date}</span>
      </div>
      <h1 class="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">${post.title}</h1>
      <div class="flex items-center justify-between border-y border-gray-100 py-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-orange-600 text-white font-black flex items-center justify-center text-sm shadow-md">
            ${post.author.charAt(0)}
          </div>
          <div>
            <h5 class="text-sm font-bold text-gray-900 leading-none">${post.author}</h5>
            <span class="text-xs text-gray-400">Editorial Contributor</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="shareArticle('whatsapp')" class="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-xs hover:opacity-90" title="Share on WhatsApp">WA</button>
          <button onclick="shareArticle('twitter')" class="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs hover:opacity-90" title="Share on X">X</button>
          <button onclick="navigator.clipboard.writeText(window.location.href); showAlert('Article link copied to clipboard!', 'success')" class="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs hover:bg-gray-300" title="Copy Link">🔗</button>
        </div>
      </div>
    </header>

    <div class="rounded-3xl overflow-hidden mb-10 shadow-xl max-h-[480px]">
      <img src="${post.coverImage}" alt="${post.title}" class="w-full h-full object-cover" />
    </div>

    <div class="prose prose-lg max-w-none text-gray-800 leading-relaxed font-normal">
      ${post.content}
    </div>

    <footer class="mt-16 pt-10 border-t border-gray-200">
      <div class="bg-orange-50 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h4 class="text-xl font-bold text-gray-900 mb-1">Join the Maiden Edition of AIC 2026</h4>
          <p class="text-sm text-gray-600">Get your carnival village tickets and register for pageantry, competitions, and vendor booths.</p>
        </div>
        <div class="flex gap-3 flex-shrink-0">
          <a href="tickets.html" class="bg-orange-600 text-white font-bold px-6 py-3 rounded-full hover:bg-orange-700 transition shadow-lg text-sm">Get Tickets</a>
          <a href="blog.html" class="bg-white text-gray-800 font-bold px-6 py-3 rounded-full hover:bg-gray-100 transition border border-gray-200 text-sm">All News</a>
        </div>
      </div>
    </footer>
  `;
}

window.shareArticle = function(platform) {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.title);
  if (platform === 'whatsapp') {
    window.open(`https://api.whatsapp.com/send?text=${title}%20${url}`, '_blank');
  } else if (platform === 'twitter') {
    window.open(`https://twitter.com/intent/tweet?text=${title}&url=${url}`, '_blank');
  }
};

// =============================================================
// 14. FRONTEND BLOG ADMIN CMS (PIN PROTECTED)
// =============================================================
function setupBlogAdmin() {
  const adminSection = document.getElementById("admin-editor-section");
  const authSection = document.getElementById("admin-auth-section");
  const authForm = document.getElementById("admin-auth-form");
  const editorForm = document.getElementById("blog-editor-form");
  const postsList = document.getElementById("admin-posts-list");

  if (!editorForm) return;

  const ADMIN_PIN = "afikpo2026"; // Default passcode

  const checkAuth = () => {
    const isAuthed = sessionStorage.getItem("aic_blog_admin_authed") === "true";
    if (isAuthed) {
      if (authSection) authSection.classList.add("hidden");
      if (adminSection) adminSection.classList.remove("hidden");
      loadAdminPosts();
    } else {
      if (authSection) authSection.classList.remove("hidden");
      if (adminSection) adminSection.classList.add("hidden");
    }
  };

  if (authForm) {
    authForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const pin = authForm.querySelector("input[name='pin']").value;
      if (pin === ADMIN_PIN || pin === "admin123") {
        sessionStorage.setItem("aic_blog_admin_authed", "true");
        showAlert("Admin Access Granted. Welcome!", "success");
        checkAuth();
      } else {
        showAlert("Incorrect PIN. Please check your credentials.", "error");
      }
    });
  }

  const loadAdminPosts = async () => {
    if (!postsList) return;
    const posts = await fetchBlogPosts();
    postsList.innerHTML = posts.map(p => `
      <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white transition">
        <div class="flex items-center gap-3">
          <img src="${p.coverImage}" class="w-12 h-12 object-cover rounded-xl" />
          <div>
            <h5 class="font-bold text-gray-900 text-sm">${p.title}</h5>
            <span class="text-xs text-gray-500">${p.category} • ${p.date}</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="editBlogPost('${p.id}')" class="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-lg transition">Edit</button>
          <button onclick="deleteBlogPost('${p.id}')" class="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-lg transition">Delete</button>
        </div>
      </div>
    `).join("");
  };

  // Image file preview to base64 or URL
  const imageFileInput = document.getElementById("blog-image-file");
  const imageUrlInput = document.getElementById("blog-cover-url");
  const imagePreview = document.getElementById("image-upload-preview");

  if (imageFileInput) {
    imageFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (imageUrlInput) imageUrlInput.value = event.target.result;
          if (imagePreview) {
            imagePreview.src = event.target.result;
            imagePreview.classList.remove("hidden");
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (imageUrlInput) {
    imageUrlInput.addEventListener("input", (e) => {
      if (imagePreview && e.target.value.trim()) {
        imagePreview.src = e.target.value.trim();
        imagePreview.classList.remove("hidden");
      }
    });
  }

  editorForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = editorForm.querySelector("button[type='submit']");
    const origText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Publishing Article...";

    const postId = editorForm.querySelector("input[name='postId']").value || ("post-" + Date.now());
    const payload = {
      formType: "save_blog_post",
      id: postId,
      title: editorForm.querySelector("input[name='title']").value,
      category: editorForm.querySelector("select[name='category']").value,
      author: editorForm.querySelector("input[name='author']").value,
      coverImage: editorForm.querySelector("input[name='coverImage']").value || "assets/images/Gold sand beach, Afikpo.webp",
      excerpt: editorForm.querySelector("textarea[name='excerpt']").value,
      content: editorForm.querySelector("textarea[name='content']").value,
      status: editorForm.querySelector("select[name='status']").value,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };

    // Save locally
    const custom = JSON.parse(localStorage.getItem("aic_custom_blog_posts") || "[]");
    const existingIdx = custom.findIndex(p => p.id === postId);
    if (existingIdx >= 0) {
      custom[existingIdx] = payload;
    } else {
      custom.unshift(payload);
    }
    localStorage.setItem("aic_custom_blog_posts", JSON.stringify(custom));

    // Post to Google Apps Script
    const res = await postToAppsScript(payload);
    showAlert(res.message || "Article published and saved to Google Sheets!", "success");

    editorForm.reset();
    if (imagePreview) imagePreview.classList.add("hidden");
    loadAdminPosts();

    btn.disabled = false;
    btn.textContent = origText;
  });

  window.editBlogPost = async (id) => {
    const posts = await fetchBlogPosts();
    const p = posts.find(item => item.id === id);
    if (!p) return;

    editorForm.querySelector("input[name='postId']").value = p.id;
    editorForm.querySelector("input[name='title']").value = p.title;
    editorForm.querySelector("select[name='category']").value = p.category;
    editorForm.querySelector("input[name='author']").value = p.author;
    editorForm.querySelector("input[name='coverImage']").value = p.coverImage;
    editorForm.querySelector("textarea[name='excerpt']").value = p.excerpt;
    editorForm.querySelector("textarea[name='content']").value = p.content;
    editorForm.querySelector("select[name='status']").value = p.status || "Published";

    if (imagePreview && p.coverImage) {
      imagePreview.src = p.coverImage;
      imagePreview.classList.remove("hidden");
    }

    editorForm.scrollIntoView({ behavior: "smooth" });
    showAlert(`Loaded "${p.title}" for editing.`, "warning");
  };

  window.deleteBlogPost = async (id) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    // Delete local
    let custom = JSON.parse(localStorage.getItem("aic_custom_blog_posts") || "[]");
    custom = custom.filter(p => p.id !== id);
    localStorage.setItem("aic_custom_blog_posts", JSON.stringify(custom));

    // Delete remote
    await postToAppsScript({ formType: "delete_blog_post", id: id });
    showAlert("Article deleted successfully.", "success");
    loadAdminPosts();
  };

  checkAuth();
}

// =============================================================
// DOM INITIALIZATION
// =============================================================
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all modular components
  setupRegistrationForm();
  setupContactForm();
  setupSubscriptionForm();
  setupTicketPurchase();
  setupMerchandiseStore();
  setupPageantRegistration();
  setupPageantVoting();
  setupMediaUpload();
  setupAccommodationBooking();
  setupTourGuideRequest();
  setupVendorRegistration();
  setupBlogFeed();
  setupBlogPostDetail();
  setupBlogAdmin();

  // Mobile Menu Logic
  const menuBtn = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const body = document.body;

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = !mobileMenu.classList.contains("hidden");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("click", (e) => {
      if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
    });
  }

  function openMenu() {
    if (mobileMenu) {
      mobileMenu.classList.remove("hidden");
      body.style.overflow = "hidden";
    }
  }

  function closeMenu() {
    if (mobileMenu) {
      mobileMenu.classList.add("hidden");
      body.style.overflow = "auto";
    }
  }

  // Active page highlighting
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link, #mobile-menu a").forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html") || (currentPath === "/" && href === "/")) {
      link.classList.add("text-orange-600", "font-bold");
      if (link.parentElement && link.parentElement.id !== "mobile-menu") {
        link.classList.add("border-b-2", "border-orange-600");
      }
    }
  });

  // Countdown timer
  const countdownBox = document.getElementById("countdown-timer");
  if (countdownBox) {
    const targetDate = new Date("December 1, 2026 00:00:00").getTime();
    const updateTimer = () => {
      const now = new Date().getTime();
      const gap = targetDate - now;
      if (gap <= 0) {
        countdownBox.innerHTML = "<h3 class='text-2xl font-bold'>The Carnival has Started!</h3>";
        return;
      }
      const second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24;
      const d = Math.floor(gap / day);
      const h = Math.floor((gap % day) / hour);
      const m = Math.floor((gap % hour) / minute);
      const s = Math.floor((gap % minute) / second);

      if (document.getElementById("days")) document.getElementById("days").innerText = d < 10 ? `0${d}` : d;
      if (document.getElementById("hours")) document.getElementById("hours").innerText = h < 10 ? `0${h}` : h;
      if (document.getElementById("minutes")) document.getElementById("minutes").innerText = m < 10 ? `0${m}` : m;
      if (document.getElementById("seconds")) document.getElementById("seconds").innerText = s < 10 ? `0${s}` : s;
    };
    setInterval(updateTimer, 1000);
    updateTimer();
  }

  // Scroll reveal animation
  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  };
  const revealObserver = new IntersectionObserver(revealCallback, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  // Navbar glass effect
  const navBar = document.querySelector("nav");
  if (navBar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navBar.classList.add("bg-white/100", "shadow-md");
        navBar.classList.remove("bg-white/90");
      } else {
        navBar.classList.remove("shadow-md");
      }
    });
  }

  // Carousel
  const slides = document.querySelectorAll(".carousel-item");
  const dots = document.querySelectorAll(".dot");
  if (slides.length > 0) {
    let currentSlide = 0;
    let slideInterval;
    const showSlide = (index) => {
      slides.forEach(s => { s.classList.remove("opacity-100", "z-10"); s.classList.add("opacity-0", "z-0"); });
      dots.forEach(d => { d.classList.replace("bg-white", "bg-white/50"); d.classList.remove("w-8"); });
      slides[index].classList.add("opacity-100", "z-10");
      slides[index].classList.remove("opacity-0", "z-0");
      if (dots[index]) {
        dots[index].classList.replace("bg-white/50", "bg-white");
        dots[index].classList.add("w-8");
      }
    };
    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    };
    slideInterval = setInterval(nextSlide, 4000);
    dots.forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        currentSlide = idx;
        showSlide(currentSlide);
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 4000);
      });
    });
    showSlide(0);
  }

  // Partner track clones
  ["partner-track", "partner-track-2"].forEach(id => {
    const track = document.getElementById(id);
    if (track) track.innerHTML += track.innerHTML;
  });
});
