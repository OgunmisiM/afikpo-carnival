/**
 * Afikpo International Carnival 2026
 * Master Logic Script - Vanilla JS
 */

document.addEventListener("DOMContentLoaded", () => {
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

// End of main.js
