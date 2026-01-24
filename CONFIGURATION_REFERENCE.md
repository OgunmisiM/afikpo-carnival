# Configuration Reference

## Google Apps Script Configuration

### File: Code.gs

**Sheet Names (Must match exactly):**
```javascript
CONFIG = {
  registrationSheet: "Registrations",  // Where registration data goes
  contactSheet: "Contacts",             // Where contact data goes
  subscriptionSheet: "Subscriptions"     // Where newsletter data goes
}
```

**To change sheet names:**
1. Edit the three strings in Code.gs
2. Rename sheets in Google Sheets to match
3. Re-deploy the Apps Script

---

## Form IDs and Names

### Registration Form (registration.html)
```html
<form id="registration-form">
  <select name="category" required>
  <input name="organisationName" required>
  <input name="leadName" required>
  <input name="email" type="email" required>
  <input name="phone" type="tel" required>
  <input name="country" required>
  <textarea name="bio"></textarea>
  <input id="terms" name="terms" type="checkbox" required>
</form>
```

### Contact Form (contact.html)
```html
<form id="contact-form">
  <input name="fullName" required>
  <input name="email" type="email" required>
  <input name="subject">
  <textarea name="message" required></textarea>
</form>
```

### Subscription Form (index.html)
```html
<form id="newsletter-form">
  <input name="email" type="email" required>
</form>
```

---

## JavaScript Configuration

### File: js/main.js

**Required Configuration:**
```javascript
// Line ~8: Replace with your deployment URL
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/usercontent";
```

**Alert Duration:**
```javascript
// Line ~96: Change auto-close time (in milliseconds)
setTimeout(() => {
  if (alertDiv.parentElement) {
    alertDiv.remove();
  }
}, 6000);  // ← Change 6000 to different value
           // 3000 = 3 seconds
           // 10000 = 10 seconds
           // Set to Infinity to disable auto-close
```

**Form Selectors (if you change form IDs):**
```javascript
// Find these functions and update the selectors:
function setupRegistrationForm() {
  const form = document.getElementById("registration-form"); // ← Update ID here
}

function setupContactForm() {
  const form = document.getElementById("contact-form"); // ← Update ID here
}

function setupSubscriptionForm() {
  const form = document.querySelector("#newsletter-form"); // ← Update selector here
}
```

---

## CSS Configuration

### File: css/style.css

**Alert Animation Speed:**
```css
/* Lines at end of file */
@keyframes slideInFromTop {
  /* Change 300ms to any duration you prefer */
  animation: slideInFromTop 300ms ease-out;
}
```

**Alert Colors** (if you want to customize):
```css
/* Success (green) - modify these color classes */
.bg-green-50 { /* Light background */ }
.border-green-500 { /* Left border */ }
.text-green-800 { /* Text color */ }

/* Error (red) - modify these color classes */
.bg-red-50 { /* Light background */ }
.border-red-500 { /* Left border */ }
.text-red-800 { /* Text color */ }

/* Warning (yellow) - modify these color classes */
.bg-yellow-50 { /* Light background */ }
.border-yellow-500 { /* Left border */ }
.text-yellow-800 { /* Text color */ }
```

---

## Form Validation Rules

### Registration Form Validation
```javascript
// In Code.gs - handleRegistration() function
requiredFields = [
  "category",          // Must not be empty
  "organisationName",  // Must not be empty
  "leadName",          // Must not be empty
  "email",             // Must be valid email format
  "phone",             // Must not be empty
  "country",           // Must not be empty
  "terms"              // Must be true/checked
]
```

### Contact Form Validation
```javascript
// In Code.gs - handleContact() function
requiredFields = [
  "fullName",  // Must not be empty
  "email",     // Must be valid email format
  "message"    // Must not be empty
]
```

### Subscription Validation
```javascript
// In Code.gs - handleSubscription() function
Validations:
1. Email not empty
2. Valid email format
3. Not already in Subscriptions sheet (duplicate check)
```

**To make a field optional:**
Remove it from the `requiredFields` array in Code.gs

**To add validation:**
Edit the validation function in Code.gs (e.g., `isValidEmail()`)

---

## Email Validation Pattern

### Current Pattern
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

**What it checks:**
- At least 1 character before @
- @ symbol present
- At least 1 character after @
- Dot (.) present
- At least 1 character after dot
- No spaces

**To use stricter pattern:**
```javascript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+\.[^\s@]+$/;
// Requires: something@domain.co.uk (not @example.com)
```

**To use more lenient pattern:**
```javascript
const emailRegex = /^.+@.+/;
// Allows: anything@anything
```

---

## Error Messages

### Customizing Error Messages

**In Code.gs:**
```javascript
// Find createResponse() calls and change the message
return createResponse("error", "Your custom message here");

// Current messages:
"Missing required field: [fieldname]"
"Invalid email address"
"You must agree to the terms and conditions"
"Server error: [error details]"
"Failed to process registration: [error details]"
"Thank you for reaching out! We'll respond shortly."
"Failed to process contact form: [error details]"
"Email address is required"
"This email is already subscribed"
"Successfully subscribed to our newsletter!"
"Failed to process subscription: [error details]"
```

