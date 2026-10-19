# Afikpo International Carnival 2026
## Full System Setup & Reference Guide

### Overview
This project is an all-in-one web portal for the **Afikpo International Carnival 2026**. All 9 major features submit directly to your Google Sheets database using Google Apps Script (serverless backend).

---

## 📋 Features & Portals Included

| # | Feature | Web Page | Google Sheet Tab |
|---|---|---|---|
| 1 | **Buy Carnival Village Tickets** | `tickets.html` | `Tickets` |
| 2 | **Carnival Merch Store (Caps, Shirts, Beads)** | `store.html` | `MerchandiseOrders` |
| 3 | **Register for Pageantry (Miss Afikpo International 2026)** | `pageant-registration.html` | `PageantRegistrations` |
| 4 | **Vote Miss Afikpo International** | `pageant-voting.html` | `PageantVotes` |
| 5 | **Upload Video & Documentary** | `media-upload.html` | `MediaSubmissions` |
| 6 | **Reserve Accommodation (Hotels & Chalets)** | `accommodation.html` | `Accommodations` |
| 7 | **Request a Personal Tour Guide** | `tour-guide.html` | `TourGuides` |
| 8 | **Register as a Vendor (Food/Crafts/Corporate)** | `vendor-registration.html` | `Vendors` |
| 9 | **News & Editorial Blog** | `blog.html` & `blog-post.html` | `BlogPosts` |
| 10 | **Blog Admin CMS (Frontend Editor)** | `blog-admin.html` | `BlogPosts` |
| 11 | **General Troupe & Performer Registration** | `registration.html` | `Registrations` |
| 12 | **Contact & Inquiries Desk** | `contact.html` | `Contacts` |
| 13 | **Newsletter Subscription** | `index.html` (Footer) | `Subscriptions` |

---

## ⚡ 5-Minute Google Apps Script Deployment

### Step 1: Open Google Sheets
1. Go to [Google Sheets](https://sheets.google.com) and create a new sheet or use your existing one (e.g. *"Afikpo Carnival 2026 Database"*).

### Step 2: Paste Backend Code
1. In Google Sheets, click **Extensions > Apps Script** (or Tools > Script editor).
2. Delete any default code.
3. Open [`Code.gs`](file:///c:/Users/USER/Desktop/Afikpo%20New/Code.gs) in this project, copy the entire content, and paste it into the Apps Script editor.
4. Click **Save** (Ctrl+S / Cmd+S).

### Step 3: Deploy as Web App
1. Click **Deploy > New deployment** (top right).
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in:
   - **Description:** `AIC 2026 Master API`
   - **Execute as:** `Me (your Google email)`
   - **Who has access:** `Anyone` *(Important: required for web visitors to submit forms and read articles)*.
4. Click **Deploy**.
5. Grant permissions when prompted by Google.
6. **Copy the Web App URL** (e.g. `https://script.google.com/macros/s/AKfycb.../exec`).

### Step 4: Update `js/main.js`
1. Open [`js/main.js`](file:///c:/Users/USER/Desktop/Afikpo%20New/js/main.js) and paste your URL on line 9:
   ```javascript
   const APPS_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec";
   ```
2. Save the file. That's it!

> [!NOTE]
> **Automatic Sheet Creation**: You do NOT need to manually create all sheet tabs. The script automatically creates each tab (`Tickets`, `MerchandiseOrders`, `PageantRegistrations`, `PageantVotes`, `MediaSubmissions`, `Accommodations`, `TourGuides`, `Vendors`, `BlogPosts`, `Registrations`, `Contacts`, `Subscriptions`) with stylized orange headers the first time data is submitted.

---

## ✍️ How the Frontend Blog Editor Works (`blog-admin.html`)

### Admin Access
1. Open `blog-admin.html` in your browser.
2. Enter the Admin Passcode:
   - **Default PIN:** `afikpo2026`
3. Once logged in, you can:
   - **Create New Articles**: Enter title, category, author, excerpt, and full story.
   - **Add Images**: Paste any web image URL or select an image file from your phone/computer (converted and previewed instantly).
   - **Edit / Delete**: Edit existing articles or remove outdated ones.
   - **Publish**: Click *"Publish / Save to Google Sheets"*. It writes to your `BlogPosts` sheet in real-time, instantly visible on `blog.html` and `blog-post.html`.

---

## 💳 Paystack Setup for Online Pageant Voting

The pageant voting portal ([`pageant-voting.html`](file:///c:/Users/USER/Desktop/Afikpo%20New/pageant-voting.html)) is powered by **Paystack Inline Checkout**. Points are **only credited after payment confirmation**, and 1 free daily vote per device is preserved every 24 hours.

### Step 1: Get Your Paystack Public Key
1. Go to [Paystack Dashboard](https://dashboard.paystack.com) and log in (or sign up).
2. In the left menu, go to **Settings > API Keys & Webhooks**.
3. Copy your **Public Key**:
   - For testing: Copy **Test Public Key** (`pk_test_...`).
   - For live coronation payments: Copy **Live Public Key** (`pk_live_...`).

> [!IMPORTANT]
> **Never put your Secret Key (`sk_...`) in frontend code!** Only the **Public Key** (`pk_...`) belongs in [`js/main.js`](file:///c:/Users/USER/Desktop/Afikpo%20New/js/main.js).

### Step 2: Configure `js/main.js`
1. Open [`js/main.js`](file:///c:/Users/USER/Desktop/Afikpo%20New/js/main.js) and find line 16:
   ```javascript
   const PAYSTACK_PUBLIC_KEY = "pk_test_YOUR_PAYSTACK_PUBLIC_KEY_HERE";
   ```
2. Paste your Public Key between the quotes and save.

### Step 3: How Voting Works
- **Free Daily Vote (1 Vote - ₦0)**:
  - Allowed once every 24 hours per visitor.
  - Automatically verified via local device cooldown.
- **Paid Booster Packages (10, 50, 100 Votes)**:
  - Opens Paystack's secure inline modal over the page.
  - Supports Nigerian Debit Cards, Bank Transfer, USSD, OPay, and Apple Pay.
  - Points reflect on the live leaderboard **instantly** after payment confirmation.
  - Each verified vote is logged into your Google Sheet (`PageantVotes`) with the Paystack Transaction Reference (`AIC-VOTE-...`) and `PAID` status.

### Step 4: Testing with Paystack Test Cards
When using your `pk_test_...` key:
- **Test Card Number:** `4084 0840 0840 0840`
- **Expiry:** Any future date (e.g. `12/30`)
- **CVV:** `408`
- **PIN:** `1234`
- **OTP:** `123456`

