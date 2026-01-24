# README - Afikpo Carnival Forms System

## 🎉 Overview

Complete Google Sheets form submission system for the Afikpo International Carnival 2026 website with:
- ✅ Registration form → Google Sheets
- ✅ Contact form → Google Sheets  
- ✅ Newsletter subscription → Google Sheets
- ✅ Beautiful success/error/warning alerts
- ✅ Server-side validation
- ✅ Real-time data storage

---

## 📁 What's Included

### Code Files
1. **Code.gs** - Google Apps Script (serverless backend)
2. **js/main.js** - Updated with form handlers + alert system
3. **css/style.css** - Alert animations added
4. **registration.html** - Form with proper field names
5. **contact.html** - Form with proper field names
6. **index.html** - Newsletter form updated

### Documentation Files
1. **SETUP_GUIDE.md** - Step-by-step 15-minute setup
2. **QUICK_SETUP.md** - 5-minute quick reference
3. **IMPLEMENTATION_SUMMARY.md** - Complete technical details
4. **ALERT_VISUAL_REFERENCE.md** - Alert styling & design specs
5. **README.md** - This file

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Create Google Sheet
```
https://sheets.google.com → Create new → Name: "Afikpo Carnival Forms"
```

### Step 2: Create 3 Sheet Tabs
- Rename "Sheet1" to "Registrations"
- Add "Contacts" sheet
- Add "Subscriptions" sheet

### Step 3: Deploy Apps Script
```
In Google Sheet:
Tools > Script editor > Paste Code.gs content > Save > Deploy > Web app
```

### Step 4: Copy Deployment URL
After deployment, copy the URL that looks like:
```
https://script.google.com/macros/s/AKfycb...../usercontent
```

### Step 5: Update main.js
```javascript
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycb...../usercontent";
```

### Step 6: Test Forms
Try each form on your website - you should see green alerts!

---

## 📋 Form Details

### Registration Form
**Page:** `/registration.html`
**Fields:**
- Category (required)
- Organisation/Troupe Name (required)
- Lead Contact Name (required)
- Email (required, validated)
- Phone (required)
- Country/State (required)
- Bio/Description (optional)
- Terms Checkbox (required)

**Saves to:** Registrations sheet

### Contact Form
**Page:** `/contact.html`
**Fields:**
- Full Name (required)
- Email (required, validated)
- Subject (optional)
- Message (required)

**Saves to:** Contacts sheet

### Newsletter Subscription
**Page:** `/index.html` (footer)
**Fields:**
- Email (required, validated, no duplicates)

**Saves to:** Subscriptions sheet

---

## 🎨 Alert System

Three beautiful, responsive alerts:

### ✅ Success (Green)
Shows when form submits successfully
- Auto-closes in 6 seconds
- Can be closed manually
- Smooth slide-down animation

### ❌ Error (Red)
Shows when validation fails or error occurs
- Displays specific error message
- Auto-closes in 6 seconds
- Submit button re-enables

### ⚠️ Warning (Yellow)
Shows for non-critical issues
- E.g., "Email already subscribed"
- Auto-closes in 6 seconds
- Non-blocking notification

---

## 🛡️ Security Features

✅ **Server-side validation** - All data checked in Apps Script
✅ **Email validation** - Regex pattern checks validity
✅ **Duplicate prevention** - Subscriptions checked for existing emails
✅ **HTTPS** - Google Apps Script always uses HTTPS
✅ **Google authentication** - Script runs with your Google account
✅ **No exposure** - Database details hidden from frontend
✅ **Timestamps** - All submissions timestamped server-side
✅ **Error handling** - Graceful error messages for users

---

## 📊 Data Saved to Google Sheets

### Registrations Sheet
Columns: Timestamp, Category, Organisation/Troupe Name, Lead Contact Name, Email, Phone, Country/State, Bio/Description

### Contacts Sheet
Columns: Timestamp, Full Name, Email, Subject, Message

### Subscriptions Sheet
Columns: Timestamp, Email

**Note:** Email is auto-deduplicated for subscriptions

---

## 🚀 Features

✨ **Form Features:**
- Real-time Google Sheets integration
- Client-side input validation
- Server-side validation
- Form clearing on success
- Button state management
- Loading indicators

✨ **Alert Features:**
- Responsive design (mobile-friendly)
- Smooth animations
- Auto-close in 6 seconds
- Manual close button
- Semantic HTML
- Accessible design

✨ **Data Features:**
- Automatic timestamps
- Duplicate prevention (subscriptions)
- Email validation
- Error logging
- Formatted JSON responses

---

## 🔧 Technical Stack

- **Frontend:** HTML5, CSS3 (Tailwind), JavaScript (Vanilla)
- **Backend:** Google Apps Script
- **Database:** Google Sheets
- **Hosting:** Your web server for HTML/CSS/JS
- **API:** Google Apps Script Web App (HTTP POST)

---

## 📚 Documentation Files

### SETUP_GUIDE.md
Complete step-by-step guide with:
- Detailed setup instructions
- Troubleshooting section
- Configuration options
- Advanced customization

### QUICK_SETUP.md
Quick 5-minute checklist:
- All steps on one page
- URLs and file references
- Testing checklist

### IMPLEMENTATION_SUMMARY.md
Technical deep-dive:
- Architecture explanation
- Code function descriptions
- Validation rules
- Data flow diagram

