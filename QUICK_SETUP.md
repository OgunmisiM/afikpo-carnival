# Quick Setup Checklist

## 5-Minute Setup

### [ ] Step 1: Create Google Sheet
- Go to sheets.google.com
- Create new sheet: "Afikpo Carnival Forms"

### [ ] Step 2: Create 3 Tabs
- Rename "Sheet1" → "Registrations"
- Add sheet → "Contacts"
- Add sheet → "Subscriptions"

### [ ] Step 3: Add Apps Script
- Tools > Script editor
- Delete existing code
- Copy entire Code.gs file and paste
- Save (name it: "Afikpo Carnival Forms")

### [ ] Step 4: Deploy
- Click "Deploy"
- New deployment > Web app
- Execute as: Your account
- Who has access: Anyone
- **COPY THE URL** (Important!)

### [ ] Step 5: Update main.js
- Open `js/main.js`
- Find: `const APPS_SCRIPT_URL = "YOUR_APPS_SCRIPT_URL";`
- Replace with your deployment URL
- Save

### [ ] Step 6: Test
- Test registration form
- Test contact form  
- Test newsletter subscription
- Check Google Sheet for data

---

## Deployment URL Format
```
https://script.google.com/macros/s/[YOUR_SCRIPT_ID]/usercontent
```

## Files Modified
- ✅ `js/main.js` - Added form handlers + alert system
- ✅ `css/style.css` - Added alert animations
- ✅ `registration.html` - Added proper form field names
- ✅ `contact.html` - Added proper form field names
- ✅ `index.html` - Updated subscription form (id="newsletter-form")
- ✅ `Code.gs` - New Apps Script file (for Google Sheets)

## Alert System
- **Green** = Success ✅
- **Red** = Error ❌
- **Yellow** = Warning ⚠️
- Auto-closes after 6 seconds
- Closable with × button

---

## Need Help?
See SETUP_GUIDE.md for detailed instructions and troubleshooting.
