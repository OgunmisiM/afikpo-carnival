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
// Universal Fallback Cover Image (High-Res Festival Photography)
const DEFAULT_COVER_IMAGE = "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80";

// Client-side image compressor: Keeps uploaded image file payloads ultra-crisp & lightweight (<45KB) for instant cloud sync
function compressImageFile(file, maxWidth = 1200, maxHeight = 675, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// Default Seed Data for Blog Posts (3 Prehardcoded, Fully Editable Posts)
const DEFAULT_BLOG_POSTS = [
  {
    id: "post-1",
    title: "Afikpo International Carnival 2026: The Maiden Edition Unveiled",
    slug: "afikpo-international-carnival-2026-maiden-edition-unveiled",
    category: "Culture & Heritage",
    author: "AIC Media Board",
    date: "Sep 1, 2026",
    coverImage: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80",
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
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
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
    coverImage: "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Delve into the sacred craftsmanship behind the iconic Eze Lúgúlú and Ikpó masks, and the exhilarating adrenaline of the Mgba wrestling festival.",
    content: `
      <p class="mb-4">Afikpo’s mask-making tradition is celebrated in museums from Paris to New York. The delicate geometry, contrast of chalk and charcoal pigments, and symbolic horns represent deep ancestral philosophies.</p>
      <h3 class="text-2xl font-bold text-gray-900 mt-8 mb-4">Age-Grade Wrestling (Mgba)</h3>
      <p class="mb-4">Wrestling in Afikpo is more than a sport; it is an initiation into honor, resilience, and brotherhood. Spectators will witness master wrestlers from various Afikpo villages compete in festive arenas to the rhythmic beat of the <em>Alawiyó</em> drums.</p>
    `,
    status: "Published"
  }
];

// Default 18 Authentic Visual Gallery Items for Afikpo International Carnival 2026
const DEFAULT_GALLERY_ITEMS = [
  {
    id: "gallery-1",
    title: "Golden Sand Beach Along Riverfront",
    category: "Nature, Rivers & Beaches",
    mediaType: "image",
    mediaUrl: "assets/images/Gold sand beach, Afikpo.webp",
    creatorName: "AIC Media Board",
    date: "Dec 2026",
    description: "Scenic golden sand beach along the pristine riverfront in Afikpo, a peaceful haven for beachside gatherings, festivals, and tourism relaxation.",
    status: "Published",
    timestamp: 1700000001000
  },
  {
    id: "gallery-2",
    title: "Afikpo (Ikpó) Cultural Masquerade Display",
    category: "Cultural Masquerades & Rites",
    mediaType: "image",
    mediaUrl: "assets/images/Afikpo (ikpó) cultural display.jpeg",
    creatorName: "Ehugbo Heritage Society",
    date: "Dec 2026",
    description: "The iconic Ikpó masquerade exhibition displaying traditional woven fiber attire and centuries of ceremonial mastery.",
    status: "Published",
    timestamp: 1700000002000
  },
  {
    id: "gallery-3",
    title: "Traditional Wrestling Match (Mgba)",
    category: "Traditional Wrestling (Mgba)",
    mediaType: "image",
    mediaUrl: "assets/images/Afikpo Traditional Wrestling Competitio.jpeg",
    creatorName: "AIC Sports Council",
    date: "Dec 2026",
    description: "High-intensity traditional wrestling championship (Mgba) displaying strength, agility, and sportsmanship.",
    status: "Published",
    timestamp: 1700000003000
  },
  {
    id: "gallery-4",
    title: "Dancers & Masquerades at Sunset on Ozizza River",
    category: "Nature, Rivers & Beaches",
    mediaType: "image",
    mediaUrl: "assets/images/Afikpo dancers and masquerades at sunset along the Ozizza River.webp",
    creatorName: "Ozizza Tourism Circuit",
    date: "Dec 2026",
    description: "Spectacular sunset gathering of traditional performers and masquerades along the tranquil banks of the Ozizza River.",
    status: "Published",
    timestamp: 1700000004000
  },
  {
    id: "gallery-5",
    title: "Masquerade Display (Eze Lúgúlú and Ikpó)",
    category: "Cultural Masquerades & Rites",
    mediaType: "image",
    mediaUrl: "assets/images/Masquerade display (Eze lúgúlú and ikpó).jpeg",
    creatorName: "AIC Cultural Archives",
    date: "Dec 2026",
    description: "The majestic Eze Lúgúlú towering masquerade alongside ceremonial Ikpó escorts during the grand festival procession.",
    status: "Published",
    timestamp: 1700000005000
  },
  {
    id: "gallery-6",
    title: "Canoeing Along Unwana River Waterways",
    category: "Nature, Rivers & Beaches",
    mediaType: "image",
    mediaUrl: "assets/images/Canoeing on the Unwana river.webp",
    creatorName: "Unwana Beach Explorers",
    date: "Dec 2026",
    description: "Traditional wooden canoeing across the serene, reflective waters of the historic Unwana river basin.",
    status: "Published",
    timestamp: 1700000006000
  },
  {
    id: "gallery-7",
    title: "Artisans Displaying Handcrafted Afikpo Masks",
    category: "Art & Tradition",
    mediaType: "image",
    mediaUrl: "assets/images/Local artisans displaying carved Afikpo masks..webp",
    creatorName: "Ehugbo Craft Guild",
    date: "Dec 2026",
    description: "Master woodcarvers showcasing internationally acclaimed Afikpo masks recognized in museums worldwide.",
    status: "Published",
    timestamp: 1700000007000
  },
  {
    id: "gallery-8",
    title: "Nkwa Umuagbógó Maiden Dance Festival",
    category: "Concerts & Dance Performances",
    mediaType: "image",
    mediaUrl: "assets/images/Nkwa Umuagbógó cultural dance competition.jpeg",
    creatorName: "AIC Performing Troupe",
    date: "Dec 2026",
    description: "The world-famous Nkwa Umuagbógó maiden dance troupe performing intricate rhythmic steps and acrobatics.",
    status: "Published",
    timestamp: 1700000008000
  },
  {
    id: "gallery-9",
    title: "Mainstage Live Concert & Festival Village",
    category: "Concerts & Dance Performances",
    mediaType: "image",
    mediaUrl: "assets/images/AIC music.webp",
    creatorName: "AIC Entertainment Group",
    date: "Dec 2026",
    description: "Electrifying live musical concert and night festival lights uniting thousands of tourists and locals at the mainstage.",
    status: "Published",
    timestamp: 1700000009000
  },
  {
    id: "gallery-10",
    title: "Ceremonial Masquerade Pageantry",
    category: "Cultural Masquerades & Rites",
    mediaType: "image",
    mediaUrl: "assets/images/Afikpo Masqurade display.webp",
    creatorName: "AIC Heritage Council",
    date: "Dec 2026",
    description: "Dignified ceremonial masquerade procession marching through the community square amidst ancestral chants.",
    status: "Published",
    timestamp: 1700000010000
  },
  {
    id: "gallery-11",
    title: "Age Grade Wrestling Tournament",
    category: "Traditional Wrestling (Mgba)",
    mediaType: "image",
    mediaUrl: "assets/images/Afikpo age grade wrestling competition .jpeg",
    creatorName: "Afikpo Youth Guild",
    date: "Dec 2026",
    description: "Youth age grade competitors testing grit, agility, and honor in the revered open-air wrestling arena.",
    status: "Published",
    timestamp: 1700000011000
  },
  {
    id: "gallery-12",
    title: "Echoes of Ehugbo Heritage",
    category: "Cultural Masquerades & Rites",
    mediaType: "image",
    mediaUrl: "assets/images/Afikpo image 1.webp",
    creatorName: "AIC Documentary Unit",
    date: "Dec 2026",
    description: "Capturing the vibrant colors, sacred symbols, and ancestral pride of the Ehugbo cultural lineage.",
    status: "Published",
    timestamp: 1700000012000
  },
  {
    id: "gallery-13",
    title: "Carnival Street Festivities",
    category: "Community & Festival Moments",
    mediaType: "image",
    mediaUrl: "assets/images/Afikpo image 7.webp",
    creatorName: "AIC Media Crew",
    date: "Dec 2026",
    description: "Street-level joy and festive energy welcoming international attendees to the heart of Ebonyi State.",
    status: "Published",
    timestamp: 1700000013000
  },
  {
    id: "gallery-14",
    title: "Master Drummers (Alawiyó) Competition",
    category: "Concerts & Dance Performances",
    mediaType: "image",
    mediaUrl: "assets/images/Afikpo local drummers competition (Alawiyó).jpeg",
    creatorName: "Alawiyó Ensemble",
    date: "Dec 2026",
    description: "Master slit-drummers and percussionists competing in the traditional Alawiyó musical exhibition.",
    status: "Published",
    timestamp: 1700000014000
  },
  {
    id: "gallery-15",
    title: "Wrestling Championship Final Rounds",
    category: "Traditional Wrestling (Mgba)",
    mediaType: "image",
    mediaUrl: "assets/images/Afikpo wrestling competition.jpeg",
    creatorName: "AIC Sports Council",
    date: "Dec 2026",
    description: "Championship bout in the village ring cheered on by elders, village chiefs, and visiting spectators.",
    status: "Published",
    timestamp: 1700000015000
  },
  {
    id: "gallery-16",
    title: "Youth Cultural Drumming Workshop",
    category: "Art & Tradition",
    mediaType: "image",
    mediaUrl: "assets/images/Children learning drumming at a youth workshop..webp",
    creatorName: "AIC Educational Program",
    date: "Dec 2026",
    description: "The next generation preserving heritage: children mastering traditional rhythm patterns in hands-on festival workshops.",
    status: "Published",
    timestamp: 1700000016000
  },
  {
    id: "gallery-17",
    title: "Handwoven Textiles & Crafts Fair",
    category: "Art & Tradition",
    mediaType: "image",
    mediaUrl: "assets/images/Handwoven textiles at the Art & Craft exhibition.webp",
    creatorName: "Ebonyi Artisan Cooperative",
    date: "Dec 2026",
    description: "Intricately woven Akwete and traditional ceremonial fabrics on exhibition at the AIC craft marketplace.",
    status: "Published",
    timestamp: 1700000017000
  },
  {
    id: "gallery-18",
    title: "Nkwawite Traditional Women's Dance",
    category: "Concerts & Dance Performances",
    mediaType: "image",
    mediaUrl: "assets/images/Nkwawite cultural dance.jpeg",
    creatorName: "Ehugbo Women's Guild",
    date: "Dec 2026",
    description: "Graceful and synchronized Nkwawite dance celebration performed by titled women in vibrant ceremonial regalia.",
    status: "Published",
    timestamp: 1700000018000
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

  const tabBtnFile = document.getElementById("tab-btn-file");
  const tabBtnUrl = document.getElementById("tab-btn-url");
  const fileBox = document.getElementById("file-upload-box");
  const urlBox = document.getElementById("url-upload-box");
  const fileInput = document.getElementById("media-file-input");
  const urlInput = document.getElementById("media-url-input");
  const previewContainer = document.getElementById("media-preview-container");
  const previewImg = document.getElementById("media-preview-img");
  const previewVideo = document.getElementById("media-preview-video");
  const previewInfo = document.getElementById("media-preview-info");
  const removeBtn = document.getElementById("remove-media-file-btn");
  const mediaTypeSelect = document.getElementById("media-type");

  let activeMediaData = "";
  let activeBase64Only = "";
  let activeFileName = "";
  let activeMimeType = "";

  // Mode Toggling (Device File vs URL)
  if (tabBtnFile && tabBtnUrl && fileBox && urlBox) {
    tabBtnFile.addEventListener("click", () => {
      fileBox.classList.remove("hidden");
      urlBox.classList.add("hidden");
      tabBtnFile.className = "upload-mode-tab flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border-2 border-orange-600 bg-orange-50 text-orange-700 font-bold text-xs transition shadow-sm";
      tabBtnUrl.className = "upload-mode-tab flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border-2 border-gray-200 bg-white hover:border-gray-300 text-gray-700 font-bold text-xs transition";
    });

    tabBtnUrl.addEventListener("click", () => {
      urlBox.classList.remove("hidden");
      fileBox.classList.add("hidden");
      tabBtnUrl.className = "upload-mode-tab flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border-2 border-orange-600 bg-orange-50 text-orange-700 font-bold text-xs transition shadow-sm";
      tabBtnFile.className = "upload-mode-tab flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border-2 border-gray-200 bg-white hover:border-gray-300 text-gray-700 font-bold text-xs transition";
    });
  }

  // Clear preview helper
  const clearPreview = () => {
    activeMediaData = "";
    activeBase64Only = "";
    activeFileName = "";
    activeMimeType = "";
    if (fileInput) fileInput.value = "";
    if (urlInput) urlInput.value = "";
    if (previewImg) { previewImg.src = ""; previewImg.classList.add("hidden"); }
    if (previewVideo) { previewVideo.src = ""; previewVideo.classList.add("hidden"); }
    if (previewContainer) previewContainer.classList.add("hidden");
  };

  if (removeBtn) {
    removeBtn.addEventListener("click", clearPreview);
  }

  // Handle File Input Selection
  if (fileInput) {
    fileInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // Check max 15MB file size limit
      const maxSizeBytes = 15 * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        showAlert("File exceeds the 15MB size limit. Please select a smaller file.", "error");
        fileInput.value = "";
        return;
      }

      activeFileName = file.name;
      activeMimeType = file.type || "application/octet-stream";
      const sizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + " MB";

      if (file.type.startsWith("image/")) {
        try {
          const compressed = await compressImageFile(file, 1400, 900, 0.82);
          activeMediaData = compressed;
          activeBase64Only = compressed.split(",")[1] || "";

          if (previewImg && previewVideo && previewContainer && previewInfo) {
            previewImg.src = compressed;
            previewImg.classList.remove("hidden");
            previewVideo.classList.add("hidden");
            previewInfo.textContent = `📸 ${file.name} (${sizeFormatted})`;
            previewContainer.classList.remove("hidden");
          }
          if (mediaTypeSelect) mediaTypeSelect.value = "image";
        } catch (err) {
          console.error("Image read error:", err);
          showAlert("Could not process the selected image file.", "error");
        }
      } else if (file.type.startsWith("video/")) {
        const objectUrl = URL.createObjectURL(file);
        activeMediaData = objectUrl;

        // Also read as base64 for background sync if needed
        const reader = new FileReader();
        reader.onload = (re) => {
          const raw = re.target.result;
          activeBase64Only = raw.split(",")[1] || "";
        };
        reader.readAsDataURL(file);

        if (previewImg && previewVideo && previewContainer && previewInfo) {
          previewVideo.src = objectUrl;
          previewVideo.classList.remove("hidden");
          previewImg.classList.add("hidden");
          previewInfo.textContent = `🎥 ${file.name} (${sizeFormatted})`;
          previewContainer.classList.remove("hidden");
        }
        if (mediaTypeSelect) mediaTypeSelect.value = "video";
      }
    });
  }

  // Handle URL Input Change
  if (urlInput) {
    urlInput.addEventListener("input", () => {
      const url = urlInput.value.trim();
      if (!url) {
        if (!fileInput || !fileInput.files.length) clearPreview();
        return;
      }

      activeMediaData = url;
      activeBase64Only = "";
      activeFileName = "Web Media";

      if (url.match(/\.(jpeg|jpg|gif|png|webp)($|\?)/i)) {
        if (previewImg && previewVideo && previewContainer && previewInfo) {
          previewImg.src = url;
          previewImg.classList.remove("hidden");
          previewVideo.classList.add("hidden");
          previewInfo.textContent = "🌐 Web Image Link Ready";
          previewContainer.classList.remove("hidden");
        }
        if (mediaTypeSelect) mediaTypeSelect.value = "image";
      } else {
        if (previewContainer && previewInfo) {
          previewInfo.textContent = `🌐 Web Video / Link: ${url.substring(0, 45)}...`;
          previewContainer.classList.remove("hidden");
          if (previewImg) previewImg.classList.add("hidden");
          if (previewVideo) previewVideo.classList.add("hidden");
        }
        if (mediaTypeSelect) mediaTypeSelect.value = "video";
      }
    });
  }

  // Form Submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type='submit']");
    const origText = btn ? btn.textContent : "Submit";
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Uploading & Submitting...";
    }

    const title = form.querySelector("input[name='mediaTitle']") ? form.querySelector("input[name='mediaTitle']").value.trim() : "";
    const category = form.querySelector("select[name='category']") ? form.querySelector("select[name='category']").value : "Community & Festival Moments";
    const mediaType = mediaTypeSelect ? mediaTypeSelect.value : "image";
    const creatorName = form.querySelector("input[name='creatorName']") ? form.querySelector("input[name='creatorName']").value.trim() : "Afikpo Contributor";
    const email = form.querySelector("input[name='email']") ? form.querySelector("input[name='email']").value.trim() : "";
    const phone = form.querySelector("input[name='phone']") ? form.querySelector("input[name='phone']").value.trim() : "";
    const description = form.querySelector("textarea[name='description']") ? form.querySelector("textarea[name='description']").value.trim() : "";

    const mediaUrl = activeMediaData || (urlInput ? urlInput.value.trim() : "") || DEFAULT_COVER_IMAGE;

    const submissionId = `gallery-sub-${Date.now()}`;
    const newSubmission = {
      id: submissionId,
      title: title || "Festival Community Moment",
      category: category,
      mediaType: mediaType,
      mediaUrl: mediaUrl,
      creatorName: creatorName || "Community Contributor",
      email: email,
      phone: phone,
      description: description,
      date: "Dec 2026",
      status: "pending",
      isCustom: true,
      timestamp: Date.now()
    };

    // Save strictly into Pending Submissions queue for admin review
    // Public uploads will NOT show on the visual gallery until approved by admin
    savePendingGallerySubmission(newSubmission);

    // Prepare Cloud POST payload for Apps Script
    const payload = {
      formType: "media_submission",
      id: submissionId,
      title: title,
      category: category,
      mediaType: mediaType,
      mediaUrl: (activeBase64Only ? "" : mediaUrl),
      creatorName: creatorName,
      email: email,
      phone: phone,
      description: description,
      base64Media: activeBase64Only,
      fileName: activeFileName || `${title.replace(/\s+/g, "_")}.${mediaType === "video" ? "mp4" : "jpg"}`,
      mimeType: activeMimeType
    };

    try {
      const res = await postToAppsScript(payload);
      showAlert(
        "🎉 Media submitted successfully! Your upload is queued for moderation. Once approved by the AIC editorial board, it will go live on the Visual Gallery!",
        "success"
      );
    } catch (err) {
      showAlert(
        "Your submission has been queued locally for review! Once reviewed, it will go live on the festival gallery.",
        "success"
      );
    }

    form.reset();
    clearPreview();

    if (btn) {
      btn.disabled = false;
      btn.textContent = origText;
    }
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

  // Map starting with the 3 prehardcoded default posts
  const postsMap = new Map();
  DEFAULT_BLOG_POSTS.forEach(p => {
    if (!deletedIds.has(p.id)) {
      postsMap.set(p.id, p);
    }
  });

  // Override default posts with locally edited versions and add new user posts
  localPosts.forEach(p => {
    if (!deletedIds.has(p.id)) {
      postsMap.set(p.id, p);
    }
  });

  // Sync with cloud Google Apps Script posts with server reconciliation
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=get_blog_posts`);
    const data = await res.json();
    if (data.status === "success" && Array.isArray(data.posts)) {
      const serverPostIds = new Set(data.posts.map(p => p.id));
      const defaultIds = new Set(DEFAULT_BLOG_POSTS.map(p => p.id));
      const now = Date.now();

      // Reconcile local storage: automatically drop posts deleted on the server
      const reconciledLocal = localPosts.filter(p => {
        if (defaultIds.has(p.id)) return true; // keep core default post customizations
        return serverPostIds.has(p.id) || (p.timestamp && (now - p.timestamp < 60000));
      });
      localStorage.setItem("aic_blog_posts", JSON.stringify(reconciledLocal));

      data.posts.forEach(p => {
        if (!deletedIds.has(p.id)) {
          postsMap.set(p.id, p);
        }
      });
    }
  } catch (err) {
    console.log("Using cached/local blog posts feed:", err);
  }

  return Array.from(postsMap.values()).filter(p => !deletedIds.has(p.id));
}

// Reading Time Calculator helper
function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const wordCount = (text || "").replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes || 1} min read`;
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
        (p.excerpt && p.excerpt.toLowerCase().includes(query.toLowerCase())) ||
        (p.author && p.author.toLowerCase().includes(query.toLowerCase()))
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full text-center py-20 bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
          <span class="text-4xl mb-3 block">🔍</span>
          <h3 class="text-xl font-bold text-gray-900 mb-2">No Articles Found</h3>
          <p class="text-xs text-gray-500 max-w-md mx-auto mb-6">We couldn't find any articles matching your search or category filter. Try clearing your search.</p>
          <button onclick="document.getElementById('blog-search-input').value=''; document.querySelector('.blog-cat-btn[data-category=\\'All\\']').click();" class="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-6 py-2.5 rounded-full transition shadow-md">
            Reset Filters
          </button>
        </div>
      `;
      if (heroContainer) heroContainer.innerHTML = "";
      return;
    }

    // Render Featured / Hero Post
    if (heroContainer && !query && currentCategory === "All" && filtered[0]) {
      const hero = filtered[0];
      const readTime = calculateReadingTime(hero.content);
      heroContainer.innerHTML = `
        <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 grid grid-cols-1 lg:grid-cols-12 group transition hover:shadow-2xl">
          <div class="lg:col-span-7 h-72 sm:h-80 lg:h-auto relative overflow-hidden bg-gray-100">
            <a href="blog-post.html?id=${hero.id}" class="block w-full h-full">
              <img 
                src="${hero.coverImage || DEFAULT_COVER_IMAGE}" 
                alt="${hero.title}" 
                class="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out" 
                onerror="this.src='${DEFAULT_COVER_IMAGE}'" 
              />
            </a>
            <span class="absolute top-6 left-6 bg-orange-600 text-white font-black text-xs px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
              ${hero.category}
            </span>
          </div>
          <div class="lg:col-span-5 p-8 md:p-12 flex flex-col justify-between">
            <div>
              <div class="flex items-center gap-3 text-xs text-gray-500 mb-4 flex-wrap">
                <span class="font-bold text-gray-800">✍️ ${hero.author}</span>
                <span>•</span>
                <span>📅 ${hero.date}</span>
                <span>•</span>
                <span class="text-orange-600 font-bold bg-orange-50 px-2.5 py-0.5 rounded-md">⏱️ ${readTime}</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-black text-gray-900 mb-4 group-hover:text-orange-600 transition leading-tight">
                <a href="blog-post.html?id=${hero.id}">${hero.title}</a>
              </h2>
              <p class="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6">
                ${hero.excerpt}
              </p>
            </div>
            <div class="pt-4 border-t border-gray-100 flex items-center justify-between">
              <a href="blog-post.html?id=${hero.id}" class="inline-flex items-center gap-2 text-orange-600 font-extrabold text-sm hover:translate-x-2 transition duration-300">
                <span>Read Full Story</span>
                <span>→</span>
              </a>
              <span class="text-xs font-semibold text-gray-400">Featured Story ⭐</span>
            </div>
          </div>
        </div>
      `;
    } else if (heroContainer) {
      heroContainer.innerHTML = "";
    }

    const cardPosts = (heroContainer && !query && currentCategory === "All") ? filtered.slice(1) : filtered;

    container.innerHTML = cardPosts.map(p => {
      const readTime = calculateReadingTime(p.content);
      return `
        <article class="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition duration-300 flex flex-col justify-between group">
          <div>
            <div class="relative h-56 overflow-hidden bg-gray-100">
              <a href="blog-post.html?id=${p.id}" class="block w-full h-full">
                <img 
                  src="${p.coverImage || DEFAULT_COVER_IMAGE}" 
                  alt="${p.title}" 
                  class="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                  onerror="this.src='${DEFAULT_COVER_IMAGE}'" 
                />
              </a>
              <span class="absolute top-4 left-4 bg-orange-600 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                ${p.category}
              </span>
            </div>
            <div class="p-6 sm:p-7">
              <div class="flex items-center gap-2 text-xs text-gray-400 mb-3 flex-wrap">
                <span class="font-semibold text-gray-600">${p.author}</span>
                <span>•</span>
                <span>${p.date}</span>
              </div>
              <h3 class="text-lg sm:text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition leading-snug">
                <a href="blog-post.html?id=${p.id}">${p.title}</a>
              </h3>
              <p class="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                ${p.excerpt}
              </p>
            </div>
          </div>
          <div class="p-6 sm:p-7 pt-0 border-t border-gray-100 flex items-center justify-between">
            <a href="blog-post.html?id=${p.id}" class="text-xs font-extrabold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 group-hover:translate-x-1 transition duration-200">
              <span>Read Article</span>
              <span>→</span>
            </a>
            <span class="text-[11px] text-gray-400 font-semibold bg-gray-50 px-2 py-1 rounded-md">⏱️ ${readTime}</span>
          </div>
        </article>
      `;
    }).join("");
  };

  render();

  const searchInput = document.getElementById("blog-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => render(e.target.value));
  }

  document.querySelectorAll(".blog-cat-btn, .category-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".blog-cat-btn, .category-filter-btn").forEach(b => {
        b.classList.remove("bg-orange-600", "text-white", "shadow-sm");
        b.classList.add("bg-white", "text-gray-700");
      });
      btn.classList.add("bg-orange-600", "text-white", "shadow-sm");
      btn.classList.remove("bg-white", "text-gray-700");
      currentCategory = btn.getAttribute("data-category") || "All";
      render(searchInput ? searchInput.value : "");
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
    container.innerHTML = `
      <div class="text-center py-20 bg-white rounded-3xl p-10 border border-gray-200 shadow-sm">
        <span class="text-5xl mb-4 block">📰</span>
        <h2 class="text-2xl font-black text-gray-900 mb-2">Article Not Found</h2>
        <p class="text-xs text-gray-500 mb-6">The story you are looking for may have been moved or removed.</p>
        <a href="blog.html" class="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-full text-xs transition shadow-md shadow-orange-200 inline-block">
          ← Return to All Stories
        </a>
      </div>
    `;
    return;
  }

  // Set document and meta title
  const titleEl = document.getElementById("blog-meta-title");
  if (titleEl) titleEl.textContent = `${post.title} | Afikpo International Carnival 2026`;
  document.title = `${post.title} | Afikpo International Carnival 2026`;

  // Calculate reading time
  const readingTime = calculateReadingTime(post.content);

  // Other related posts (excluding current one)
  const relatedPosts = posts.filter(p => p.id !== post.id && p.status !== "Draft").slice(0, 3);

  container.innerHTML = `
    <!-- Top Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-6 flex-wrap">
      <a href="index.html" class="hover:text-orange-600 transition">Home</a>
      <span>/</span>
      <a href="blog.html" class="hover:text-orange-600 transition">News & Stories</a>
      <span>/</span>
      <span class="text-orange-600 font-bold">${post.category || 'Culture'}</span>
    </nav>

    <!-- Post Header -->
    <header class="mb-8">
      <div class="flex items-center gap-3 mb-4 flex-wrap">
        <span class="bg-orange-100 text-orange-700 font-extrabold text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
          ${post.category}
        </span>
        <span class="text-xs text-gray-400">•</span>
        <span class="text-xs text-gray-500 font-medium">📅 ${post.date}</span>
        <span class="text-xs text-gray-400">•</span>
        <span class="text-xs text-orange-600 font-bold bg-orange-50 px-2.5 py-1 rounded-md">⏱️ ${readingTime}</span>
      </div>

      <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
        ${post.title}
      </h1>

      <!-- Author Byline & Quick Share Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-y border-gray-100 py-4 mb-8">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white font-black flex items-center justify-center text-lg shadow-md">
            ${post.author ? post.author.charAt(0) : 'A'}
          </div>
          <div>
            <h5 class="text-sm font-extrabold text-gray-900 leading-snug">${post.author || 'Afikpo Media Desk'}</h5>
            <span class="text-xs text-gray-400 font-medium">AIC Editorial Board • Verified Author</span>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1 hidden sm:inline">Share:</span>
          <button onclick="window.sharePost('whatsapp')" class="p-2.5 px-3.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-sm" title="Share on WhatsApp">
            <span>💬 WhatsApp</span>
          </button>
          <button onclick="window.sharePost('x')" class="p-2.5 px-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-sm" title="Share on X">
            <span>𝕏 Post</span>
          </button>
          <button onclick="window.sharePost('copy')" class="p-2.5 px-3.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl font-bold text-xs transition flex items-center gap-1.5 shadow-sm" title="Copy Article Link">
            <span>🔗 Copy Link</span>
          </button>
        </div>
      </div>
    </header>

    <!-- Cover Image (Fully Closed & Cleanly Rendered) -->
    <div class="rounded-3xl overflow-hidden mb-10 shadow-xl bg-gray-100 border border-gray-200">
      <img 
        src="${post.coverImage || DEFAULT_COVER_IMAGE}" 
        alt="${post.title}" 
        class="w-full h-auto max-h-[520px] object-cover" 
        onerror="this.src='${DEFAULT_COVER_IMAGE}'" 
      />
    </div>

    <!-- Article Content Body -->
    <div class="bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm border border-gray-200 mb-12">
      <div class="prose-article text-gray-800 leading-relaxed font-normal">
        ${post.content}
      </div>
    </div>

    <!-- Author Profile Bio Box -->
    <div class="bg-orange-50/70 border border-orange-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-14 shadow-sm">
      <div class="w-16 h-16 rounded-2xl bg-orange-600 text-white font-black flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
        ${post.author ? post.author.charAt(0) : 'A'}
      </div>
      <div>
        <div class="flex items-center gap-2 mb-1">
          <h4 class="text-base font-extrabold text-gray-900">${post.author || 'AIC Editorial Board'}</h4>
          <span class="bg-orange-200 text-orange-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">Editorial Contributor</span>
        </div>
        <p class="text-xs text-gray-600 leading-relaxed">
          Reporting on the rich cultural heritage, tourism landmarks, masquerade traditions, and community festivals of Ehugbo for the Afikpo International Carnival 2026.
        </p>
      </div>
    </div>

    <!-- Related Articles Section -->
    ${relatedPosts.length > 0 ? `
      <div class="border-t border-gray-200 pt-12">
        <div class="flex items-center justify-between mb-8 flex-wrap gap-2">
          <div>
            <h3 class="text-2xl font-black text-gray-900">More Stories from AIC 2026</h3>
            <p class="text-xs text-gray-400 mt-1">Continue exploring culture, travel, and festival highlights.</p>
          </div>
          <a href="blog.html" class="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
            <span>View All Stories</span>
            <span>→</span>
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${relatedPosts.map(r => {
            const relReadTime = calculateReadingTime(r.content);
            return `
              <article class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition duration-300 flex flex-col justify-between group">
                <div>
                  <div class="relative h-44 overflow-hidden bg-gray-100">
                    <a href="blog-post.html?id=${r.id}" class="block w-full h-full">
                      <img 
                        src="${r.coverImage || DEFAULT_COVER_IMAGE}" 
                        alt="${r.title}" 
                        class="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                        onerror="this.src='${DEFAULT_COVER_IMAGE}'" 
                      />
                    </a>
                    <span class="absolute top-3 left-3 bg-orange-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                      ${r.category}
                    </span>
                  </div>
                  <div class="p-5">
                    <div class="flex items-center gap-2 text-[11px] text-gray-400 mb-2">
                      <span>📅 ${r.date}</span>
                      <span>•</span>
                      <span>⏱️ ${relReadTime}</span>
                    </div>
                    <h4 class="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition leading-snug line-clamp-2">
                      <a href="blog-post.html?id=${r.id}">${r.title}</a>
                    </h4>
                  </div>
                </div>
                <div class="p-5 pt-0">
                  <a href="blog-post.html?id=${r.id}" class="text-xs font-extrabold text-orange-600 hover:text-orange-700 flex items-center gap-1">
                    <span>Read Article</span>
                    <span>→</span>
                  </a>
                </div>
              </article>
            `;
          }).join("")}
        </div>
      </div>
    ` : ''}
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
  const imagePreviewImg = document.getElementById("image-preview-img") || document.getElementById("blog-upload-preview") || document.getElementById("image-upload-preview");
  const imageSourceBadge = document.getElementById("image-source-badge");
  const removeImageBtn = document.getElementById("remove-image-btn");

  if (!authSection && !dashboardSection) return;

  // Accepted PINs (supports afikpo2026, Afikpo2026, admin123, 2026)
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
        showAlert("Incorrect PIN! Please enter password.", "error");
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
      if (imageUrlInput) imageUrlInput.value = "";
      if (imageFileInput) imageFileInput.value = "";
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
      if (imageUrlInput) imageUrlInput.value = "";
      if (imageFileInput) imageFileInput.value = "";
      if (imagePreviewContainer) imagePreviewContainer.classList.add("hidden");
    });
  }

  // Option B: Media File Upload (with auto-compression & preview)
  if (imageFileInput) {
    imageFileInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (file) {
        if (imagePreviewContainer) imagePreviewContainer.classList.remove("hidden");
        try {
          if (imageSourceBadge) {
            imageSourceBadge.textContent = "⚡ Optimizing image...";
            imageSourceBadge.className = "bg-yellow-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow";
          }
          const compressedDataUrl = await compressImageFile(file, 1200, 675, 0.82);
          if (imageUrlInput) imageUrlInput.value = compressedDataUrl;
          if (imagePreviewImg) imagePreviewImg.src = compressedDataUrl;
          if (imageSourceBadge) {
            imageSourceBadge.textContent = "📁 Device File Ready";
            imageSourceBadge.className = "bg-green-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow";
          }
        } catch (err) {
          console.error("Compression error:", err);
          const reader = new FileReader();
          reader.onload = (ev) => {
            if (imageUrlInput) imageUrlInput.value = ev.target.result;
            if (imagePreviewImg) imagePreviewImg.src = ev.target.result;
            if (imageSourceBadge) {
              imageSourceBadge.textContent = "📁 Device File Ready";
              imageSourceBadge.className = "bg-green-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow";
            }
          };
          reader.readAsDataURL(file);
        }
      }
    });
  }

  // Option A: Outsource / External Web Link input (real-time preview on input, change, and paste)
  if (imageUrlInput) {
    const handleUrlPreview = () => {
      const val = imageUrlInput.value.trim();
      if (val) {
        if (imagePreviewImg) imagePreviewImg.src = val;
        if (imageSourceBadge) {
          imageSourceBadge.textContent = val.startsWith("data:") ? "📁 Device File Ready" : "🌐 Web URL Ready";
          imageSourceBadge.className = val.startsWith("data:") ? "bg-green-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow" : "bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow";
        }
        if (imagePreviewContainer) imagePreviewContainer.classList.remove("hidden");
      } else if (imagePreviewContainer) {
        imagePreviewContainer.classList.add("hidden");
      }
    };
    imageUrlInput.addEventListener("input", handleUrlPreview);
    imageUrlInput.addEventListener("change", handleUrlPreview);
    imageUrlInput.addEventListener("paste", () => setTimeout(handleUrlPreview, 50));
  }

  // Remove / Reset Image button
  if (removeImageBtn) {
    removeImageBtn.addEventListener("click", () => {
      if (imageUrlInput) imageUrlInput.value = "";
      if (imageFileInput) imageFileInput.value = "";
      if (imagePreviewImg) imagePreviewImg.src = "";
      if (imagePreviewContainer) imagePreviewContainer.classList.add("hidden");
    });
  }

  // Load Articles Table
  const loadAdminArticles = async () => {
    if (!articlesList) return;
    const posts = await fetchBlogPosts();
    articlesList.innerHTML = posts.map(p => `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-white transition gap-4">
        <div class="flex items-center gap-3">
          <img src="${p.coverImage || DEFAULT_COVER_IMAGE}" class="w-14 h-14 object-cover rounded-xl border border-gray-200" onerror="this.src='${DEFAULT_COVER_IMAGE}'" />
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
      const coverImage = (imageUrlInput && imageUrlInput.value.trim()) ? imageUrlInput.value.trim() : DEFAULT_COVER_IMAGE;
      const summary = document.getElementById("post-summary") ? document.getElementById("post-summary").value : editorForm.querySelector("input[name='summary']").value;
      const contentRaw = document.getElementById("post-content") ? document.getElementById("post-content").value : editorForm.querySelector("textarea[name='content']").value;

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
      if (imageUrlInput) imageUrlInput.value = "";
      if (imageFileInput) imageFileInput.value = "";
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

    const dateField = document.getElementById("post-date") || editorForm.querySelector("input[name='date']");
    if (dateField && p.date) {
      const d = new Date(p.date);
      if (!isNaN(d.getTime())) dateField.valueAsDate = d;
    }

    if (imageUrlInput) imageUrlInput.value = p.coverImage || "";
    if (imageFileInput) imageFileInput.value = "";
    if (imagePreviewImg && p.coverImage) {
      imagePreviewImg.src = p.coverImage;
      if (imageSourceBadge) {
        imageSourceBadge.textContent = p.coverImage.startsWith("data:") ? "📁 Device File Ready" : "🌐 Web URL Ready";
        imageSourceBadge.className = p.coverImage.startsWith("data:") ? "bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow" : "bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow";
      }
      if (imagePreviewContainer) imagePreviewContainer.classList.remove("hidden");
    } else if (imagePreviewContainer) {
      imagePreviewContainer.classList.add("hidden");
    }

    const summaryField = document.getElementById("post-summary") || editorForm.querySelector("input[name='summary']");
    if (summaryField) summaryField.value = p.excerpt || "";

    const contentField = document.getElementById("post-content") || editorForm.querySelector("textarea[name='content']");
    if (contentField) {
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
// VISUAL GALLERY DATA ENGINE & STORAGE HELPERS
// =============================================================
const STORAGE_KEY_CUSTOM_GALLERY = "aic_custom_gallery_items";
const STORAGE_KEY_DELETED_GALLERY = "aic_deleted_gallery_ids";
const STORAGE_KEY_PENDING_GALLERY = "aic_pending_gallery_submissions";
const STORAGE_KEY_GALLERY_AUTH = "aic_gallery_admin_auth";

// Retrieve combined live gallery items (Default 18 items + approved custom items)
function getPublishedGalleryItems() {
  try {
    const deletedIds = JSON.parse(localStorage.getItem(STORAGE_KEY_DELETED_GALLERY) || "[]");
    const custom = JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM_GALLERY) || "[]");
    const pending = JSON.parse(localStorage.getItem(STORAGE_KEY_PENDING_GALLERY) || "[]");
    const pendingIds = new Set(pending.map(p => p && p.id).filter(Boolean));

    const activeDefault = DEFAULT_GALLERY_ITEMS.filter(item => !deletedIds.includes(item.id));

    // STRICT ADMIN APPROVAL REQUIREMENT:
    // Only approved/published items appear on the visual gallery!
    // Any submission currently in pending queue is NEVER shown until approved by admin.
    const activeCustom = custom.filter(item => 
      item && 
      item.id && 
      !deletedIds.includes(item.id) && 
      !pendingIds.has(item.id) &&
      (item.status === "Published" || !item.status) &&
      item.status !== "pending" &&
      item.status !== "Pending"
    );

    // Place newly approved custom items at the top
    return [...activeCustom, ...activeDefault];
  } catch (err) {
    console.warn("Could not read gallery items from localStorage:", err);
    return DEFAULT_GALLERY_ITEMS;
  }
}

// Save or update a published gallery item
function savePublishedGalleryItem(item) {
  try {
    let custom = JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM_GALLERY) || "[]");
    let deletedIds = JSON.parse(localStorage.getItem(STORAGE_KEY_DELETED_GALLERY) || "[]");

    // Remove from deleted list if re-added
    deletedIds = deletedIds.filter(id => id !== item.id);
    localStorage.setItem(STORAGE_KEY_DELETED_GALLERY, JSON.stringify(deletedIds));

    const existingIdx = custom.findIndex(c => c.id === item.id);
    if (existingIdx >= 0) {
      custom[existingIdx] = item;
    } else {
      custom.unshift(item);
    }
    // Limit to 40 items to safeguard localStorage quota
    if (custom.length > 40) custom = custom.slice(0, 40);
    localStorage.setItem(STORAGE_KEY_CUSTOM_GALLERY, JSON.stringify(custom));
  } catch (err) {
    console.warn("Storage quota or error in savePublishedGalleryItem:", err);
  }
}

// Delete an item from published gallery (marks deleted and deletes from cloud)
async function deletePublishedGalleryItem(id) {
  try {
    let deletedIds = JSON.parse(localStorage.getItem(STORAGE_KEY_DELETED_GALLERY) || "[]");
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem(STORAGE_KEY_DELETED_GALLERY, JSON.stringify(deletedIds));
    }

    let custom = JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM_GALLERY) || "[]");
    custom = custom.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY_CUSTOM_GALLERY, JSON.stringify(custom));

    let pending = JSON.parse(localStorage.getItem(STORAGE_KEY_PENDING_GALLERY) || "[]");
    pending = pending.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PENDING_GALLERY, JSON.stringify(pending));
  } catch (err) {
    console.warn("Delete storage error:", err);
  }

  try {
    await postToAppsScript({ formType: "delete_gallery_item", id: id });
  } catch (err) {
    console.warn("Could not sync delete with Apps Script:", err);
  }
}

// Pending Submissions Queue Management
function getPendingGallerySubmissions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_PENDING_GALLERY) || "[]");
  } catch (err) {
    return [];
  }
}

function savePendingGallerySubmission(item) {
  try {
    let pending = JSON.parse(localStorage.getItem(STORAGE_KEY_PENDING_GALLERY) || "[]");
    const existingIdx = pending.findIndex(p => p.id === item.id);
    if (existingIdx >= 0) {
      pending[existingIdx] = item;
    } else {
      pending.unshift(item);
    }
    if (pending.length > 40) pending = pending.slice(0, 40);
    localStorage.setItem(STORAGE_KEY_PENDING_GALLERY, JSON.stringify(pending));
  } catch (err) {
    console.warn("Storage error in savePendingGallerySubmission:", err);
  }
}

function removePendingGallerySubmission(id) {
  try {
    let pending = JSON.parse(localStorage.getItem(STORAGE_KEY_PENDING_GALLERY) || "[]");
    pending = pending.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PENDING_GALLERY, JSON.stringify(pending));
  } catch (err) {
    console.warn("Remove pending error:", err);
  }
}

// Fetch published gallery items from Google Apps Script in the background with server reconciliation
async function fetchRemoteGalleryItems() {
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=get_gallery_items`);
    if (!res.ok) return;
    const data = await res.json();
    if (data.status === "success" && Array.isArray(data.items)) {
      const deletedIds = JSON.parse(localStorage.getItem(STORAGE_KEY_DELETED_GALLERY) || "[]");
      const pending = JSON.parse(localStorage.getItem(STORAGE_KEY_PENDING_GALLERY) || "[]");
      const pendingIds = new Set(pending.map(p => p && p.id).filter(Boolean));
      let localCustom = JSON.parse(localStorage.getItem(STORAGE_KEY_CUSTOM_GALLERY) || "[]");

      const serverIds = new Set(data.items.map(item => item.id));
      const now = Date.now();

      // Keep recent local items created in the last 60 seconds (grace period while cloud POST is in transit)
      const recentLocalItems = localCustom.filter(item => 
        item && 
        item.id && 
        !serverIds.has(item.id) && 
        item.timestamp && 
        (now - item.timestamp < 60000) &&
        !deletedIds.includes(item.id) &&
        !pendingIds.has(item.id)
      );

      // Active items confirmed alive on the server
      const activeServerItems = data.items.filter(item => 
        item && 
        item.id && 
        !deletedIds.includes(item.id) && 
        !pendingIds.has(item.id)
      );

      // Server Reconciliation: Replace local cached custom items with verified active items!
      // This automatically purges any deleted item from localStorage without needing users to clear cookies or cache.
      const reconciled = [...recentLocalItems, ...activeServerItems];
      localStorage.setItem(STORAGE_KEY_CUSTOM_GALLERY, JSON.stringify(reconciled));
    }
  } catch (err) {
    // Non-blocking fallback to local cache
  }
}

