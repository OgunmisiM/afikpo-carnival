/**
 * Afikpo International Carnival 2026
 * Master Logic Script - Vanilla JS
 * 
 * FORM SUBMISSION & ALERT SYSTEM
 * Replace 'YOUR_APPS_SCRIPT_URL' with your actual Google Apps Script deployment URL
 */

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzc2MNaPwFyUrhfuW0nwHeV9ELRejLTIYh3xEwyGloIrYzlsYqCZQsgXvT9NvV-EoYw/exec"; // Replace with your deployment URL

// --- ALERT SYSTEM ---
function showAlert(message, type = "success") {
  // Remove existing alerts
  const existingAlert = document.querySelector(".form-alert");
  if (existingAlert) {
    existingAlert.remove();
  }

  // Create alert container
  const alertDiv = document.createElement("div");
  alertDiv.className = "form-alert fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-11/12 md:w-full animate-in fade-in slide-in-from-top-4 duration-300";

  if (type === "success") {
    alertDiv.innerHTML = `
      <div class="bg-green-50 border-l-4 border-green-500 p-4 md:p-6 rounded-lg shadow-lg">
        <div class="flex items-start gap-4">
          <svg class="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-green-800">Success!</h3>
            <p class="text-green-700 text-sm md:text-base mt-1">${message}</p>
          </div>
          <button onclick="this.closest('.form-alert').remove()" class="text-green-500 hover:text-green-700 font-bold text-xl">
            ×
          </button>
        </div>
      </div>
    `;
  } else if (type === "error") {
    alertDiv.innerHTML = `
      <div class="bg-red-50 border-l-4 border-red-500 p-4 md:p-6 rounded-lg shadow-lg">
        <div class="flex items-start gap-4">
          <svg class="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-red-800">Error!</h3>
            <p class="text-red-700 text-sm md:text-base mt-1">${message}</p>
          </div>
          <button onclick="this.closest('.form-alert').remove()" class="text-red-500 hover:text-red-700 font-bold text-xl">
            ×
          </button>
        </div>
      </div>
    `;
  } else if (type === "warning") {
    alertDiv.innerHTML = `
      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 md:p-6 rounded-lg shadow-lg">
        <div class="flex items-start gap-4">
          <svg class="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-yellow-800">Notice</h3>
            <p class="text-yellow-700 text-sm md:text-base mt-1">${message}</p>
          </div>
          <button onclick="this.closest('.form-alert').remove()" class="text-yellow-500 hover:text-yellow-700 font-bold text-xl">
            ×
          </button>
        </div>
      </div>
    `;
  }

  document.body.appendChild(alertDiv);

  // Auto-remove after 6 seconds
  setTimeout(() => {
    if (alertDiv.parentElement) {
      alertDiv.remove();
    }
  }, 6000);
}

// --- FORM SUBMISSION HANDLERS ---

// Handle Registration Form
function setupRegistrationForm() {
  const form = document.getElementById("registration-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect form data - use name attributes for reliability
    const category = form.querySelector("select[name='category']").value;
    const organisationName = form.querySelector("input[name='organisationName']").value;
    const leadName = form.querySelector("input[name='leadName']").value;
    const email = form.querySelector("input[name='email']").value;
    const phone = form.querySelector("input[name='phone']").value;
    const country = form.querySelector("input[name='country']").value;
    const bio = form.querySelector("textarea[name='bio']").value;
    const terms = form.querySelector("input[name='terms']").checked;

    // Prepare data
    const data = {
      formType: "registration",
      category: category,
      organisationName: organisationName,
      leadName: leadName,
      email: email,
      phone: phone,
      country: country,
      bio: bio,
      terms: terms
    };

    // Disable submit button
    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.status === "success") {
        showAlert(result.message, "success");
        form.reset();
      } else {
        showAlert(result.message, "error");
      }
    } catch (error) {
      showAlert("Network error: Please check your Apps Script URL and try again.", "error");
      console.error("Form submission error:", error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Registration";
    }
  });
}

// Handle Contact Form
function setupContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect form data
    const fullName = form.querySelectorAll("input")[0].value;
    const email = form.querySelectorAll("input")[1].value;
    const subject = form.querySelectorAll("input")[2].value;
    const message = form.querySelector("textarea").value;

    // Prepare data
    const data = {
      formType: "contact",
      fullName: fullName,
      email: email,
      subject: subject,
      message: message
    };

    // Disable submit button
    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.status === "success") {
        showAlert(result.message, "success");
        form.reset();
      } else {
        showAlert(result.message, "error");
      }
    } catch (error) {
      showAlert("Network error: Please check your Apps Script URL and try again.", "error");
      console.error("Form submission error:", error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });
}

