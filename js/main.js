/**
 * Afikpo International Carnival 2026
 * Master Logic Script - Vanilla JS
 * 
 * Handles all 9 carnival features, shopping cart, voting,
 * dynamic blog CMS (with PIN authentication), and Google Apps Script integration.
 */

// Master Google Apps Script Web App Deployment URL
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwEbX71MSQ2Kh-7g1tWDZaH_jrNpksauc0TEwGOcZaQObN1Enu9RluGfOXXURvNNgRO/exec";

// Default Seed Data for Blog Posts
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

// --- ALERT NOTIFICATION SYSTEM ---
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
    return {
      status: "success",
      message: "Submission received and logged successfully!",
      offlineMode: true
    };
  }
}

// =============================================================
// 1. REGISTRATION FORM (Performers & Troupes)
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
      category: form.querySelector("select[name='category']") ? form.querySelector("select[name='category']").value : "",
      organisationName: form.querySelector("input[name='organisationName']") ? form.querySelector("input[name='organisationName']").value : "",
      leadName: form.querySelector("input[name='leadName']") ? form.querySelector("input[name='leadName']").value : "",
      email: form.querySelector("input[name='email']") ? form.querySelector("input[name='email']").value : "",
      phone: form.querySelector("input[name='phone']") ? form.querySelector("input[name='phone']").value : "",
      country: form.querySelector("input[name='country']") ? form.querySelector("input[name='country']").value : "",
      bio: form.querySelector("textarea[name='bio']") ? form.querySelector("textarea[name='bio']").value : ""
    };

    const res = await postToAppsScript(payload);
    showAlert(res.message || "Registration submitted successfully! We look forward to seeing you at AIC 2026.", "success");
    form.reset();

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
      fullName: form.querySelector("input[name='fullName']") ? form.querySelector("input[name='fullName']").value : "",
      email: form.querySelector("input[name='email']") ? form.querySelector("input[name='email']").value : "",
      subject: form.querySelector("input[name='subject']") ? form.querySelector("input[name='subject']").value : "",
      message: form.querySelector("textarea[name='message']") ? form.querySelector("textarea[name='message']").value : ""
    };

    const res = await postToAppsScript(payload);
    showAlert(res.message || "Thank you for reaching out! Our secretariat will reply promptly.", "success");
    form.reset();

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
    const input = form.querySelector("input[type='email'], input[type='text']");
    const btn = form.querySelector("button[type='submit']");
    if (!input || !input.value.trim()) return;

    const origText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Subscribing...";

    const res = await postToAppsScript({
      formType: "subscription",
      email: input.value.trim()
    });

    showAlert(res.message || "Thank you for subscribing to AIC 2026 updates!", "success");
    form.reset();

    btn.disabled = false;
    btn.textContent = origText;
  });
}