**In main.js (for client-side errors):**
```javascript
// Validation error messages
if (!email) {
  showAlert("Email is required", "error");
}
```

---

## Google Apps Script Deployment Settings

### Deployment Configuration
```
Type: Web app
Execute as: Your Google Account
Who has access: Anyone
New version needed if you change Code.gs
```

### Getting Deployment URL
1. Click "Deploy" → "Manage deployments"
2. Click the deployment
3. Copy "https://script.google.com/macros/s/.../usercontent"
4. Paste in main.js as APPS_SCRIPT_URL

### Re-deploying After Changes
1. Make changes to Code.gs
2. Click "Deploy" → "Manage deployments"
3. Click the pencil icon on latest deployment
4. Change version number
5. Save
6. URL stays the same (or use "Deploy" to get new URL)

---

## Data Storage Configuration

### Google Sheet Setup
```
Spreadsheet name: Afikpo Carnival Forms (any name works)
Sheet tabs required:
  - Registrations
  - Contacts
  - Subscriptions

Columns (auto-created):
  Registrations: Timestamp | Category | Org Name | Lead Name | Email | Phone | Country | Bio
  Contacts: Timestamp | Full Name | Email | Subject | Message
  Subscriptions: Timestamp | Email
```

### Sharing Settings
```
Private (recommended): Only you can see form data
Share view-only: Team members can see submissions
Share edit: Team members can edit/archive data
```

---

## Mobile Responsiveness Configuration

### Current Breakpoints
```css
sm: 640px   /* Mobile phones */
md: 768px   /* Tablets */
lg: 1024px  /* Desktops */
xl: 1280px  /* Large screens */
```

### Alert Responsive Behavior
```css
Mobile (< 768px):
  Width: 92vw (11/12 of viewport)
  Padding: p-4 (1rem)
  Font: text-sm

Desktop (>= 768px):
  Width: auto (max-w-md = 28rem)
  Padding: p-6 (1.5rem)
  Font: text-base
```

### Form Responsive Behavior
```html
<!-- Single column on mobile, 2 columns on desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <!-- Change to grid-cols-1 md:grid-cols-3 for 3 columns on desktop -->
</div>
```

---

## Advanced: Adding New Form

### Step 1: Create HTML Form
```html
<form id="my-form">
  <input name="field1" required>
  <input name="field2" required>
  <textarea name="field3"></textarea>
  <button type="submit">Submit</button>
</form>
```

### Step 2: Add Apps Script Handler
```javascript
// In Code.gs, in doPost() function:
case "myForm":
  result = handleMyForm(requestData);
  break;

// Add handler function:
function handleMyForm(data) {
  try {
    const requiredFields = ["field1", "field2"];
    for (let field of requiredFields) {
      if (!data[field] || data[field].toString().trim() === "") {
        return createResponse("error", `Missing required field: ${field}`);
      }
    }
    
    const sheet = getSheetByName("MyForm");
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Field 1", "Field 2", "Field 3"]);
    }
    
    sheet.appendRow([
      new Date().toLocaleString(),
      data.field1,
      data.field2,
      data.field3 || ""
    ]);
    
    return createResponse("success", "Thank you for submitting!");
  } catch (error) {
    return createResponse("error", "Failed to process form: " + error.toString());
  }
}
```

### Step 3: Add JavaScript Handler
```javascript
// In main.js:
function setupMyForm() {
  const form = document.getElementById("my-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      formType: "myForm",
      field1: form.querySelector("input[name='field1']").value,
      field2: form.querySelector("input[name='field2']").value,
      field3: form.querySelector("textarea[name='field3']").value
    };

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify(data)
      });

      const result = await response.json();
      showAlert(result.message, result.status);
      if (result.status === "success") form.reset();
    } catch (error) {
      showAlert("Network error: Please try again.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
    }
  });
}

// Add to DOMContentLoaded:
setupMyForm();
```

### Step 4: Create Google Sheet Tab
- Add new sheet named "MyForm"
- Add headers: Timestamp | Field 1 | Field 2 | Field 3

---

## Environment Variables

### Recommended (for security):
Store sensitive data in Google Sheet:
1. Create "Settings" sheet
2. Store API keys, emails, etc.
3. Read in Apps Script using getValues()
4. Never expose in frontend JavaScript

---

## Performance Tuning

### For Faster Submissions:
1. Reduce form fields
2. Remove unnecessary validation
3. Cache Google Sheets connection
4. Consider batch processing

### For Better Error Messages:
1. Add more specific validation
2. Return detailed error messages
3. Log errors for debugging

---

## Backup & Recovery

### Manual Backup:
```
1. Open Google Sheet
2. File → Download → Google Sheets (XLSX)
3. Save locally as backup
```

### Automatic Backup (Optional):
```javascript
// Add to Apps Script to email weekly backup:
function backupData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  GmailApp.sendEmail(
    "your-email@gmail.com",
    "Weekly Backup: " + new Date(),
    "See attachment",
    { attachments: [ss.getAs(MimeType.PDF)] }
  );
}

// Set up trigger: Triggers → New trigger → Weekly
```

---

**Save this file as reference while configuring your forms!**