### ALERT_VISUAL_REFERENCE.md
Design & styling reference:
- Visual alert mockups
- Color schemes
- CSS classes
- Accessibility details

---

## ✅ Testing Checklist

Before going live, test:

- [ ] Registration form submits
- [ ] Green alert appears on success
- [ ] Data appears in Registrations sheet
- [ ] Contact form submits
- [ ] Contact data appears in sheet
- [ ] Newsletter email saves
- [ ] Duplicate emails show warning
- [ ] Invalid emails show error
- [ ] Forms clear after success
- [ ] Alerts auto-close
- [ ] Close button works
- [ ] Mobile alerts display correctly
- [ ] Button states change during submit

---

## 🐛 Troubleshooting

### Forms don't submit
1. Check APPS_SCRIPT_URL is correct
2. Make sure Google Sheet exists
3. Check browser console (F12) for errors
4. Verify Apps Script deployment is active

### Data doesn't appear in Google Sheet
1. Check sheet names match exactly (Registrations, Contacts, Subscriptions)
2. Check Apps Script logs for errors
3. Verify the Google Sheet is accessible to the Apps Script

### Alerts don't show
1. Check main.js is loaded (Network tab in DevTools)
2. Verify CSS file is loaded (Alert styles)
3. Check console for JavaScript errors

### "Network error" message
1. Verify APPS_SCRIPT_URL is complete (no extra spaces)
2. Test the URL in browser
3. Check internet connection
4. Try in different browser

---

## 🔐 Privacy & Security Considerations

⚠️ **Important:**
- Store form data securely (Google Sheets)
- Don't share Google Sheet URL publicly
- Consider archiving old submissions
- Be aware of data retention policies
- Comply with GDPR/privacy regulations if applicable
- Consider adding privacy notice to forms

---

## 📱 Responsive Design

All forms and alerts are responsive:
- ✅ Mobile phones (320px+)
- ✅ Tablets (768px+)
- ✅ Desktops (1024px+)
- ✅ Large screens (1280px+)

Touch-friendly:
- ✅ Large tap targets (buttons)
- ✅ Proper spacing
- ✅ Readable text
- ✅ Good contrast

---

## 🎯 Next Steps

1. **Follow SETUP_GUIDE.md** for complete setup
2. **Test all three forms** with your Google Sheet
3. **Monitor submissions** regularly
4. **Archive data** as needed
5. **Collect feedback** from users

---

## 📞 Support

If you need help:

1. **Check SETUP_GUIDE.md** - Most common issues covered
2. **Review IMPLEMENTATION_SUMMARY.md** - Technical details
3. **Check browser console** (F12) - JavaScript errors
4. **Check Apps Script logs** - Server-side errors
5. **Verify Google Sheet exists** - Access and permissions

---

## 📄 Documentation Map

```
README.md (You are here)
  ├── Quick overview
  └── Links to detailed docs

QUICK_SETUP.md
  └── 5-minute checklist

SETUP_GUIDE.md
  ├── Step-by-step instructions
  ├── Troubleshooting
  └── Advanced config

IMPLEMENTATION_SUMMARY.md
  ├── Technical details
  ├── Code explanations
  ├── Data flow
  └── Security features

ALERT_VISUAL_REFERENCE.md
  ├── Alert mockups
  ├── Color schemes
  ├── CSS classes
  └── Accessibility
```

---

## 🎉 Success Indicators

You'll know it's working when:

✅ Form submits without errors
✅ Green alert appears immediately
✅ Alert closes after 6 seconds
✅ New row appears in Google Sheet
✅ Timestamp is correct
✅ All form data is present

---

## 📈 What Happens When Forms Are Submitted

```
User → Website → JavaScript → Apps Script → Google Sheets
         (HTML)    (fetch)      (backend)     (database)
                      ↓
                    Alert ← Response
                    (Green/Red/Yellow)
```

Process takes ~1 second:
1. User submits form (0.1s)
2. JavaScript validates + sends (0.1s)
3. Apps Script processes (0.2s)
4. Google Sheets saves (0.3s)
5. Response sent back (0.1s)
6. Alert displays (instant)

---

## 📝 License & Usage

This form system is created for Afikpo International Carnival 2026.
Feel free to modify for your event needs.

---

## 🔄 Maintenance

Regular maintenance tasks:

**Weekly:**
- Check for new submissions
- Verify no errors in logs

**Monthly:**
- Archive old data (optional)
- Review submission statistics
- Check for spam/invalid data

**Quarterly:**
- Update validation rules if needed
- Review security settings
- Backup Google Sheet

---

## ✨ Features at a Glance

| Feature | Status | Details |
|---------|--------|---------|
| Registration Form | ✅ Ready | Full validation |
| Contact Form | ✅ Ready | Email required |
| Newsletter | ✅ Ready | Duplicate prevention |
| Success Alerts | ✅ Ready | Green, auto-close |
| Error Alerts | ✅ Ready | Red, detailed messages |
| Mobile Responsive | ✅ Ready | All devices |
| Server Validation | ✅ Ready | Google Apps Script |
| Data Timestamps | ✅ Ready | Automatic |
| Email Validation | ✅ Ready | Regex pattern |
| Form Clearing | ✅ Ready | On success |

---

**Ready to go! Follow SETUP_GUIDE.md to get started. 🚀**

*Last Updated: January 24, 2026*