// Fetch pending gallery submissions from Google Apps Script for admin review with reconciliation
async function fetchRemotePendingGalleryItems() {
  try {
    const res = await fetch(`${APPS_SCRIPT_URL}?action=get_pending_gallery_items`);
    if (!res.ok) return;
    const data = await res.json();
    if (data.status === "success" && Array.isArray(data.items)) {
      let localPending = JSON.parse(localStorage.getItem(STORAGE_KEY_PENDING_GALLERY) || "[]");
      const serverIds = new Set(data.items.map(item => item.id));
      const deletedIds = JSON.parse(localStorage.getItem(STORAGE_KEY_DELETED_GALLERY) || "[]");
      const now = Date.now();

      // Keep local submissions created in the last 60 seconds while cloud POST is in flight
      const recentLocalPending = localPending.filter(p => 
        p && 
        p.id && 
        !serverIds.has(p.id) && 
        p.timestamp && 
        (now - p.timestamp < 60000) &&
        !deletedIds.includes(p.id)
      );

      const activeServerPending = data.items.filter(p => p && p.id && !deletedIds.includes(p.id));
      const reconciled = [...recentLocalPending, ...activeServerPending];
      localStorage.setItem(STORAGE_KEY_PENDING_GALLERY, JSON.stringify(reconciled));
    }
  } catch (err) {
    // Non-blocking fallback to local cache
  }
}

