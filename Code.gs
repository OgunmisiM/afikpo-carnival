/**
 * Afikpo International Carnival 2026
 * Google Apps Script for Form Submissions
 * 
 * INSTRUCTIONS:
 * 1. Create a new Google Sheet for storing form data
 * 2. Create three sheets: "Registrations", "Contacts", "Subscriptions"
 * 3. Copy this code into Apps Script editor (Tools > Script editor in Google Sheet)
 * 4. Deploy as web app (Deploy > New deployment > Type: Web app)
 * 5. Set "Execute as" to your account
 * 6. Set "Who has access" to "Anyone"
 * 7. Copy the deployment URL and replace APPS_SCRIPT_URL in your HTML forms
 */

// Configuration
const CONFIG = {
  registrationSheet: "Registrations",
  contactSheet: "Contacts",
  subscriptionSheet: "Subscriptions"
};

/**
 * Main handler for form submissions
 * Processes POST requests from forms
 */
function doPost(e) {
  try {
    const requestData = JSON.parse(e.postData.contents);
    const formType = requestData.formType;

    let result;

    switch(formType) {
      case "registration":
        result = handleRegistration(requestData);
        break;
      case "contact":
        result = handleContact(requestData);
        break;
      case "subscription":
        result = handleSubscription(requestData);
        break;
      default:
        return createResponse("error", "Invalid form type");
    }

    return result;
  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());
    return createResponse("error", "Server error: " + error.toString());
  }
}

/**
 * Handle registration form submission
 */
function handleRegistration(data) {
  try {
    // Validate required fields
    const requiredFields = ["category", "organisationName", "leadName", "email", "phone", "country", "terms"];
    for (let field of requiredFields) {
      if (!data[field] || data[field].toString().trim() === "") {
        return createResponse("error", `Missing required field: ${field}`);
      }
    }

    // Validate email format
    if (!isValidEmail(data.email)) {
      return createResponse("error", "Invalid email address");
    }

    // Validate terms checkbox
    if (data.terms !== true && data.terms !== "true") {
      return createResponse("error", "You must agree to the terms and conditions");
    }

    // Get the sheet and append data
    const sheet = getSheetByName(CONFIG.registrationSheet);
    
    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Category",
        "Organisation/Troupe Name",
        "Lead Contact Name",
        "Email",
        "Phone",
        "Country/State",
        "Bio/Description"
      ]);
    }

    // Append registration data
    sheet.appendRow([
      new Date().toLocaleString(),
      data.category,
      data.organisationName,
      data.leadName,
      data.email,
      data.phone,
      data.country,
      data.bio || ""
    ]);

    Logger.log("Registration saved: " + data.email);
    return createResponse("success", "Registration submitted successfully! We'll be in touch soon.");

  } catch (error) {
    Logger.log("Registration error: " + error.toString());
    return createResponse("error", "Failed to process registration: " + error.toString());
  }
}

/**
 * Handle contact form submission
 */
function handleContact(data) {
  try {
    // Validate required fields
    const requiredFields = ["fullName", "email", "message"];
    for (let field of requiredFields) {
      if (!data[field] || data[field].toString().trim() === "") {
        return createResponse("error", `Missing required field: ${field}`);
      }
    }

    // Validate email format
    if (!isValidEmail(data.email)) {
      return createResponse("error", "Invalid email address");
    }

    // Get the sheet and append data
    const sheet = getSheetByName(CONFIG.contactSheet);
    
    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Email",
        "Subject",
        "Message"
      ]);
    }

    // Append contact data
    sheet.appendRow([
      new Date().toLocaleString(),
      data.fullName,
      data.email,
      data.subject || "",
      data.message
    ]);

    Logger.log("Contact message saved: " + data.email);
    return createResponse("success", "Thank you for reaching out! We'll respond shortly.");

  } catch (error) {
    Logger.log("Contact error: " + error.toString());
    return createResponse("error", "Failed to process contact form: " + error.toString());
  }
}

/**
 * Handle subscription form submission
 */
function handleSubscription(data) {
  try {
    // Validate email
    if (!data.email || data.email.toString().trim() === "") {
      return createResponse("error", "Email address is required");
    }

    if (!isValidEmail(data.email)) {
      return createResponse("error", "Invalid email address");
    }

    // Get the sheet and append data
    const sheet = getSheetByName(CONFIG.subscriptionSheet);
    
    // Add headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Email"
      ]);
    }

    // Check if email already exists
    const range = sheet.getDataRange();
    const values = range.getValues();
    for (let i = 1; i < values.length; i++) {
      if (values[i][1] === data.email) {
        return createResponse("warning", "This email is already subscribed");
      }
    }

    // Append subscription data
    sheet.appendRow([
      new Date().toLocaleString(),
      data.email
    ]);

    Logger.log("Subscription saved: " + data.email);
    return createResponse("success", "Successfully subscribed to our newsletter!");

  } catch (error) {
    Logger.log("Subscription error: " + error.toString());
    return createResponse("error", "Failed to process subscription: " + error.toString());
  }
}

/**
 * Get sheet by name, create if doesn't exist
 */
function getSheetByName(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  
  return sheet;
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  // More robust email validation pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // Basic validation - just check for @ and at least one dot
  const hasAtSign = email.includes('@');
  const parts = email.split('@');
  if (parts.length !== 2) return false;
  const [localPart, domain] = parts;
  if (!localPart || !domain) return false;
  if (!domain.includes('.')) return false;
  return true;
}

/**
 * Create standardized response object
 */
function createResponse(status, message) {
  const response = {
    status: status,
    message: message,
    timestamp: new Date().toISOString()
  };

  // Return as JSON with correct headers
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function - run this to verify the script works
 * Go to Run > Run function > testDoPost
 */
function testDoPost() {
  const testData = {
    formType: "subscription",
    email: "test@example.com"
  };

  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };

  const response = doPost(mockEvent);
  Logger.log(response);
}
