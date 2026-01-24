# Afikpo International Carnival 2026
## Google Sheets Form Integration Setup Guide

### Overview
This guide will help you set up Google Sheets to store all form submissions from your website (Registration, Contact, and Subscription forms).

---

## STEP 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **"+ New"** to create a new spreadsheet
3. Name it: `Afikpo Carnival Forms`
4. Click **"Create"**

---

## STEP 2: Create Sheet Tabs

By default, you'll have "Sheet1". Rename it and create 3 sheets:

1. **Right-click** on "Sheet1" and rename it to: `Registrations`
2. **Create two more sheets:**
   - Click the **"+"** button at the bottom
   - Name them: `Contacts` and `Subscriptions`

### Expected Sheet Headers (optional - Apps Script will add these automatically):

**Registrations Sheet:**
- Timestamp | Category | Organisation/Troupe Name | Lead Contact Name | Email | Phone | Country/State | Bio/Description

**Contacts Sheet:**
- Timestamp | Full Name | Email | Subject | Message

**Subscriptions Sheet:**
- Timestamp | Email

---

## STEP 3: Set Up Google Apps Script

1. **In your Google Sheet**, go to **Tools > Script editor**
2. **Delete** any existing code
3. **Copy and paste** the entire code from `Code.gs` file in your project
4. **Click Save** (Ctrl+S or Cmd+S)
5. **Name the project:** "Afikpo Carnival Forms"
6. **Click Save** again

### Test the Script (Optional but Recommended):
1. Click the **"Run"** button (or Select > testDoPost > Run)
2. You should see logs confirming the test worked
3. Check your Google Sheet - a test subscription should appear

---

## STEP 4: Deploy as Web App

1. Click **"Deploy"** (top right)
2. Click **"New deployment"** (if you don't see this, click the gear icon)
3. **Type:** Select "Web app"
4. **Execute as:** Your Google Account (select yourself)
5. **Who has access:** "Anyone"
6. Click **"Deploy"**
7. **IMPORTANT:** Copy the deployment URL that appears
   - It will look like: `https://script.google.com/macros/s/AKfyc...../usercontent`

---

## STEP 5: Update Your HTML Files

1. **Open `js/main.js`** in your editor
2. **Find this line (near the top):**
   ```javascript
   const APPS_SCRIPT_URL = "YOUR_APPS_SCRIPT_URL";
   ```
3. **Replace** `"YOUR_APPS_SCRIPT_URL"` with the deployment URL from Step 4
   - Example:
   ```javascript
   const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxxxxxxxxxxx/usercontent";
   ```
4. **Save the file**

---

## STEP 6: Test Your Forms

### Test Registration Form:
1. Go to your website's `/registration.html` page
2. Fill in the form with test data
3. Click "Submit Registration"
4. You should see a **green success alert**
5. Check your Google Sheet - the data should appear in the `Registrations` tab

### Test Contact Form:
1. Go to `/contact.html`
2. Fill in the form
3. Click "Send Message"
4. You should see a **green success alert**
5. Check the `Contacts` sheet in Google

### Test Subscription:
1. Go to `/index.html` (home page)
2. Scroll to footer
3. Enter an email in the newsletter box
4. Click "Subscribe"
5. You should see a **green success alert**
6. Check the `Subscriptions` sheet

---

## Form Features

### ✅ Success Alert (Green)
- Shows when form is successfully submitted
- Displays success message from server
- Auto-closes after 6 seconds
- User can close manually with "×" button

### ❌ Error Alert (Red)
- Shows validation errors or server issues
- Displays specific error message
- Auto-closes after 6 seconds
- User can close manually with "×" button

### ⚠️ Warning Alert (Yellow)
- Shows for non-critical issues (e.g., duplicate email on subscription)
- Auto-closes after 6 seconds

### Form Validation
The Apps Script validates:
- **Registration:** All fields required + terms checkbox
- **Contact:** Name, email, and message required
- **Subscription:** Valid email required + no duplicates

---

## Troubleshooting

### Issue: "Network error" appears
**Solution:** 
1. Check that you copied the deployment URL correctly
2. Make sure there are no extra spaces before/after the URL
3. Test the URL in your browser (it should load a blank page)

### Issue: Form submits but data doesn't appear in Google Sheet
**Solution:**
1. Make sure all three sheets exist (Registrations, Contacts, Subscriptions)
2. Check the Apps Script logs: **Tools > Script editor > Execution log**
3. Verify the sheet names match exactly (case-sensitive)

### Issue: "Google Sheet not found"
**Solution:**
1. The Apps Script automatically creates missing sheets
2. But ensure you have the correct Google Sheet open when deploying
3. Each Google Sheet has its own Apps Script

### Issue: Duplicate subscriptions not detected
**Solution:**
1. The script checks column B (Email) for duplicates
2. Make sure subscribers go into the `Subscriptions` sheet
3. Check for leading/trailing spaces in emails

---

## Google Sheets Permissions

⚠️ **IMPORTANT:** Your Google Sheet must be accessible to the Apps Script:
1. The sheet you have open when you click "Tools > Script editor" is the one the script uses
2. If you move sheets later, update the Apps Script to point to the new sheet
3. You can share the sheet with others, but only the owner can see form data by default

---

## Advanced: Modify Validation

If you want to change validation rules, edit the Apps Script:

**To require different fields:**
1. Go to **Tools > Script editor**
2. Find the function that handles your form (e.g., `handleRegistration`)
3. Modify the `requiredFields` array

**To add new form fields:**
1. Add the new input to your HTML with a `name` attribute
2. Add it to the Apps Script form handler
3. Add a new column header in your Google Sheet

---

## Support & Documentation

- **Google Apps Script Docs:** https://developers.google.com/apps-script
- **Google Sheets API:** https://developers.google.com/sheets/api
- **Email validation:** The script uses a basic regex pattern

---

## Security Notes

1. ✅ Forms validate on server-side (Apps Script)
2. ✅ No sensitive data is logged unnecessarily
3. ✅ Google Sheets provides automatic backups
4. ⚠️ Consider setting sheet to "View only" for public sharing
5. ⚠️ Don't share your Google Sheet URL publicly

---

## Next Steps

1. ✅ Create Google Sheet
2. ✅ Set up Apps Script
3. ✅ Deploy as Web App
4. ✅ Update `APPS_SCRIPT_URL` in main.js
5. ✅ Test all forms
6. ✅ Monitor submissions in Google Sheet

**You're all set! 🎉**

---

*Last Updated: January 2026*