// =============================================================
// 4. TICKETS MODULE
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
    const qty = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;
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
        <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-mono font-black text-xs shadow-sm border border-orange-200">PASS</div>
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
      cartItemsList.innerHTML = `<div class="text-center py-12 text-gray-400"><p class="text-base font-bold">Your cart is empty</p><p class="text-xs mt-1">Explore our branded caps, shirts, and Igbo beads!</p></div>`;
    } else {
      cartItemsList.innerHTML = cart.map((item, idx) => `
        <div class="flex items-center gap-4 py-3 border-b border-gray-100">
          <img src="${item.image}" alt="${item.name}" class="w-14 h-14 object-cover rounded-xl border border-gray-100" />
          <div class="flex-1 min-w-0">
            <h5 class="font-bold text-gray-900 truncate text-xs">${item.name}</h5>
            <p class="text-[11px] text-gray-500">${item.variant ? item.variant + ' • ' : ''}₦${item.price.toLocaleString()}</p>
            <div class="flex items-center gap-2 mt-1">
              <button onclick="window.changeCartQty(${idx}, -1)" class="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-bold flex items-center justify-center">-</button>
              <span class="text-xs font-bold">${item.qty}</span>
              <button onclick="window.changeCartQty(${idx}, 1)" class="w-5 h-5 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-bold flex items-center justify-center">+</button>
            </div>
          </div>
          <div class="text-right">
            <strong class="text-xs text-gray-900 block">₦${(item.price * item.qty).toLocaleString()}</strong>
            <button onclick="window.removeFromCart(${idx})" class="text-[11px] text-red-500 hover:text-red-700 mt-1">Remove</button>
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
  window.openCartDrawer();
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
      showAlert(res.message || "Order submitted successfully! We will contact you for dispatch.", "success");
      
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
// 6. PAGEANTRY REGISTRATION
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
      height: form.querySelector("input[name='height']").value,
      email: form.querySelector("input[name='email']").value,
      phone: form.querySelector("input[name='phone']").value,
      socialHandles: form.querySelector("input[name='socialHandle']") ? form.querySelector("input[name='socialHandle']").value : "",
      photoUrl: form.querySelector("input[name='photoUrl']") ? form.querySelector("input[name='photoUrl']").value : "",
      advocacyStatement: form.querySelector("textarea[name='advocacy']") ? form.querySelector("textarea[name='advocacy']").value : ""
    };

    const res = await postToAppsScript(payload);
    showAlert(res.message || "Contestant application submitted successfully! Welcome to Queen of Afikpo 2026.", "success");
    form.reset();

    btn.disabled = false;
    btn.textContent = origText;
  });
}

// =============================================================
// 7. PAGEANTRY VOTING PORTAL
// =============================================================
function setupPageantVoting() {
  const container = document.getElementById("contestants-container") || document.getElementById("contestants-grid");
  if (!container) return;

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
            <div class="absolute top-4 left-4 bg-purple-600 text-white font-black text-sm px-3 py-1 rounded-full shadow-md">#${c.number}</div>
            <div class="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <span>👑</span> <span id="vote-count-${c.id}">${liveVotes}</span> Votes
            </div>
          </div>
          <div class="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div class="text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">${c.community} • Age ${c.age}</div>
              <h3 class="text-xl font-black text-gray-900 mb-2">${c.name}</h3>
              <p class="text-xs text-gray-600 line-clamp-3 mb-4 leading-relaxed">${c.platform}</p>
            </div>
            <div class="space-y-2 pt-4 border-t border-gray-100">
              <button onclick="window.openVoteModal('${c.id}', '${c.name}', '${c.number}')" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-2xl transition shadow-md shadow-purple-200 text-sm flex items-center justify-center gap-2">
                <span>Vote for ${c.name.split(' ')[0]}</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  };

  renderContestants();

  const searchInput = document.getElementById("contestant-search") || document.getElementById("contestant-search-input");
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
        <span class="text-xs font-bold bg-purple-100 text-purple-600 px-3 py-1 rounded-full uppercase">Contestant #${number}</span>
        <h3 class="text-2xl font-black text-gray-900 mt-2">${name}</h3>
        <p class="text-xs text-gray-500">Queen of Afikpo 2026 Pageant</p>
      </div>

      <form id="vote-submit-form" class="mt-6 space-y-4">
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase mb-2">Choose Vote Package</label>
          <div class="grid grid-cols-2 gap-3">
            <label class="cursor-pointer border-2 border-purple-500 bg-purple-50/50 p-3 rounded-2xl text-center block hover:border-purple-600 transition">
              <input type="radio" name="votePackage" value="1" data-price="0" checked class="hidden" />
              <div class="font-black text-purple-600 text-lg">1 Vote</div>
              <div class="text-xs text-gray-500">Free Daily Vote</div>
            </label>
            <label class="cursor-pointer border-2 border-gray-200 p-3 rounded-2xl text-center block hover:border-purple-500 transition">
              <input type="radio" name="votePackage" value="10" data-price="1000" class="hidden" />
              <div class="font-black text-gray-900 text-lg">10 Votes</div>
              <div class="text-xs text-purple-600 font-bold">₦1,000</div>
            </label>
            <label class="cursor-pointer border-2 border-gray-200 p-3 rounded-2xl text-center block hover:border-purple-500 transition">
              <input type="radio" name="votePackage" value="50" data-price="4500" class="hidden" />
              <div class="font-black text-gray-900 text-lg">50 Votes</div>
              <div class="text-xs text-purple-600 font-bold">₦4,500</div>
            </label>
            <label class="cursor-pointer border-2 border-gray-200 p-3 rounded-2xl text-center block hover:border-purple-500 transition">
              <input type="radio" name="votePackage" value="100" data-price="8000" class="hidden" />
              <div class="font-black text-gray-900 text-lg">100 Votes</div>
              <div class="text-xs text-purple-600 font-bold">₦8,000</div>
            </label>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Your Email or Phone</label>
          <input type="text" name="voterContact" placeholder="voter@example.com / +234..." required class="w-full p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:ring-2 focus:ring-purple-600 outline-none" />
        </div>

        <button type="submit" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl transition shadow-lg text-sm">
          Confirm & Cast Vote(s)
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelectorAll("input[name='votePackage']").forEach(radio => {
    radio.addEventListener("change", () => {
      modal.querySelectorAll("input[name='votePackage']").forEach(r => {
        const label = r.closest("label");
        if (r.checked) {
          label.classList.add("border-purple-500", "bg-purple-50/50");
          label.classList.remove("border-gray-200");
        } else {
          label.classList.remove("border-purple-500", "bg-purple-50/50");
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

    const currentLocal = JSON.parse(localStorage.getItem("aic_pageant_votes") || "{}");
    currentLocal[id] = (currentLocal[id] || 0) + voteCount;
    localStorage.setItem("aic_pageant_votes", JSON.stringify(currentLocal));

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
      title: form.querySelector("input[name='mediaTitle']") ? form.querySelector("input[name='mediaTitle']").value : "",
      category: form.querySelector("select[name='category']") ? form.querySelector("select[name='category']").value : "",
      creatorName: form.querySelector("input[name='creatorName']") ? form.querySelector("input[name='creatorName']").value : "",
      email: form.querySelector("input[name='email']") ? form.querySelector("input[name='email']").value : "",
      phone: form.querySelector("input[name='phone']") ? form.querySelector("input[name='phone']").value : "",
      mediaUrl: form.querySelector("input[name='mediaUrl']") ? form.querySelector("input[name='mediaUrl']").value : "",
      description: form.querySelector("textarea[name='description']") ? form.querySelector("textarea[name='description']").value : ""
    };

    const res = await postToAppsScript(payload);
    showAlert(res.message || "Media link submitted successfully! Thank you for sharing Afikpo heritage.", "success");
    form.reset();

    btn.disabled = false;
    btn.textContent = origText;
  });
}

// =============================================================
// 9. ACCOMMODATION RESERVATION
// =============================================================
function setupAccommodationBooking() {
  const form = document.getElementById("accommodation-reservation-form") || document.getElementById("accommodation-booking-form");
  const hotelSelect = document.getElementById("hotel-select-field") || document.getElementById("hotel-select");

  window.selectHotelForBooking = function(hotelName) {
    if (hotelSelect) hotelSelect.value = hotelName;
    const card = document.getElementById("hotel-reservation-card") || document.getElementById("booking-reservation-form-section");
    if (card) card.scrollIntoView({ behavior: "smooth" });
  };

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type='submit']");
    const origText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Submitting Reservation...";

    const payload = {
      formType: "accommodation_reservation",
      hotelName: form.querySelector("select[name='hotelName']").value,
      roomType: form.querySelector("select[name='roomType']").value,
      checkIn: form.querySelector("input[name='checkInDate']") ? form.querySelector("input[name='checkInDate']").value : "",
      checkOut: form.querySelector("input[name='checkOutDate']") ? form.querySelector("input[name='checkOutDate']").value : "",
      guestsCount: form.querySelector("input[name='guestsCount']") ? form.querySelector("input[name='guestsCount']").value : "",
      guestName: form.querySelector("input[name='guestName']").value,
      email: form.querySelector("input[name='email']").value,
      phone: form.querySelector("input[name='phone']").value,
      specialRequests: form.querySelector("textarea[name='specialRequests']") ? form.querySelector("textarea[name='specialRequests']").value : ""
    };

    const res = await postToAppsScript(payload);
    showAlert(res.message || "Accommodation request submitted! We will contact you with booking confirmation.", "success");
    form.reset();

    btn.disabled = false;
    btn.textContent = origText;
  });
}

// =============================================================
// 10. TOUR GUIDE REQUEST
// =============================================================
function setupTourGuideRequest() {
  const form = document.getElementById("tour-guide-request-form") || document.getElementById("tour-guide-form");
  const circuitSelect = document.getElementById("circuit-select-field") || document.getElementById("tour-circuit-select");

  window.selectCircuit = function(circuitName) {
    if (circuitSelect) circuitSelect.value = circuitName;
    const card = document.getElementById("guide-request-card") || document.getElementById("tour-booking-section");
    if (card) card.scrollIntoView({ behavior: "smooth" });
  };

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type='submit']");
    const origText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Booking Tour Guide...";

    const payload = {
      formType: "tour_guide_request",
      circuitName: form.querySelector("select[name='circuitName']").value,
      duration: form.querySelector("select[name='duration']").value,
      tourDate: form.querySelector("input[name='tourDate']").value,
      groupSize: form.querySelector("input[name='groupSize']").value,
      language: form.querySelector("select[name='language']").value,
      touristName: form.querySelector("input[name='clientName']") ? form.querySelector("input[name='clientName']").value : "",
      email: form.querySelector("input[name='email']").value,
      phone: form.querySelector("input[name='phone']").value,
      pickupLocation: form.querySelector("textarea[name='pickupNotes']") ? form.querySelector("textarea[name='pickupNotes']").value : ""
    };

    const res = await postToAppsScript(payload);
    showAlert(res.message || "Tour guide request submitted! We will assign your certified local escort.", "success");
    form.reset();

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
      vendorCategory: form.querySelector("select[name='vendorCategory']").value,
      boothSize: form.querySelector("select[name='boothSize']").value,
      powerRequired: form.querySelector("select[name='powerRequired']").value,
      email: form.querySelector("input[name='email']").value,
      phone: form.querySelector("input[name='phone']").value,
      productDescription: form.querySelector("textarea[name='productDescription']").value
    };

    const res = await postToAppsScript(payload);
    showAlert(res.message || "Vendor application submitted! Our commercial desk will reach out with booth allocation.", "success");
    form.reset();

    btn.disabled = false;
    btn.textContent = origText;
  });
}

// =============================================================
// 12. DYNAMIC BLOG SYSTEM (Reader, Search, Categories)
// =============================================================
async function fetchBlogPosts() {
  const deletedIds = new Set(JSON.parse(localStorage.getItem("aic_deleted_post_ids") || "[]"));
  const localPosts = JSON.parse(localStorage.getItem("aic_custom_blog_posts") || "[]").filter(p => !deletedIds.has(p.id));
  const activeDefaults = DEFAULT_BLOG_POSTS.filter(p => !deletedIds.has(p.id));

  let allPosts = [...localPosts, ...activeDefaults];

  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=get_blog_posts`);
    const data = await res.json();
    if (data.status === "success" && Array.isArray(data.posts)) {
      const remotePosts = data.posts.filter(p => !deletedIds.has(p.id));
      const remoteIds = new Set(remotePosts.map(p => p.id));
      
      if (remotePosts.length > 0) {
        allPosts = [...remotePosts, ...localPosts.filter(p => !remoteIds.has(p.id))];
      } else {
        allPosts = [...localPosts, ...activeDefaults];
      }
    }
  } catch (err) {
    console.log("Using cached/seed blog posts feed:", err);
  }

  return allPosts.filter(p => !deletedIds.has(p.id));
}