// Handle Subscription Form
function setupSubscriptionForm() {
  const form = document.querySelector("#newsletter-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect form data
    const email = form.querySelector("input[type='text']").value;

    // Prepare data
    const data = {
      formType: "subscription",
      email: email
    };

    // Disable submit button
    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Subscribing...";

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.status === "success" || result.status === "warning") {
        showAlert(result.message, result.status);
        form.reset();
      } else {
        showAlert(result.message, "error");
      }
    } catch (error) {
      showAlert("Network error: Please check your Apps Script URL and try again.", "error");
      console.error("Form submission error:", error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Subscribe";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Setup all forms
  setupRegistrationForm();
  setupContactForm();
  setupSubscriptionForm();
  // --- 1. MOBILE MENU LOGIC ---
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

    // Close menu when clicking links
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close on clicking outside
    document.addEventListener("click", (e) => {
      if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        closeMenu();
      }
    });
  }

  function openMenu() {
    mobileMenu.classList.remove("hidden");
    body.style.overflow = "hidden"; // Prevent background scroll
    // Change hamburger icon to 'X' if desired (Optional)
  }

  function closeMenu() {
    mobileMenu.classList.add("hidden");
    body.style.overflow = "auto";
  }

  // --- 2. ACTIVE PAGE INDICATOR ---
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const allLinks = document.querySelectorAll(".nav-link, #mobile-menu a");

  allLinks.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("text-orange-600", "font-bold");
      if (link.parentElement.id !== "mobile-menu") {
        link.classList.add("border-b-2", "border-orange-600");
      }
    }
  });

  // --- 3. DYNAMIC COUNTDOWN TIMER ---
  const countdownBox = document.getElementById("countdown-timer");
  if (countdownBox) {
    const targetDate = new Date("December 1, 2026 00:00:00").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const gap = targetDate - now;

      if (gap <= 0) {
        countdownBox.innerHTML =
          "<h3 class='text-2xl font-bold'>The Carnival has Started!</h3>";
        return;
      }

      const second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;

      const d = Math.floor(gap / day);
      const h = Math.floor((gap % day) / hour);
      const m = Math.floor((gap % hour) / minute);
      const s = Math.floor((gap % minute) / second);

      // Update DOM with padded numbers (e.g., 09 instead of 9)
      if (document.getElementById("days")) {
        document.getElementById("days").innerText = d < 10 ? `0${d}` : d;
        document.getElementById("hours").innerText = h < 10 ? `0${h}` : h;
        document.getElementById("minutes").innerText = m < 10 ? `0${m}` : m;
        document.getElementById("seconds").innerText = s < 10 ? `0${s}` : s;
      }
    };

    setInterval(updateTimer, 1000);
    updateTimer();
  }

  // --- 4. SCROLL REVEAL (Observer API) ---
  // Add class 'reveal' to any HTML element you want to fade in on scroll
  const revealCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target); // Animation happens only once
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    threshold: 0.15,
  });

  document.querySelectorAll(".reveal").forEach((el) => {
    revealObserver.observe(el);
  });

  // --- 5. SMOOTH HEADER TRANSITION ---
  const navBar = document.querySelector("nav");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navBar.classList.add("bg-white/100", "shadow-md");
      navBar.classList.remove("bg-white/95");
    } else {
      navBar.classList.remove("shadow-md");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".carousel-item");
  const dots = document.querySelectorAll(".dot");

  let currentSlide = 0;
  let slideInterval;

  const showSlide = (index) => {
    // Remove active states
    slides.forEach((slide) => {
      slide.classList.remove("opacity-100", "z-10");
      slide.classList.add("opacity-0", "z-0");
    });
    dots.forEach((dot) => dot.classList.replace("bg-white", "bg-white/50"));
    dots.forEach((dot) => dot.classList.remove("w-8"));

    // Set new active slide
    slides[index].classList.add("opacity-100", "z-10");
    slides[index].classList.remove("opacity-0", "z-0");
    dots[index].classList.replace("bg-white/50", "bg-white");
    dots[index].classList.add("w-8"); // Elongate active dot for a modern look
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  };

  // Auto-play timer (5000ms = 5 seconds)
  const startAutoPlay = () => {
    slideInterval = setInterval(nextSlide, 3000);
  };

  const resetTimer = () => {
    clearInterval(slideInterval);
    startAutoPlay();
  };

  // Event Listeners - Only dots (no arrow buttons)
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentSlide = index;
      showSlide(currentSlide);
      resetTimer();
    });
  });

  // Initialize
  showSlide(0);
  startAutoPlay();
});

// Infinite Partner Logo Slider Logic
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("partner-track");
  if (track) {
    // Clone the inner HTML to create the loop
    const clone = track.innerHTML;
    track.innerHTML += clone; // Append a duplicate set of logos
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("partner-track-2");
  if (track) {
    // Clone the inner HTML to create the loop
    const clone = track.innerHTML;
    track.innerHTML += clone; // Append a duplicate set of logos
  }
});
// End of main.js