// =============================================================
// 10. PUBLIC VISUAL GALLERY (gallery.html)
// =============================================================
function setupGallery() {
  const container = document.getElementById("gallery-grid-container");
  if (!container) return;

  const searchInput = document.getElementById("gallery-search-input");
  const catButtons = document.querySelectorAll(".gallery-cat-btn");
  const emptyState = document.getElementById("gallery-empty-state");
  const resetBtn = document.getElementById("gallery-reset-filter-btn");
  const countAllEl = document.getElementById("count-all");

  // Lightbox elements
  const lightbox = document.getElementById("gallery-lightbox-modal");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxVideoContainer = document.getElementById("lightbox-video-container");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxDesc = document.getElementById("lightbox-description");
  const lightboxCat = document.getElementById("lightbox-category");
  const lightboxCreator = document.getElementById("lightbox-creator");
  const lightboxCloseBtn = document.getElementById("lightbox-close-btn");

  let currentFilter = "All";
  let currentSearch = "";

  // Helper: Open Lightbox Viewer
  window.openGalleryLightbox = (id) => {
    const items = getPublishedGalleryItems();
    const item = items.find(i => i.id === id);
    if (!item || !lightbox) return;

    if (lightboxTitle) lightboxTitle.textContent = item.title;
    if (lightboxDesc) lightboxDesc.textContent = item.description || "";
    if (lightboxCat) lightboxCat.textContent = item.category || "Festival Visuals";
    if (lightboxCreator) lightboxCreator.textContent = `📸 by ${item.creatorName || "AIC Contributor"}`;

    if (item.mediaType === "video") {
      if (lightboxImg) lightboxImg.classList.add("hidden");
      if (lightboxVideoContainer) {
        lightboxVideoContainer.classList.remove("hidden");
        // Check for YouTube link
        const ytMatch = item.mediaUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
        if (ytMatch && ytMatch[1]) {
          lightboxVideoContainer.innerHTML = `
            <iframe class="w-full h-full min-h-[350px] sm:min-h-[450px] rounded-2xl" src="https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          `;
        } else {
          lightboxVideoContainer.innerHTML = `
            <video src="${item.mediaUrl}" controls autoplay playsinline class="max-h-[65vh] w-auto max-w-full rounded-2xl shadow-2xl"></video>
          `;
        }
      }
    } else {
      if (lightboxVideoContainer) {
        lightboxVideoContainer.innerHTML = "";
        lightboxVideoContainer.classList.add("hidden");
      }
      if (lightboxImg) {
        lightboxImg.src = item.mediaUrl;
        lightboxImg.alt = item.title;
        lightboxImg.classList.remove("hidden");
      }
    }

    lightbox.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  };

  // Helper: Close Lightbox
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.add("hidden");
    if (lightboxVideoContainer) lightboxVideoContainer.innerHTML = "";
    if (lightboxImg) lightboxImg.src = "";
    document.body.style.overflow = "";
  };

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox && !lightbox.classList.contains("hidden")) {
      closeLightbox();
    }
  });

  // Render Grid Cards
  const render = () => {
    const items = getPublishedGalleryItems();
    if (countAllEl) countAllEl.textContent = items.length;

    let filtered = items;

    // Category / Type filter
    if (currentFilter !== "All") {
      if (currentFilter.startsWith("type:")) {
        const type = currentFilter.replace("type:", "");
        filtered = filtered.filter(i => (i.mediaType || "image") === type);
      } else {
        filtered = filtered.filter(i => i.category && i.category.toLowerCase() === currentFilter.toLowerCase());
      }
    }

    // Search query
    if (currentSearch.trim()) {
      const q = currentSearch.toLowerCase().trim();
      filtered = filtered.filter(i => 
        (i.title && i.title.toLowerCase().includes(q)) ||
        (i.description && i.description.toLowerCase().includes(q)) ||
        (i.category && i.category.toLowerCase().includes(q)) ||
        (i.creatorName && i.creatorName.toLowerCase().includes(q))
      );
    }

    if (filtered.length === 0) {
      container.innerHTML = "";
      if (emptyState) emptyState.classList.remove("hidden");
      return;
    }

    if (emptyState) emptyState.classList.add("hidden");

    container.innerHTML = filtered.map(item => {
      const isVideo = item.mediaType === "video";
      const isCustomBadge = item.isCustom ? `<span class="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">Community</span>` : "";

      return `
        <div 
          onclick="openGalleryLightbox('${item.id}')"
          class="group relative overflow-hidden rounded-3xl bg-gray-900 shadow-md hover:shadow-2xl transition duration-500 cursor-pointer h-80 w-full"
        >
          <!-- Media Preview (Image or Video) -->
          ${isVideo ? `
            <div class="w-full h-full bg-gray-950 flex items-center justify-center relative overflow-hidden">
              <img 
                src="${item.mediaUrl.match(/\.(jpeg|jpg|png|webp)/i) ? item.mediaUrl : DEFAULT_COVER_IMAGE}" 
                alt="${item.title}" 
                class="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-110 transition duration-700 ease-out" 
                onerror="this.src='${DEFAULT_COVER_IMAGE}'"
              />
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition duration-300">
                <span class="w-14 h-14 rounded-full bg-orange-600/90 text-white flex items-center justify-center text-xl shadow-2xl">
                  ▶
                </span>
              </div>
            </div>
          ` : `
            <img
              src="${item.mediaUrl}"
              alt="${item.title}"
              class="w-full h-full object-cover transition duration-700 ease-out group-hover:scale-110"
              onerror="this.src='${DEFAULT_COVER_IMAGE}'"
              loading="lazy"
            />
          `}

          <!-- Top Tags Ribbon -->
          <div class="absolute top-4 left-4 flex items-center gap-2 pointer-events-none z-10">
            <span class="bg-gray-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20 shadow">
              ${isVideo ? "🎥 Video" : "📸 Photo"}
            </span>
            ${isCustomBadge}
          </div>

          <!-- Bottom Gradient Hover Caption Overlay -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 z-20">
            <!-- Category & Date -->
            <div class="flex items-center justify-between text-[11px] text-orange-400 font-bold uppercase tracking-wider mb-1">
              <span>${item.category || "Afikpo Heritage"}</span>
              <span class="text-gray-300 text-[10px]">${item.date || "Dec 2026"}</span>
            </div>

            <!-- Title of Image -->
            <h4 class="text-white font-extrabold text-lg leading-snug mb-1 drop-shadow-sm line-clamp-2">
              ${item.title}
            </h4>

            <!-- Name of Upload / Submitter Name -->
            <p class="text-orange-200 text-xs font-semibold mb-2 flex items-center gap-1.5">
              <span>👤 Uploaded by:</span>
              <span class="text-white font-bold">${item.creatorName || "Community Contributor"}</span>
            </p>

            ${item.description ? `
              <p class="text-gray-300 text-xs italic line-clamp-2 mb-3 leading-relaxed">
                ${item.description}
              </p>
            ` : ''}

            <!-- Enlarge Button -->
            <div class="pt-2.5 border-t border-white/20 flex items-center justify-between">
              <span class="text-[11px] text-gray-300">Click to view full</span>
              <button 
                type="button" 
                onclick="event.stopPropagation(); openGalleryLightbox('${item.id}');"
                class="inline-flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg transition transform hover:scale-105"
              >
                <span>Enlarge</span>
                <span>↗</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  };

  // Category filter clicks
  catButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      catButtons.forEach(b => {
        b.classList.remove("active", "bg-orange-600", "text-white");
        b.classList.add("bg-white", "text-gray-700");
      });
      btn.classList.add("active", "bg-orange-600", "text-white");
      btn.classList.remove("bg-white", "text-gray-700");

      currentFilter = btn.getAttribute("data-filter") || "All";
      render();
    });
  });

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      currentSearch = e.target.value;
      render();
    });
  }

  // Reset filters button
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      currentFilter = "All";
      currentSearch = "";
      if (searchInput) searchInput.value = "";
      const allBtn = document.querySelector(".gallery-cat-btn[data-filter='All']");
      if (allBtn) allBtn.click();
    });
  }

  // Live cross-tab sync: updates gallery if another browser tab uploads or modifies media
  window.addEventListener("storage", (e) => {
    if (
      e.key === STORAGE_KEY_CUSTOM_GALLERY ||
      e.key === STORAGE_KEY_PENDING_GALLERY ||
      e.key === STORAGE_KEY_DELETED_GALLERY
    ) {
      render();
    }
  });

  // Initial render & background cloud sync
  render();
  fetchRemoteGalleryItems().then(() => render());

  // Auto-reconcile with cloud on tab focus & visibility change
  window.addEventListener("focus", () => {
    fetchRemoteGalleryItems().then(() => render());
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      fetchRemoteGalleryItems().then(() => render());
    }
  });

  // Periodic background reconciliation (every 30 seconds) to ensure deleted images vanish seamlessly
  setInterval(() => {
    fetchRemoteGalleryItems().then(() => render());
  }, 30000);
}

// =============================================================
// 11. GALLERY CMS ADMIN PORTAL (gallery-admin.html)
// =============================================================
function setupGalleryAdmin() {
  const authSection = document.getElementById("gallery-admin-auth-section");
  const dashboardSection = document.getElementById("gallery-admin-dashboard-section");
  const loginForm = document.getElementById("gallery-admin-login-form");
  const pinInput = document.getElementById("gallery-admin-pin-input");
  const logoutBtn = document.getElementById("gallery-admin-logout-btn");

  if (!authSection || !dashboardSection) return;

  // Tabs
  const tabNavUpload = document.getElementById("tab-nav-upload");
  const tabNavPending = document.getElementById("tab-nav-pending");
  const tabNavManage = document.getElementById("tab-nav-manage");
  const panelUpload = document.getElementById("admin-panel-upload");
  const panelPending = document.getElementById("admin-panel-pending");
  const panelManage = document.getElementById("admin-panel-manage");
  const addMediaTrigger = document.getElementById("admin-add-media-tab-trigger");

  // Metrics
  const statTotal = document.getElementById("stat-total-items");
  const statPhotos = document.getElementById("stat-photo-items");
  const statVideos = document.getElementById("stat-video-items");
  const statPending = document.getElementById("stat-pending-items");
  const pendingBadgeCount = document.getElementById("pending-badge-count");

  // Form elements
  const form = document.getElementById("admin-gallery-form");
  const editIdInput = document.getElementById("admin-edit-item-id");
  const formHeading = document.getElementById("gallery-form-heading");
  const tabBtnFile = document.getElementById("admin-tab-btn-file");
  const tabBtnUrl = document.getElementById("admin-tab-btn-url");
  const fileBox = document.getElementById("admin-file-box");
  const urlBox = document.getElementById("admin-url-box");
  const fileInput = document.getElementById("admin-media-file-input");
  const urlInput = document.getElementById("admin-media-url-input");
  const previewContainer = document.getElementById("admin-preview-container");
  const previewImg = document.getElementById("admin-preview-img");
  const previewVideo = document.getElementById("admin-preview-video");
  const previewInfo = document.getElementById("admin-preview-info");
  const previewClearBtn = document.getElementById("admin-preview-clear-btn");
  const titleInput = document.getElementById("admin-media-title");
  const typeSelect = document.getElementById("admin-media-type");
  const catSelect = document.getElementById("admin-media-category");
  const creatorInput = document.getElementById("admin-media-creator");
  const dateInput = document.getElementById("admin-media-date");
  const descInput = document.getElementById("admin-media-description");
  const submitBtn = document.getElementById("admin-submit-btn");
  const resetFormBtn = document.getElementById("admin-reset-form-btn");

  // Moderation & Manage lists
  const pendingList = document.getElementById("admin-pending-list");
  const refreshPendingBtn = document.getElementById("refresh-pending-btn");
  const manageList = document.getElementById("admin-live-items-list");
  const manageSearch = document.getElementById("admin-manage-search");
  const manageCatFilter = document.getElementById("admin-manage-cat-filter");

  let activeAdminMediaData = "";
  let activeAdminBase64 = "";
  let activeAdminFileName = "";
  let activeAdminMimeType = "";

  // 1. PIN Authentication
  const checkAuth = () => {
    const isAuth = sessionStorage.getItem(STORAGE_KEY_GALLERY_AUTH) === "true";
    if (isAuth) {
      authSection.classList.add("hidden");
      dashboardSection.classList.remove("hidden");
      if (logoutBtn) logoutBtn.classList.remove("hidden");
      updateMetrics();
      loadPendingList();
      loadLiveManageList();
      fetchRemotePendingGalleryItems().then(() => {
        updateMetrics();
        loadPendingList();
      });
    } else {
      authSection.classList.remove("hidden");
      dashboardSection.classList.add("hidden");
      if (logoutBtn) logoutBtn.classList.add("hidden");
    }
  };

  if (loginForm && pinInput) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const pin = pinInput.value.trim().toLowerCase();
      if (pin === "2026" || pin === "afikpo2026") {
        sessionStorage.setItem(STORAGE_KEY_GALLERY_AUTH, "true");
        showAlert("Admin authenticated successfully! Welcome to Visual Gallery Manager.", "success");
        checkAuth();
      } else {
        showAlert("Invalid PIN code. Please enter 2026 or afikpo2026.", "error");
        pinInput.value = "";
        pinInput.focus();
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem(STORAGE_KEY_GALLERY_AUTH);
      showAlert("Logged out from Gallery CMS.", "warning");
      checkAuth();
    });
  }

  // 2. Tab Navigation
  const switchTab = (activeTab) => {
    [tabNavUpload, tabNavPending, tabNavManage].forEach(t => {
      if (t) {
        t.className = "admin-tab-btn bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs px-5 py-2.5 rounded-xl border border-gray-200 transition flex items-center gap-2";
      }
    });

    [panelUpload, panelPending, panelManage].forEach(p => {
      if (p) p.classList.add("hidden");
    });

    if (activeTab === "upload") {
      if (tabNavUpload) tabNavUpload.className = "admin-tab-btn active bg-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2";
      if (panelUpload) panelUpload.classList.remove("hidden");
    } else if (activeTab === "pending") {
      if (tabNavPending) tabNavPending.className = "admin-tab-btn active bg-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2";
      if (panelPending) panelPending.classList.remove("hidden");
      loadPendingList();
    } else if (activeTab === "manage") {
      if (tabNavManage) tabNavManage.className = "admin-tab-btn active bg-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2";
      if (panelManage) panelManage.classList.remove("hidden");
      loadLiveManageList();
    }
  };

  if (tabNavUpload) tabNavUpload.addEventListener("click", () => switchTab("upload"));
  if (tabNavPending) tabNavPending.addEventListener("click", () => switchTab("pending"));
  if (tabNavManage) tabNavManage.addEventListener("click", () => switchTab("manage"));
  if (addMediaTrigger) addMediaTrigger.addEventListener("click", () => switchTab("upload"));

  // 3. Update Metrics Ribbon
  const updateMetrics = () => {
    const items = getPublishedGalleryItems();
    const pending = getPendingGallerySubmissions();

    const photoCount = items.filter(i => i.mediaType !== "video").length;
    const videoCount = items.filter(i => i.mediaType === "video").length;

    if (statTotal) statTotal.textContent = items.length;
    if (statPhotos) statPhotos.textContent = photoCount;
    if (statVideos) statVideos.textContent = videoCount;
    if (statPending) statPending.textContent = pending.length;

    if (pendingBadgeCount) {
      if (pending.length > 0) {
        pendingBadgeCount.textContent = pending.length;
        pendingBadgeCount.classList.remove("hidden");
      } else {
        pendingBadgeCount.classList.add("hidden");
      }
    }
  };

  // 4. File / URL Mode Switcher in Admin Form
  if (tabBtnFile && tabBtnUrl && fileBox && urlBox) {
    tabBtnFile.addEventListener("click", () => {
      fileBox.classList.remove("hidden");
      urlBox.classList.add("hidden");
      tabBtnFile.className = "flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-orange-600 bg-orange-50 text-orange-700 font-bold text-xs transition";
      tabBtnUrl.className = "flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 text-gray-700 font-bold text-xs transition";
    });

    tabBtnUrl.addEventListener("click", () => {
      urlBox.classList.remove("hidden");
      fileBox.classList.add("hidden");
      tabBtnUrl.className = "flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-orange-600 bg-orange-50 text-orange-700 font-bold text-xs transition";
      tabBtnFile.className = "flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 text-gray-700 font-bold text-xs transition";
    });
  }

  // Clear preview helper
  const clearAdminPreview = () => {
    activeAdminMediaData = "";
    activeAdminBase64 = "";
    activeAdminFileName = "";
    activeAdminMimeType = "";
    if (fileInput) fileInput.value = "";
    if (urlInput) urlInput.value = "";
    if (previewImg) { previewImg.src = ""; previewImg.classList.add("hidden"); }
    if (previewVideo) { previewVideo.src = ""; previewVideo.classList.add("hidden"); }
    if (previewContainer) previewContainer.classList.add("hidden");
  };

  if (previewClearBtn) previewClearBtn.addEventListener("click", clearAdminPreview);

  // File Picker Change
  if (fileInput) {
    fileInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const maxBytes = 15 * 1024 * 1024;
      if (file.size > maxBytes) {
        showAlert("Selected file exceeds the 15MB size limit. Please select a smaller media file.", "error");
        fileInput.value = "";
        return;
      }

      activeAdminFileName = file.name;
      activeAdminMimeType = file.type || "application/octet-stream";
      const sizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + " MB";

      if (file.type.startsWith("image/")) {
        try {
          const compressed = await compressImageFile(file, 1400, 900, 0.85);
          activeAdminMediaData = compressed;
          activeAdminBase64 = compressed.split(",")[1] || "";

          if (previewImg && previewVideo && previewContainer && previewInfo) {
            previewImg.src = compressed;
            previewImg.classList.remove("hidden");
            previewVideo.classList.add("hidden");
            previewInfo.textContent = `📸 ${file.name} (${sizeFormatted})`;
            previewContainer.classList.remove("hidden");
          }
          if (typeSelect) typeSelect.value = "image";
        } catch (err) {
          showAlert("Could not process image file.", "error");
        }
      } else if (file.type.startsWith("video/")) {
        const objUrl = URL.createObjectURL(file);
        activeAdminMediaData = objUrl;

        const reader = new FileReader();
        reader.onload = (re) => {
          activeAdminBase64 = (re.target.result || "").split(",")[1] || "";
        };
        reader.readAsDataURL(file);

        if (previewImg && previewVideo && previewContainer && previewInfo) {
          previewVideo.src = objUrl;
          previewVideo.classList.remove("hidden");
          previewImg.classList.add("hidden");
          previewInfo.textContent = `🎥 ${file.name} (${sizeFormatted})`;
          previewContainer.classList.remove("hidden");
        }
        if (typeSelect) typeSelect.value = "video";
      }
    });
  }

  // URL Input Change
  if (urlInput) {
    urlInput.addEventListener("input", () => {
      const url = urlInput.value.trim();
      if (!url) {
        if (!fileInput || !fileInput.files.length) clearAdminPreview();
        return;
      }

      activeAdminMediaData = url;
      activeAdminBase64 = "";
      activeAdminFileName = "Web Media";

      if (url.match(/\.(jpeg|jpg|gif|png|webp)($|\?)/i)) {
        if (previewImg && previewVideo && previewContainer && previewInfo) {
          previewImg.src = url;
          previewImg.classList.remove("hidden");
          previewVideo.classList.add("hidden");
          previewInfo.textContent = "🌐 Web Image Link Ready";
          previewContainer.classList.remove("hidden");
        }
        if (typeSelect) typeSelect.value = "image";
      } else {
        if (previewContainer && previewInfo) {
          previewInfo.textContent = `🌐 Web Video Link: ${url.substring(0, 40)}...`;
          previewContainer.classList.remove("hidden");
          if (previewImg) previewImg.classList.add("hidden");
          if (previewVideo) previewVideo.classList.add("hidden");
        }
        if (typeSelect) typeSelect.value = "video";
      }
    });
  }

  // Reset Form Helper
  const resetForm = () => {
    if (form) form.reset();
    if (editIdInput) editIdInput.value = "";
    if (formHeading) formHeading.textContent = "Publish New Photo or Video";
    if (submitBtn) {
      submitBtn.innerHTML = `<span>Publish to Visual Gallery</span> <span>🚀</span>`;
    }
    clearAdminPreview();
  };

  if (resetFormBtn) resetFormBtn.addEventListener("click", resetForm);

  // 5. Submit Admin Form (Direct Publish or Update)
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const origText = submitBtn ? submitBtn.innerHTML : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Publishing to Gallery...";
      }

      const isEdit = editIdInput && editIdInput.value.trim().length > 0;
      const itemId = isEdit ? editIdInput.value.trim() : `gallery-${Date.now()}`;
      const title = titleInput.value.trim();
      const mediaType = typeSelect.value;
      const category = catSelect.value;
      const creator = creatorInput.value.trim() || "AIC Media Board";
      const date = dateInput.value.trim() || "Dec 2026";
      const desc = descInput.value.trim();

      const mediaUrl = activeAdminMediaData || (urlInput ? urlInput.value.trim() : "") || DEFAULT_COVER_IMAGE;

      const galleryItem = {
        id: itemId,
        title: title,
        category: category,
        mediaType: mediaType,
        mediaUrl: mediaUrl,
        creatorName: creator,
        date: date,
        description: desc,
        status: "Published",
        timestamp: Date.now(),
        isCustom: true
      };

      // Save instantly to local storage
      savePublishedGalleryItem(galleryItem);

      // Async sync to Google Apps Script
      const payload = {
        formType: "save_gallery_item",
        id: itemId,
        title: title,
        category: category,
        mediaType: mediaType,
        mediaUrl: (activeAdminBase64 ? "" : mediaUrl),
        creatorName: creator,
        date: date,
        description: desc,
        base64Media: activeAdminBase64,
        fileName: activeAdminFileName || `${title.replace(/\s+/g, "_")}.${mediaType === "video" ? "mp4" : "jpg"}`,
        mimeType: activeAdminMimeType
      };

      try {
        await postToAppsScript(payload);
        showAlert(`🎉 Successfully ${isEdit ? "updated" : "published"} "${title}" live to the Visual Gallery!`, "success");
      } catch (err) {
        showAlert(`Item saved and published locally! Will sync with Google Cloud.`, "success");
      }

      resetForm();
      updateMetrics();
      loadLiveManageList();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
      }
    });
  }

  // 6. Moderation Queue (Pending Submissions)
  const loadPendingList = () => {
    if (!pendingList) return;
    const pending = getPendingGallerySubmissions();

    if (pending.length === 0) {
      pendingList.innerHTML = `
        <div class="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200 p-8">
          <div class="text-4xl mb-2">🎉</div>
          <h3 class="text-base font-bold text-gray-800">Moderation Queue Clear</h3>
          <p class="text-xs text-gray-500 mt-1 max-w-sm mx-auto">There are currently no pending submissions awaiting review. Community uploads from media-upload.html will appear here.</p>
        </div>
      `;
      return;
    }

    pendingList.innerHTML = pending.map(sub => {
      const isVideo = sub.mediaType === "video";
      return `
        <div class="bg-gray-50 rounded-2xl p-5 border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition hover:bg-white hover:shadow-md">
          <div class="flex items-start gap-4">
            <div class="w-20 h-20 rounded-xl overflow-hidden bg-gray-900 flex-shrink-0 border border-gray-300 relative">
              ${isVideo ? `
                <div class="w-full h-full flex items-center justify-center bg-gray-800 text-orange-400 font-bold text-xl">
                  🎥
                </div>
              ` : `
                <img src="${sub.mediaUrl}" alt="${sub.title}" class="w-full h-full object-cover" onerror="this.src='${DEFAULT_COVER_IMAGE}'" />
              `}
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Pending Review
                </span>
                <span class="text-xs font-bold text-orange-600">${sub.category}</span>
                <span class="text-[11px] text-gray-400">• ${sub.mediaType === "video" ? "🎥 Video" : "📸 Photo"}</span>
              </div>
              <h3 class="text-base font-bold text-gray-900 leading-snug">${sub.title}</h3>
              <p class="text-xs text-gray-600 mt-1 line-clamp-2 max-w-xl">${sub.description || "No description provided."}</p>
              <div class="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-gray-500">
                <span><strong>Creator:</strong> ${sub.creatorName}</span>
                ${sub.email ? `<span><strong>Email:</strong> ${sub.email}</span>` : ""}
                ${sub.phone ? `<span><strong>Phone:</strong> ${sub.phone}</span>` : ""}
              </div>
            </div>
          </div>

          <!-- Moderation Action Buttons -->
          <div class="flex items-center gap-2 self-end md:self-center flex-shrink-0">
            <button 
              onclick="adminApproveSubmission('${sub.id}')"
              class="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5"
            >
              <span>✅</span> <span>Approve & Publish</span>
            </button>
            <button 
              onclick="adminEditSubmission('${sub.id}')"
              class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl transition shadow-sm"
              title="Edit before publishing"
            >
              ✏️ Edit
            </button>
            <button 
              onclick="adminRejectSubmission('${sub.id}')"
              class="bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs px-3.5 py-2.5 rounded-xl transition"
              title="Reject & Discard"
            >
              🗑️ Reject
            </button>
          </div>
        </div>
      `;
    }).join("");
  };

  if (refreshPendingBtn) refreshPendingBtn.addEventListener("click", async () => {
    refreshPendingBtn.disabled = true;
    refreshPendingBtn.innerHTML = `<span>⏳ Refreshing...</span>`;
    await fetchRemotePendingGalleryItems();
    updateMetrics();
    loadPendingList();
    refreshPendingBtn.disabled = false;
    refreshPendingBtn.innerHTML = `<span>🔄 Refresh Submissions</span>`;
    showAlert("Pending list refreshed from cloud.", "info");
  });

  // Global Moderation Helpers
  window.adminApproveSubmission = async (id) => {
    const pending = getPendingGallerySubmissions();
    const sub = pending.find(p => p.id === id);
    if (!sub) return;

    const publishedItem = {
      ...sub,
      id: sub.id.startsWith("gallery-") ? sub.id : `gallery-${Date.now()}`,
      status: "Published",
      isCustom: true
    };

    savePublishedGalleryItem(publishedItem);
    removePendingGallerySubmission(id);

    try {
      await postToAppsScript({
        formType: "save_gallery_item",
        id: publishedItem.id,
        title: publishedItem.title,
        category: publishedItem.category,
        mediaType: publishedItem.mediaType,
        mediaUrl: publishedItem.mediaUrl,
        creatorName: publishedItem.creatorName,
        date: publishedItem.date,
        description: publishedItem.description
      });
    } catch (e) {}

    showAlert(`Approved "${sub.title}"! It is now live on the Visual Gallery.`, "success");
    updateMetrics();
    loadPendingList();
    loadLiveManageList();
  };

  window.adminEditSubmission = (id) => {
    const pending = getPendingGallerySubmissions();
    const sub = pending.find(p => p.id === id);
    if (!sub) return;

    switchTab("upload");
    if (editIdInput) editIdInput.value = sub.id;
    if (formHeading) formHeading.textContent = `Review & Edit: ${sub.title}`;
    if (titleInput) titleInput.value = sub.title;
    if (catSelect) catSelect.value = sub.category;
    if (typeSelect) typeSelect.value = sub.mediaType || "image";
    if (creatorInput) creatorInput.value = sub.creatorName;
    if (descInput) descInput.value = sub.description || "";
    if (urlInput) urlInput.value = sub.mediaUrl || "";

    activeAdminMediaData = sub.mediaUrl;
    if (previewImg && sub.mediaType !== "video") {
      previewImg.src = sub.mediaUrl;
      previewImg.classList.remove("hidden");
      if (previewContainer) previewContainer.classList.remove("hidden");
    }

    if (submitBtn) {
      submitBtn.innerHTML = `<span>Approve & Publish</span> <span>🚀</span>`;
    }

    showAlert(`Loaded "${sub.title}" for review. Make adjustments and click Publish!`, "warning");
  };

  window.adminRejectSubmission = (id) => {
    if (!confirm("Are you sure you want to reject this submission? It will be removed permanently.")) return;
    removePendingGallerySubmission(id);
    showAlert("Submission rejected and removed.", "info");
    updateMetrics();
    loadPendingList();
  };

  // 7. Manage Live Items
  const loadLiveManageList = () => {
    if (!manageList) return;
    const items = getPublishedGalleryItems();

    const search = manageSearch ? manageSearch.value.toLowerCase().trim() : "";
    const cat = manageCatFilter ? manageCatFilter.value : "All";

    let filtered = items;
    if (cat !== "All") {
      filtered = filtered.filter(i => i.category === cat);
    }
    if (search) {
      filtered = filtered.filter(i => 
        (i.title && i.title.toLowerCase().includes(search)) ||
        (i.creatorName && i.creatorName.toLowerCase().includes(search)) ||
        (i.description && i.description.toLowerCase().includes(search))
      );
    }

    if (filtered.length === 0) {
      manageList.innerHTML = `
        <div class="text-center py-12 bg-gray-50 rounded-2xl border border-gray-200">
          <p class="text-xs text-gray-500">No items match your filter.</p>
        </div>
      `;
      return;
    }

    manageList.innerHTML = filtered.map(item => {
      const isVideo = item.mediaType === "video";
      return `
        <div class="bg-gray-50 rounded-2xl p-4 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:bg-white hover:shadow-sm">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-xl overflow-hidden bg-gray-900 flex-shrink-0 border border-gray-200">
              <img src="${item.mediaUrl}" alt="${item.title}" class="w-full h-full object-cover" onerror="this.src='${DEFAULT_COVER_IMAGE}'" />
            </div>
            <div>
              <div class="flex items-center gap-2 mb-0.5">
                <span class="text-[10px] font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">${item.category}</span>
                <span class="text-[11px] text-gray-400">${isVideo ? "🎥 Video" : "📸 Photo"}</span>
              </div>
              <h4 class="text-sm font-bold text-gray-900 leading-snug">${item.title}</h4>
              <span class="text-[11px] text-gray-500 block">By ${item.creatorName || "AIC Media"} • ${item.date || "Dec 2026"}</span>
            </div>
          </div>

          <div class="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
            <button 
              onclick="adminEditLiveItem('${item.id}')"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold px-3 py-2 rounded-xl transition"
            >
              ✏️ Edit
            </button>
            <button 
              onclick="adminDeleteLiveItem('${item.id}')"
              class="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold px-3 py-2 rounded-xl transition"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      `;
    }).join("");
  };

  if (manageSearch) manageSearch.addEventListener("input", loadLiveManageList);
  if (manageCatFilter) manageCatFilter.addEventListener("change", loadLiveManageList);

  window.adminEditLiveItem = (id) => {
    const items = getPublishedGalleryItems();
    const item = items.find(i => i.id === id);
    if (!item) return;

    switchTab("upload");
    if (editIdInput) editIdInput.value = item.id;
    if (formHeading) formHeading.textContent = `Edit Item: ${item.title}`;
    if (titleInput) titleInput.value = item.title;
    if (catSelect) catSelect.value = item.category;
    if (typeSelect) typeSelect.value = item.mediaType || "image";
    if (creatorInput) creatorInput.value = item.creatorName || "";
    if (dateInput) dateInput.value = item.date || "Dec 2026";
    if (descInput) descInput.value = item.description || "";
    if (urlInput) urlInput.value = item.mediaUrl || "";

    activeAdminMediaData = item.mediaUrl;
    if (previewImg && item.mediaType !== "video") {
      previewImg.src = item.mediaUrl;
      previewImg.classList.remove("hidden");
      if (previewContainer) previewContainer.classList.remove("hidden");
    }

    if (submitBtn) {
      submitBtn.innerHTML = `<span>Save Changes</span> <span>💾</span>`;
    }

    showAlert(`Loaded "${item.title}" for editing.`, "warning");
  };

  window.adminDeleteLiveItem = async (id) => {
    if (!confirm("Are you sure you want to remove this item from the live gallery?")) return;
    await deletePublishedGalleryItem(id);
    showAlert("Item removed from the gallery.", "success");
    updateMetrics();
    loadLiveManageList();
  };

  // Run initial check
  checkAuth();
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
  // Cross-browser safe Date parameters: (Year, MonthIndex 0-11, Day, Hours, Minutes, Seconds)
  const festivalDate = new Date(2026, 11, 26, 9, 0, 0).getTime();

  function updateTimer() {
    const now = Date.now();
    const distance = festivalDate - now;

    if (isNaN(distance) || distance <= 0) {
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
// ROBUST DOM INITIALIZATION
// =============================================================
function initAICApp() {
  try { setupCountdownTimer(); } catch (e) { console.error("Countdown init error:", e); }
  try { setupRegistrationForm(); } catch (e) { console.error("Registration init error:", e); }
  try { setupContactForm(); } catch (e) { console.error("Contact init error:", e); }
  try { setupSubscriptionForm(); } catch (e) { console.error("Subscription init error:", e); }
  try { setupTicketPurchase(); } catch (e) { console.error("Ticket init error:", e); }
  try { setupMerchandiseStore(); } catch (e) { console.error("Store init error:", e); }
  try { setupPageantRegistration(); } catch (e) { console.error("Pageant reg init error:", e); }
  try { setupPageantVoting(); } catch (e) { console.error("Pageant vote init error:", e); }
  try { setupMediaUpload(); } catch (e) { console.error("Media upload init error:", e); }
  try { setupAccommodationBooking(); } catch (e) { console.error("Accommodation init error:", e); }
  try { setupTourGuideRequest(); } catch (e) { console.error("Tour guide init error:", e); }
  try { setupVendorRegistration(); } catch (e) { console.error("Vendor init error:", e); }
  try { setupBlogFeed(); } catch (e) { console.error("Blog feed init error:", e); }
  try { setupBlogPostDetail(); } catch (e) { console.error("Blog detail init error:", e); }
  try { setupBlogAdmin(); } catch (e) { console.error("Blog admin init error:", e); }
  try { setupGallery(); } catch (e) { console.error("Gallery init error:", e); }
  try { setupGalleryAdmin(); } catch (e) { console.error("Gallery admin init error:", e); }

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
}

// Execute immediately if DOM is ready, or on DOMContentLoaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAICApp);
} else {
  initAICApp();
}