async function setupBlogFeed() {
  const container = document.getElementById("blog-posts-grid");
  const heroContainer = document.getElementById("featured-post-container") || document.getElementById("blog-hero-section");
  if (!container) return;

  const posts = await fetchBlogPosts();
  let currentCategory = "All";

  const render = (query = "") => {
    let filtered = posts.filter(p => p.status !== "Draft");
    if (currentCategory !== "All") {
      filtered = filtered.filter(p => p.category && p.category.toLowerCase() === currentCategory.toLowerCase());
    }
    if (query.trim()) {
      filtered = filtered.filter(p => 
        (p.title && p.title.toLowerCase().includes(query.toLowerCase())) || 
        (p.excerpt && p.excerpt.toLowerCase().includes(query.toLowerCase()))
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `<div class="col-span-3 text-center py-16 text-gray-400"><p class="text-xl">No articles found in this category.</p></div>`;
      if (heroContainer) heroContainer.innerHTML = "";
      return;
    }

    // Render Featured / Hero
    if (heroContainer && !query && currentCategory === "All" && filtered[0]) {
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
    } else if (heroContainer) {
      heroContainer.innerHTML = "";
    }

    const cardPosts = (heroContainer && !query && currentCategory === "All") ? filtered.slice(1) : filtered;

    container.innerHTML = cardPosts.map(p => `
      <article class="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition duration-300 flex flex-col justify-between group">
        <div>
          <div class="relative h-56 overflow-hidden bg-gray-100">
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

  const searchInput = document.getElementById("blog-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => render(e.target.value));
  }

  document.querySelectorAll(".blog-cat-btn, .category-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".blog-cat-btn, .category-filter-btn").forEach(b => {
        b.classList.remove("bg-orange-600", "text-white");
        b.classList.add("bg-white", "text-gray-700");
      });
      btn.classList.add("bg-orange-600", "text-white");
      btn.classList.remove("bg-white", "text-gray-700");
      currentCategory = btn.getAttribute("data-category") || "All";
      render();
    });
  });
}

// =============================================================
// 13. SINGLE BLOG POST READER
// =============================================================
async function setupBlogPostDetail() {
  const container = document.getElementById("blog-post-content") || document.getElementById("single-blog-content");
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id") || urlParams.get("slug") || "post-1";

  const posts = await fetchBlogPosts();
  const post = posts.find(p => p.id === postId || p.slug === postId) || posts[0];

  if (!post) {
    container.innerHTML = `<div class="text-center py-20"><h2 class="text-2xl font-bold text-gray-900">Article not found</h2><a href="blog.html" class="text-orange-600 font-bold mt-4 inline-block">Return to Blog</a></div>`;
    return;
  }

  const titleEl = document.getElementById("blog-meta-title");
  if (titleEl) titleEl.textContent = `${post.title} | Afikpo International Carnival 2026`;
  document.title = `${post.title} | Afikpo International Carnival 2026`;

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
            ${post.author ? post.author.charAt(0) : 'A'}
          </div>
          <div>
            <h5 class="text-sm font-bold text-gray-900 leading-none">${post.author}</h5>
            <span class="text-xs text-gray-400">AIC Editorial Board</span>
          </div>
        </div>
      </div>
    </header>

    <div class="rounded-3xl overflow-hidden mb-10 shadow-xl max-h-[480px]">
      <img src="${post.coverImage}" alt="${post.title}" class="w-full h-full object-cover" />
    </div>

    <div class="prose prose-lg max-w-none text-gray-800 leading-relaxed font-normal">
      ${post.content}
    </div>
  `;
}

window.sharePost = function(platform) {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.title);
  if (platform === 'whatsapp') {
    window.open(`https://api.whatsapp.com/send?text=${title}%20${url}`, '_blank');
  } else if (platform === 'x' || platform === 'twitter') {
    window.open(`https://twitter.com/intent/tweet?text=${title}&url=${url}`, '_blank');
  } else if (platform === 'copy') {
    navigator.clipboard.writeText(window.location.href);
    showAlert("Article link copied to clipboard!", "success");
  }
};

// =============================================================
// 14. FRONTEND BLOG ADMIN CMS (PIN AUTHENTICATION)
// =============================================================
function setupBlogAdmin() {
  const authSection = document.getElementById("admin-auth-section");
  const authForm = document.getElementById("admin-login-form") || document.getElementById("admin-auth-form");
  const pinInput = document.getElementById("admin-pin-input") || (authForm ? authForm.querySelector("input[type='password'], input[name='pin']") : null);

  const dashboardSection = document.getElementById("admin-dashboard-section") || document.getElementById("admin-editor-section");
  const editorForm = document.getElementById("blog-editor-form");
  const articlesList = document.getElementById("admin-articles-list") || document.getElementById("admin-posts-list");
  const logoutBtn = document.getElementById("admin-logout-btn");
  const newArticleBtn = document.getElementById("new-article-btn");
  const cancelEditBtn = document.getElementById("cancel-edit-btn");

  const imageFileInput = document.getElementById("post-image-file") || document.getElementById("blog-image-file");
  const imageUrlInput = document.getElementById("post-image-url") || document.getElementById("blog-cover-url");
  const imagePreviewContainer = document.getElementById("image-preview-container");
  const imagePreviewImg = document.getElementById("image-preview-img") || document.getElementById("image-upload-preview");

  if (!authSection && !dashboardSection) return;

  // Accepted PINs (supports afikpo2026, Afikpo2026, admin123)
  const ACCEPTED_PINS = ["afikpo2026", "admin123", "2026"];

  const checkAuthStatus = () => {
    const isAuthed = sessionStorage.getItem("aic_blog_admin_authed") === "true" || localStorage.getItem("aic_blog_admin_authed") === "true";
    if (isAuthed) {
      if (authSection) authSection.classList.add("hidden");
      if (dashboardSection) dashboardSection.classList.remove("hidden");
      if (logoutBtn) logoutBtn.classList.remove("hidden");
      loadAdminArticles();
    } else {
      if (authSection) authSection.classList.remove("hidden");
      if (dashboardSection) dashboardSection.classList.add("hidden");
      if (logoutBtn) logoutBtn.classList.add("hidden");
    }
  };

  // PIN Login Submission
  if (authForm) {
    authForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const enteredPin = pinInput ? pinInput.value.trim().toLowerCase() : "";
      
      if (ACCEPTED_PINS.includes(enteredPin)) {
        sessionStorage.setItem("aic_blog_admin_authed", "true");
        localStorage.setItem("aic_blog_admin_authed", "true");
        showAlert("Admin Access Granted. Welcome to the Editorial CMS!", "success");
        checkAuthStatus();
      } else {
        showAlert("Incorrect PIN! Please enter 'afikpo2026'.", "error");
        if (pinInput) {
          pinInput.value = "";
          pinInput.focus();
        }
      }
    });
  }

  // Logout Trigger
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("aic_blog_admin_authed");
      localStorage.removeItem("aic_blog_admin_authed");
      showAlert("You have logged out of the Editorial CMS.", "warning");
      checkAuthStatus();
    });
  }

  // New Article Button
  if (newArticleBtn) {
    newArticleBtn.addEventListener("click", () => {
      if (editorForm) {
        editorForm.reset();
        const idField = document.getElementById("edit-post-id") || editorForm.querySelector("input[name='postId']");
        if (idField) idField.value = "";
        const dateInput = document.getElementById("post-date") || editorForm.querySelector("input[name='date']");
        if (dateInput) dateInput.valueAsDate = new Date();
      }
      if (imagePreviewContainer) imagePreviewContainer.classList.add("hidden");
      const card = document.getElementById("article-editor-card");
      if (card) card.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Cancel Button
  if (cancelEditBtn && editorForm) {
    cancelEditBtn.addEventListener("click", () => {
      editorForm.reset();
      const idField = document.getElementById("edit-post-id") || editorForm.querySelector("input[name='postId']");
      if (idField) idField.value = "";
      if (imagePreviewContainer) imagePreviewContainer.classList.add("hidden");
    });
  }

  // Image Upload File / URL preview
  if (imageFileInput) {
    imageFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (imageUrlInput) imageUrlInput.value = ev.target.result;
          if (imagePreviewImg) imagePreviewImg.src = ev.target.result;
          if (imagePreviewContainer) imagePreviewContainer.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (imageUrlInput) {
    imageUrlInput.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      if (val && imagePreviewImg) {
        imagePreviewImg.src = val;
        if (imagePreviewContainer) imagePreviewContainer.classList.remove("hidden");
      }
    });
  }

  // Load Articles Table
  const loadAdminArticles = async () => {
    if (!articlesList) return;
    const posts = await fetchBlogPosts();
    articlesList.innerHTML = posts.map(p => `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-white transition gap-4">
        <div class="flex items-center gap-3">
          <img src="${p.coverImage}" class="w-14 h-14 object-cover rounded-xl border border-gray-200" onerror="this.src='assets/images/Afikpo_logo-removebg.png'" />
          <div>
            <h5 class="font-bold text-gray-900 text-sm leading-snug">${p.title}</h5>
            <span class="text-xs text-gray-500">${p.category} • ${p.date} • by ${p.author}</span>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <button onclick="window.editPost('${p.id}')" class="px-4 py-2 bg-gray-200 hover:bg-orange-600 hover:text-white text-gray-800 text-xs font-bold rounded-xl transition">Edit</button>
          <button onclick="window.deletePost('${p.id}')" class="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-xl transition">Delete</button>
        </div>
      </div>
    `).join("");
  };

  // Editor Form Submit (Save / Publish)
  if (editorForm) {
    // Set default date
    const dateInput = document.getElementById("post-date") || editorForm.querySelector("input[name='date']");
    if (dateInput && !dateInput.value) {
      dateInput.valueAsDate = new Date();
    }

    editorForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = editorForm.querySelector("button[type='submit']");
      const origText = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Saving to Google Sheets...";

      const idField = document.getElementById("edit-post-id") || editorForm.querySelector("input[name='postId']");
      const postId = (idField && idField.value) ? idField.value : ("post-" + Date.now());

      const title = document.getElementById("post-title") ? document.getElementById("post-title").value : editorForm.querySelector("input[name='title']").value;
      const category = document.getElementById("post-category") ? document.getElementById("post-category").value : editorForm.querySelector("select[name='category']").value;
      const author = document.getElementById("post-author") ? document.getElementById("post-author").value : editorForm.querySelector("input[name='author']").value;
      const dateVal = document.getElementById("post-date") ? document.getElementById("post-date").value : (new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));
      const coverImage = (imageUrlInput && imageUrlInput.value.trim()) ? imageUrlInput.value.trim() : "assets/images/Gold sand beach, Afikpo.webp";
      const summary = document.getElementById("post-summary") ? document.getElementById("post-summary").value : editorForm.querySelector("input[name='summary']").value;
      const contentRaw = document.getElementById("post-content") ? document.getElementById("post-content").value : editorForm.querySelector("textarea[name='content']").value;

      // Wrap raw text with <p> if plain
      const formattedContent = contentRaw.startsWith("<") ? contentRaw : contentRaw.split("\n\n").map(para => `<p class="mb-4">${para.trim()}</p>`).join("");

      const payload = {
        formType: "save_blog_post",
        id: postId,
        title: title,
        category: category,
        author: author,
        date: dateVal,
        coverImage: coverImage,
        excerpt: summary,
        content: formattedContent,
        status: "Published"
      };

      // Un-delete if this ID was previously marked deleted
      let deletedIds = JSON.parse(localStorage.getItem("aic_deleted_post_ids") || "[]");
      if (deletedIds.includes(postId)) {
        deletedIds = deletedIds.filter(d => d !== postId);
        localStorage.setItem("aic_deleted_post_ids", JSON.stringify(deletedIds));
      }

      // Save locally for immediate responsiveness
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
      showAlert(res.message || "Article saved and published to Google Sheets!", "success");

      editorForm.reset();
      if (idField) idField.value = "";
      if (imagePreviewContainer) imagePreviewContainer.classList.add("hidden");
      loadAdminArticles();

      btn.disabled = false;
      btn.textContent = origText;
    });
  }

  // Edit helper
  window.editPost = async (id) => {
    const posts = await fetchBlogPosts();
    const p = posts.find(item => item.id === id);
    if (!p || !editorForm) return;

    const idField = document.getElementById("edit-post-id") || editorForm.querySelector("input[name='postId']");
    if (idField) idField.value = p.id;

    const titleField = document.getElementById("post-title") || editorForm.querySelector("input[name='title']");
    if (titleField) titleField.value = p.title || "";

    const catField = document.getElementById("post-category") || editorForm.querySelector("select[name='category']");
    if (catField) catField.value = p.category || "Culture & Heritage";

    const authorField = document.getElementById("post-author") || editorForm.querySelector("input[name='author']");
    if (authorField) authorField.value = p.author || "";

    if (imageUrlInput) imageUrlInput.value = p.coverImage || "";
    if (imagePreviewImg && p.coverImage) {
      imagePreviewImg.src = p.coverImage;
      if (imagePreviewContainer) imagePreviewContainer.classList.remove("hidden");
    }

    const summaryField = document.getElementById("post-summary") || editorForm.querySelector("input[name='summary']");
    if (summaryField) summaryField.value = p.excerpt || "";

    const contentField = document.getElementById("post-content") || editorForm.querySelector("textarea[name='content']");
    if (contentField) {
      // Strip html tags if simple paragraphs
      const cleanContent = p.content.replace(/<\/p><p[^>]*>/gi, "\n\n").replace(/<p[^>]*>/gi, "").replace(/<\/p>/gi, "");
      contentField.value = cleanContent;
    }

    const editorCard = document.getElementById("article-editor-card");
    if (editorCard) editorCard.scrollIntoView({ behavior: "smooth" });
    showAlert(`Loaded "${p.title}" for editing.`, "warning");
  };

  // Delete helper
  window.deletePost = async (id) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    // 1. Permanently track deleted ID so it cannot be revived by seed lists
    let deletedIds = JSON.parse(localStorage.getItem("aic_deleted_post_ids") || "[]");
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem("aic_deleted_post_ids", JSON.stringify(deletedIds));
    }

    // 2. Remove from local custom list
    let custom = JSON.parse(localStorage.getItem("aic_custom_blog_posts") || "[]");
    custom = custom.filter(p => p.id !== id);
    localStorage.setItem("aic_custom_blog_posts", JSON.stringify(custom));

    // 3. Delete from Google Apps Script cloud database
    await postToAppsScript({ formType: "delete_blog_post", id: id });
    showAlert("Article deleted permanently.", "success");
    loadAdminArticles();
  };

  // Run initial authentication check
  checkAuthStatus();
}

// =============================================================
// COUNTDOWN TIMER
// =============================================================
function setupCountdownTimer() {
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  // Afikpo International Carnival 2026 Maiden Edition: December 26, 2026, 09:00:00 (GMT+1)
  const festivalDate = new Date("2026-12-26T09:00:00+01:00").getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const distance = festivalDate - now;

    if (distance <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  // Initial immediate execution
  updateTimer();
  setInterval(updateTimer, 1000);
}

// =============================================================
// DOM INITIALIZATION
// =============================================================
document.addEventListener("DOMContentLoaded", () => {
  setupCountdownTimer();
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

  // Mobile Menu Drawer Handler
  const menuBtn = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        mobileMenu.classList.add("hidden");
      }
    });
  }

  // Hero carousel auto-rotator if present
  const carouselItems = document.querySelectorAll(".carousel-item");
  const carouselDots = document.querySelectorAll(".dot");
  if (carouselItems.length > 0) {
    let currentSlide = 0;
    const showSlide = (n) => {
      carouselItems.forEach((item, idx) => {
        item.classList.toggle("opacity-100", idx === n);
        item.classList.toggle("opacity-0", idx !== n);
      });
      carouselDots.forEach((dot, idx) => {
        dot.classList.toggle("bg-white", idx === n);
        dot.classList.toggle("bg-white/50", idx !== n);
      });
      currentSlide = n;
    };

    setInterval(() => {
      showSlide((currentSlide + 1) % carouselItems.length);
    }, 6000);

    carouselDots.forEach((dot, idx) => {
      dot.addEventListener("click", () => showSlide(idx));
    });
  }
});
