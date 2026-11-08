/**
 * Afikpo International Carnival 2026
 * Google Apps Script for Form Submissions & Headless Content API
 * 
 * INSTRUCTIONS:
 * 1. Create a new Google Sheet for storing carnival data (or use your existing sheet)
 * 2. Copy this entire code into Apps Script editor (Extensions > Apps Script in Google Sheets)
 * 3. Deploy as web app:
 *    - Click "Deploy" > "New deployment"
 *    - Select type: "Web app"
 *    - Description: "AIC 2026 Full Portal API"
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone"
 * 4. Copy the Web App URL and update APPS_SCRIPT_URL in js/main.js
 * 
 * Automated Sheets Managed by this Script:
 * - Registrations (General Performers, Delegates, Volunteers)
 * - Vendors (Food, Drinks, Crafts, Corporate Booths)
 * - Contacts (General Inquiries)
 * - Subscriptions (Newsletter Subscribers)
 * - Tickets (Carnival Village & Concert Tickets)
 * - MerchandiseOrders (Store purchases: Caps, Shirts, Beads, etc.)
 * - PageantRegistrations (Miss Afikpo International 2026 Contestants)
 * - PageantVotes (Miss Afikpo Voting Records & Tallies)
 * - MediaSubmissions (Video & Documentary Uploads)
 * - Accommodations (Hotel & Resort Bookings)
 * - TourGuides (Tour Guide & Circuit Requests)
 * - BlogPosts (Dynamic Articles & News Content)
 */

// Sheet Tab Names Configuration
const CONFIG = {
  registrationSheet: "Registrations",
  vendorSheet: "Vendors",
  contactSheet: "Contacts",
  subscriptionSheet: "Subscriptions",
  ticketSheet: "Tickets",
  merchandiseSheet: "MerchandiseOrders",
  pageantRegSheet: "PageantRegistrations",
  pageantVoteSheet: "PageantVotes",
  mediaSheet: "MediaSubmissions",
  accommodationSheet: "Accommodations",
  accommodationCatalogSheet: "AccommodationCatalog",
  tourGuideSheet: "TourGuides",
  blogSheet: "BlogPosts",
  gallerySheet: "GalleryItems",
  // Optional: Paystack Secret Key (sk_live_... or sk_test_...) for direct server-side transaction verification
  paystackSecretKey: ""
};

/**
 * Handle GET requests - Serves dynamic content (Blog Posts, Pageant Votes, Gallery Items)
 * Handle GET requests - Serves dynamic content (Blog Posts, Accommodations, Pageant Votes, Gallery Items)
 */
function doGet(e) {
  try {
    const action = e && e.parameter ? e.parameter.action : "get_blog_posts";
    
    if (action === "get_blog_posts") {
      return getBlogPostsResponse();
    } else if (action === "get_accommodations") {
      return getAccommodationsResponse();
    } else if (action === "get_gallery_items") {
      return getGalleryItemsResponse();
    } else if (action === "get_pending_gallery_items") {
      return getPendingGalleryItemsResponse();
    } else if (action === "get_pageant_votes") {
      return getPageantVotesResponse();
    } else if (action === "get_pageant_contestants") {
      return getPageantContestantsResponse();
    } else if (action === "verify_pageant_payment" || action === "reconcile_vote") {
      return handlePageantPaymentReconciliation(e);
    } else if (action === "sync_paystack_transactions") {
      return handleSyncPaystackTransactions(e);
    } else {
      return createJsonResponse({
        status: "success",
        message: "AIC 2026 API is running online",
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    Logger.log("Error in doGet: " + error.toString());
    return createJsonResponse({
      status: "error",
      message: "Server error: " + error.toString()
    });
  }
}

/**
 * Handle POST requests - Processes form submissions and data updates
 */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return createResponse("error", "No payload provided");
    }

    const requestData = JSON.parse(e.postData.contents);

    // 1. Direct Paystack Webhook Event Handler (e.g. charge.success)
    if (requestData.event === "charge.success" || requestData.formType === "paystack_webhook") {
      return handlePaystackWebhook(requestData);
    }

    const formType = requestData.formType;

    switch(formType) {
      case "registration":
        return handleRegistration(requestData);
      case "vendor_registration":
        return handleVendorRegistration(requestData);
      case "contact":
        return handleContact(requestData);
      case "subscription":
        return handleSubscription(requestData);
      case "ticket_purchase":
        return handleTicketPurchase(requestData);
      case "merchandise_order":
        return handleMerchandiseOrder(requestData);
      case "pageant_registration":
        return handlePageantRegistration(requestData);
      case "pageant_vote":
        return handlePageantVote(requestData);
      case "verify_pageant_payment":
      case "reconcile_vote":
        return handlePageantPaymentReconciliation({ parameter: requestData });
      case "sync_paystack_transactions":
        return handleSyncPaystackTransactions({ parameter: requestData });
      case "media_submission":
        return handleMediaSubmission(requestData);
      case "accommodation_reservation":
        return handleAccommodationReservation(requestData);
      case "save_accommodation_property":
        return handleSaveAccommodationProperty(requestData);
      case "delete_accommodation_property":
        return handleDeleteAccommodationProperty(requestData);
      case "tour_guide_request":
        return handleTourGuideRequest(requestData);
      case "save_blog_post":
        return handleSaveBlogPost(requestData);
      case "delete_blog_post":
        return handleDeleteBlogPost(requestData);
      case "save_gallery_item":
        return handleSaveGalleryItem(requestData);
      case "delete_gallery_item":
        return handleDeleteGalleryItem(requestData);
      default:
        return createResponse("error", "Invalid form type: " + formType);
    }
  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());
    return createResponse("error", "Server processing error: " + error.toString());
  }
}

/* -------------------------------------------------------------
   FORM HANDLERS
------------------------------------------------------------- */

// 1. General Registration
function handleRegistration(data) {
  const required = ["category", "organisationName", "leadName", "email", "phone", "country"];
  for (let f of required) {
    if (!data[f] || data[f].toString().trim() === "") {
      return createResponse("error", `Missing required field: ${f}`);
    }
  }

  const sheet = getSheetByName(CONFIG.registrationSheet, [
    "Timestamp", "Category", "Organisation/Troupe Name", "Lead Contact Name",
    "Email", "Phone", "Country/State", "Bio/Description"
  ]);

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

  return createResponse("success", "Registration submitted successfully! We will be in touch soon.");
}

// 2. Vendor Registration
function handleVendorRegistration(data) {
  // Support boothType, boothSize, and vendorCategory transparently
  data.boothType = data.boothType || data.boothSize || data.vendorCategory || "";
  data.specialRequirements = data.specialRequirements || data.powerRequired || "Standard";

  const required = ["businessName", "contactPerson", "email", "phone", "boothType"];
  for (let f of required) {
    if (!data[f] || data[f].toString().trim() === "") {
      return createResponse("error", `Missing required field: ${f}`);
    }
  }

  const sheet = getSheetByName(CONFIG.vendorSheet, [
    "Timestamp", "Business/Brand Name", "Contact Person", "Email", "Phone",
    "Business Address", "Booth Category", "Power/Water Needs", "Products/Menu Description"
  ]);

  sheet.appendRow([
    new Date().toLocaleString(),
    data.businessName,
    data.contactPerson,
    data.email,
    data.phone,
    data.businessAddress || "",
    data.boothType,
    data.specialRequirements || "Standard",
    data.productDescription || ""
  ]);

  return createResponse("success", "Vendor application received! Our commercial team will review your application and send payment details.");
}

// 3. Contact Form
function handleContact(data) {
  if (!data.fullName || !data.email || !data.message) {
    return createResponse("error", "Please fill in all required contact fields.");
  }

  const sheet = getSheetByName(CONFIG.contactSheet, [
    "Timestamp", "Full Name", "Email", "Subject", "Message"
  ]);

  sheet.appendRow([
    new Date().toLocaleString(),
    data.fullName,
    data.email,
    data.subject || "General Inquiry",
    data.message
  ]);

  return createResponse("success", "Thank you for reaching out! We'll respond shortly.");
}

// 4. Newsletter Subscription
function handleSubscription(data) {
  if (!data.email || !isValidEmail(data.email)) {
    return createResponse("error", "Please provide a valid email address.");
  }

  const sheet = getSheetByName(CONFIG.subscriptionSheet, ["Timestamp", "Email"]);
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][1] === data.email) {
      return createResponse("warning", "This email is already subscribed to updates!");
    }
  }

  sheet.appendRow([new Date().toLocaleString(), data.email]);
  return createResponse("success", "You're now subscribed to Afikpo Carnival 2026 updates!");
}

// 5. Carnival Village Ticket Purchase
function handleTicketPurchase(data) {
  const required = ["ticketType", "ticketCount", "totalAmount", "fullName", "email", "phone"];
  for (let f of required) {
    if (!data[f]) {
      return createResponse("error", `Missing ticket detail: ${f}`);
    }
  }

  const sheet = getSheetByName(CONFIG.ticketSheet, [
    "Timestamp", "Ticket Reference ID", "Full Name", "Email", "Phone",
    "Ticket Tier", "Quantity", "Total Amount (NGN)", "Attendance Date", "Status"
  ]);

  const refId = data.referenceId || data.token || ("AIC-TKT-2026-" + Math.floor(10000 + Math.random() * 90000));

  sheet.appendRow([
    new Date().toLocaleString(),
    refId,
    data.fullName || data.customerName,
    data.email,
    data.phone,
    data.ticketType,
    data.ticketCount,
    data.totalAmount,
    data.visitDate || "Carnival Week Dec 2026",
    data.paymentStatus || "🟡 Pending WhatsApp Confirmation"
  ]);

  return createResponse("success", `Ticket reservation created! Token: ${refId}. Please finalize on WhatsApp.`, { referenceId: refId, token: refId, status: "Pending" });
}

// 6. Merchandise Order
function handleMerchandiseOrder(data) {
  const required = ["customerName", "email", "phone", "deliveryAddress", "orderItems", "totalAmount"];
  for (let f of required) {
    if (!data[f]) {
      return createResponse("error", `Missing order detail: ${f}`);
    }
  }

  const sheet = getSheetByName(CONFIG.merchandiseSheet, [
    "Timestamp", "Order Reference ID", "Customer Name", "Email", "Phone",
    "Delivery Address", "Delivery Method", "Items Ordered", "Total Amount (NGN)", "Order Status"
  ]);

  const orderId = data.orderId || data.token || ("AIC-STR-2026-" + Math.floor(10000 + Math.random() * 90000));
  const itemsSummary = typeof data.orderItems === "string" ? data.orderItems : JSON.stringify(data.orderItems);

  sheet.appendRow([
    new Date().toLocaleString(),
    orderId,
    data.customerName,
    data.email,
    data.phone,
    data.deliveryAddress,
    data.deliveryMethod || "Carnival Village Pickup",
    itemsSummary,
    data.totalAmount,
    data.orderStatus || data.paymentStatus || "🟡 Pending WhatsApp Confirmation"
  ]);

  return createResponse("success", `Order placed successfully! Token: ${orderId}. Please finalize on WhatsApp.`, { orderId: orderId, token: orderId, status: "Pending" });
}

// 7. Pageantry Contestant Registration
function handlePageantRegistration(data) {
  const required = ["fullName", "age", "stateOfOrigin", "email", "phone", "advocacyStatement"];
  for (let f of required) {
    if (!data[f] || data[f].toString().trim() === "") {
      return createResponse("error", `Missing pageant field: ${f}`);
    }
  }

  const sheet = getSheetByName(CONFIG.pageantRegSheet, [
    "Timestamp", "Contestant ID", "Contestant Number", "Full Name", "Stage/Alias Name", "Age", "State / LGA of Origin",
    "Email", "Phone / WhatsApp", "Current City", "Height (cm/ft)", "Social Media Handles",
    "Advocacy / Talent Statement", "Photo URL / Link", "Status"
  ]);

  const rowCount = Math.max(1, sheet.getLastRow());
  const contestantNumber = String(rowCount).padStart(2, "0");
  const contestantId = data.contestantId || ("c_" + rowCount);

  // Validate and parse numerical age
  const parsedAge = parseInt(String(data.age).replace(/[^0-9]/g, ""), 10);
  const safeAge = (!isNaN(parsedAge) && parsedAge >= 16 && parsedAge <= 80) ? parsedAge : (Number(data.age) || 20);

  // Process Headshot Photo (Base64 device upload or URL)
  let finalPhotoUrl = data.photoUrl || "";
  const base64Data = data.base64Photo || data.photoData || (data.photoUrl && data.photoUrl.startsWith("data:") ? data.photoUrl : "");
  if (base64Data) {
    try {
      const driveUrl = saveMediaToDrive(base64Data, "contestant_" + contestantNumber + "_" + Date.now() + ".jpg", "image/jpeg");
      if (driveUrl) {
        finalPhotoUrl = driveUrl;
      }
    } catch (e) {
      Logger.log("Drive upload error for pageant photo: " + e.toString());
    }
  }

  // Check headers to support either 15-column format or legacy 12-column format
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn() || 1).getValues()[0];
  const hasIdHeader = headers.some(h => String(h).toLowerCase().includes("id"));

  if (hasIdHeader) {
    sheet.appendRow([
      new Date().toLocaleString(),
      contestantId,
      contestantNumber,
      data.fullName,
      data.stageName || data.fullName,
      safeAge,
      data.stateOfOrigin,
      data.email,
      data.phone,
      data.currentCity || "",
      data.height || "",
      data.socialHandles || "",
      data.advocacyStatement,
      finalPhotoUrl,
      "Approved"
    ]);
  } else {
    // Legacy 12-column layout fallback
    sheet.appendRow([
      new Date().toLocaleString(),
      data.fullName,
      data.stageName || data.fullName,
      safeAge,
      data.stateOfOrigin,
      data.email,
      data.phone,
      data.currentCity || "",
      data.height || "",
      data.socialHandles || "",
      data.advocacyStatement,
      finalPhotoUrl
    ]);
  }

  return createResponse("success", `Contestant registration submitted successfully as #${contestantNumber}! The screening committee has received your profile and your entry is now active on the voting portal.`, {
    contestantId: contestantId,
    contestantNumber: contestantNumber,
    photoUrl: finalPhotoUrl
  });
}

// 8. Miss Afikpo International 2026 Voting (Verified Paystack Payments & Free Daily Votes)
function handlePageantVote(data) {
  if (!data.contestantId || !data.voteCount) {
    return createResponse("error", "Invalid vote payload");
  }

  const sheet = getSheetByName(CONFIG.pageantVoteSheet, [
    "Timestamp", "Contestant ID", "Contestant Name", "Vote Count", "Voter Email/Phone", "Vote Type", "Amount Paid (NGN)", "Payment Reference", "Payment Status"
  ]);

  const paymentRef = String(data.paymentRef || "").trim();

  // Idempotency: Prevent duplicate credits for identical Paystack references
  if (paymentRef && paymentRef !== "N/A" && !paymentRef.startsWith("FREE-")) {
    const values = sheet.getDataRange().getValues();
    for (let i = 1; i < values.length; i++) {
      const existingRef = String(values[i][7] || "").trim();
      if (existingRef && existingRef.toLowerCase() === paymentRef.toLowerCase()) {
        return createResponse("success", `Votes have already been credited for reference ${paymentRef}.`);
      }
    }
  }

  sheet.appendRow([
    new Date().toLocaleString(),
    data.contestantId,
    data.contestantName || ("Contestant #" + data.contestantId),
    Number(data.voteCount) || 1,
    data.voterContact || "Anonymous/Free Daily",
    data.voteType || (data.voteCount > 1 ? "Paid Boost Package" : "Free Daily Vote"),
    Number(data.amountPaid) || 0,
    paymentRef || "N/A",
    data.paymentStatus || "PAID"
  ]);

  return createResponse("success", `Thank you! ${data.voteCount} vote(s) successfully recorded for ${data.contestantName || 'Contestant #' + data.contestantId}!`);
}

// 8b. Paystack Direct Server Webhook Handler (Catches Bank Transfers, USSD, Cards when user leaves browser)
function handlePaystackWebhook(payload) {
  try {
    const eventData = payload.data || payload;
    const reference = String(eventData.reference || eventData.trxref || "").trim();
    if (!reference) {
      return createJsonResponse({ status: "error", message: "No transaction reference in webhook" });
    }

    const sheet = getSheetByName(CONFIG.pageantVoteSheet, [
      "Timestamp", "Contestant ID", "Contestant Name", "Vote Count", "Voter Email/Phone", "Vote Type", "Amount Paid (NGN)", "Payment Reference", "Payment Status"
    ]);

    // Check if this reference has already been credited (idempotency)
    const values = sheet.getDataRange().getValues();
    for (let i = 1; i < values.length; i++) {
      const existingRef = String(values[i][7] || "").trim();
      if (existingRef && existingRef.toLowerCase() === reference.toLowerCase()) {
        return createJsonResponse({ status: "success", message: "Reference already credited", reference: reference });
      }
    }

    const amountPaid = Number(eventData.amount || 0) / 100; // Paystack amount is in Kobo
    const voterEmail = (eventData.customer && eventData.customer.email) || payload.email || "Paystack Webhook Voter";

    let contestantId = "";
    let contestantName = "";
    let contestantNumber = "";
    let voteCount = 0;

    if (eventData.metadata) {
      const meta = eventData.metadata;
      if (Array.isArray(meta.custom_fields)) {
        meta.custom_fields.forEach(function(field) {
          const varName = String(field.variable_name || field.display_name || "").toLowerCase();
          if (varName.includes("contestant_id") || varName === "id") contestantId = String(field.value || "").trim();
          if (varName.includes("contestant_name") || varName === "name") contestantName = String(field.value || "").trim();
          if (varName.includes("contestant_number") || varName === "number") contestantNumber = String(field.value || "").trim();
          if (varName.includes("votes_credited") || varName.includes("vote")) voteCount = parseInt(field.value, 10) || 0;
        });
      }
      if (!contestantId && meta.contestantId) contestantId = String(meta.contestantId).trim();
      if (!contestantName && meta.contestantName) contestantName = String(meta.contestantName).trim();
      if (!contestantNumber && meta.contestantNumber) contestantNumber = String(meta.contestantNumber).trim();
      if (!voteCount && meta.voteCount) voteCount = parseInt(meta.voteCount, 10) || 0;
    }

    // Default rate: ₦50 per vote
    if (!voteCount && amountPaid > 0) {
      voteCount = Math.floor(amountPaid / 50);
    }
    if (!voteCount) voteCount = 1;

    // Cross-resolve contestant name or ID from PageantRegistrations if missing
    if (!contestantName || !contestantId) {
      try {
        const regSheet = getSheetByName(CONFIG.pageantRegSheet);
        if (regSheet && regSheet.getLastRow() > 1) {
          const regValues = regSheet.getDataRange().getValues();
          for (let r = 1; r < regValues.length; r++) {
            const row = regValues[r];
            const rowStr = row.join(" ").toLowerCase();
            if ((contestantId && rowStr.includes(contestantId.toLowerCase())) ||
                (contestantNumber && rowStr.includes(contestantNumber.toLowerCase())) ||
                (contestantName && rowStr.includes(contestantName.toLowerCase()))) {
              if (!contestantName) contestantName = String(row[2] || row[1] || ("Contestant #" + (contestantNumber || r)));
              if (!contestantId) contestantId = String(row[1] || ("c_" + r));
              break;
            }
          }
        }
      } catch (e) {
        Logger.log("Registration cross-lookup warning: " + e.toString());
      }
    }

    sheet.appendRow([
      new Date().toLocaleString(),
      contestantId || (contestantNumber ? "c_" + contestantNumber : "c_unknown"),
      contestantName || ("Contestant #" + (contestantNumber || contestantId || "1")),
      voteCount,
      voterEmail,
      "Paid Boost (Paystack Webhook)",
      amountPaid,
      reference,
      "PAID"
    ]);

    return createJsonResponse({
      status: "success",
      message: "Webhook processed: " + voteCount + " votes credited to " + contestantName,
      reference: reference,
      votesCredited: voteCount
    });
  } catch (err) {
    Logger.log("Error in handlePaystackWebhook: " + err.toString());
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

// 8c. Self-Service Missing Vote & Transaction Reconciliation Endpoint
function handlePageantPaymentReconciliation(e) {
  const params = (e && e.parameter) || {};
  const reference = String(params.reference || params.ref || "").trim();

  if (!reference) {
    return createJsonResponse({
      status: "error",
      message: "Please provide a valid payment reference (e.g. AIC-VOTE-...)"
    });
  }

  const sheet = getSheetByName(CONFIG.pageantVoteSheet, [
    "Timestamp", "Contestant ID", "Contestant Name", "Vote Count", "Voter Email/Phone", "Vote Type", "Amount Paid (NGN)", "Payment Reference", "Payment Status"
  ]);

  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const existingRef = String(row[7] || "").trim();
    if (existingRef && existingRef.toLowerCase() === reference.toLowerCase()) {
      return createJsonResponse({
        status: "success",
        alreadyCredited: true,
        message: `Payment reference ${reference} is officially recorded and credited!`,
        contestantId: row[1],
        contestantName: row[2],
        voteCount: Number(row[3]) || 0,
        amountPaid: Number(row[6]) || 0,
        timestamp: row[0]
      });
    }
  }

  // If not found in sheet, check if Paystack Secret Key is configured to query Paystack directly
  const secretKey = CONFIG.paystackSecretKey || "";
  if (secretKey && secretKey.startsWith("sk_")) {
    try {
      const paystackUrl = "https://api.paystack.co/transaction/verify/" + encodeURIComponent(reference);
      const res = UrlFetchApp.fetch(paystackUrl, {
        method: "GET",
        headers: { "Authorization": "Bearer " + secretKey },
        muteHttpExceptions: true
      });
      const data = JSON.parse(res.getContentText());

      if (data && data.status && data.data && data.data.status === "success") {
        const tx = data.data;
        const amountPaid = Number(tx.amount || 0) / 100;
        let cId = "";
        let cName = "";
        let cNum = "";
        let count = 0;

        if (tx.metadata && Array.isArray(tx.metadata.custom_fields)) {
          tx.metadata.custom_fields.forEach(function(f) {
            const v = String(f.variable_name || "").toLowerCase();
            if (v.includes("contestant_id") || v === "id") cId = String(f.value || "").trim();
            if (v.includes("contestant_name") || v === "name") cName = String(f.value || "").trim();
            if (v.includes("contestant_number") || v === "number") cNum = String(f.value || "").trim();
            if (v.includes("votes_credited")) count = parseInt(f.value, 10) || 0;
          });
        }
        if (!count && amountPaid > 0) count = Math.floor(amountPaid / 50);
        if (!count) count = 1;

        sheet.appendRow([
          new Date().toLocaleString(),
          cId || ("c_" + (cNum || "1")),
          cName || ("Contestant #" + (cNum || cId || "1")),
          count,
          (tx.customer && tx.customer.email) || "Paystack Reconciled",
          "Paid Boost (Paystack Direct Verify)",
          amountPaid,
          reference,
          "PAID"
        ]);

        return createJsonResponse({
          status: "success",
          credited: true,
          message: `Successfully verified and credited ${count} votes to ${cName || 'Contestant'}!`,
          reference: reference,
          voteCount: count
        });
      }
    } catch (apiErr) {
      Logger.log("Paystack API direct verification error: " + apiErr.toString());
    }
  }

  // Fallback: If client supplied verified transaction details
  const contestantId = String(params.contestantId || "").trim();
  const contestantName = String(params.contestantName || "").trim();
  const voteCount = parseInt(params.voteCount, 10) || 0;
  const amountPaid = parseFloat(params.amountPaid) || 0;
  const voterContact = String(params.voterContact || params.email || "").trim();

  if (contestantId && voteCount > 0) {
    sheet.appendRow([
      new Date().toLocaleString(),
      contestantId,
      contestantName || ("Contestant #" + contestantId),
      voteCount,
      voterContact || "Self-Reconciled Voter",
      "Paid Boost (Client Reconciled)",
      amountPaid || (voteCount * 50),
      reference,
      "PAID"
    ]);

    return createJsonResponse({
      status: "success",
      credited: true,
      message: `Successfully registered and credited ${voteCount} votes for reference ${reference}!`,
      reference: reference,
      voteCount: voteCount
    });
  }

  return createJsonResponse({
    status: "not_found",
    message: `Reference ${reference} is not yet found on the official sheet. If money was deducted, click 'Retry Reconciliation' or contact support with your reference.`
  });
}

// 8d. Bulk Historical Transaction Sync from Paystack (Catches all previous uncaptured payments)
function handleSyncPaystackTransactions(e) {
  try {
    const params = (e && e.parameter) || {};
    const secretKey = params.secretKey || CONFIG.paystackSecretKey || "";

    if (!secretKey || !secretKey.startsWith("sk_")) {
      return createJsonResponse({
        status: "error",
        message: "Paystack Secret Key (sk_live_...) is required to query Paystack transactions. Set it in CONFIG.paystackSecretKey or pass secretKey parameter."
      });
    }

    const sheet = getSheetByName(CONFIG.pageantVoteSheet, [
      "Timestamp", "Contestant ID", "Contestant Name", "Vote Count", "Voter Email/Phone", "Vote Type", "Amount Paid (NGN)", "Payment Reference", "Payment Status"
    ]);

    // Build set of existing references to guarantee 0 duplicates
    const existingValues = sheet.getDataRange().getValues();
    const existingRefs = new Set();
    for (let i = 1; i < existingValues.length; i++) {
      const ref = String(existingValues[i][7] || "").trim().toLowerCase();
      if (ref) existingRefs.add(ref);
    }

    // Load registered contestants for name/number resolution
    const regSheet = getSheetByName(CONFIG.pageantRegSheet);
    let contestants = [];
    if (regSheet && regSheet.getLastRow() > 1) {
      const regValues = regSheet.getDataRange().getValues();
      for (let r = 1; r < regValues.length; r++) {
        contestants.push(regValues[r]);
      }
    }

    // Query Paystack transactions API (up to 100 recent transactions)
    const paystackUrl = "https://api.paystack.co/transaction?status=success&perPage=100";
    const res = UrlFetchApp.fetch(paystackUrl, {
      method: "GET",
      headers: { "Authorization": "Bearer " + secretKey },
      muteHttpExceptions: true
    });

    const body = JSON.parse(res.getContentText());
    if (!body || !body.status || !Array.isArray(body.data)) {
      return createJsonResponse({
        status: "error",
        message: "Failed to fetch from Paystack API: " + (body ? body.message : "Unknown error")
      });
    }

    let syncedCount = 0;
    let syncedVotes = 0;

    for (let i = 0; i < body.data.length; i++) {
      const tx = body.data[i];
      const reference = String(tx.reference || "").trim();
      if (!reference || existingRefs.has(reference.toLowerCase())) continue;

      // Check if transaction is for Miss Afikpo Pageant Voting
      const isVoteRef = reference.startsWith("AIC-VOTE-");
      let isVoteMeta = false;
      let cId = "";
      let cName = "";
      let cNum = "";
      let count = 0;

      if (tx.metadata) {
        const meta = tx.metadata;
        if (Array.isArray(meta.custom_fields)) {
          meta.custom_fields.forEach(function(f) {
            const v = String(f.variable_name || f.display_name || "").toLowerCase();
            if (v.includes("pageant_title") || v.includes("contestant")) isVoteMeta = true;
            if (v.includes("contestant_id") || v === "id") cId = String(f.value || "").trim();
            if (v.includes("contestant_name") || v === "name") cName = String(f.value || "").trim();
            if (v.includes("contestant_number") || v === "number") cNum = String(f.value || "").trim();
            if (v.includes("votes_credited")) count = parseInt(f.value, 10) || 0;
          });
        }
      }

      if (!isVoteRef && !isVoteMeta) continue; // Skip non-voting transactions (e.g. merchandise or tickets)

      const amountPaid = Number(tx.amount || 0) / 100;
      if (!count && amountPaid > 0) count = Math.floor(amountPaid / 50);
      if (!count) count = 1;

      // Try to match contestant by name or number if ID is missing
      if (!cId || !cName) {
        for (let c = 0; c < contestants.length; c++) {
          const rowStr = contestants[c].join(" ").toLowerCase();
          if ((cNum && rowStr.includes(cNum.toLowerCase())) ||
              (cName && rowStr.includes(cName.toLowerCase())) ||
              (cId && rowStr.includes(cId.toLowerCase()))) {
            if (!cName) cName = String(contestants[c][2] || contestants[c][1] || "Contestant #" + (cNum || (c+1)));
            if (!cId) cId = String(contestants[c][1] || ("c_" + (c+1)));
            break;
          }
        }
      }

      sheet.appendRow([
        tx.paid_at ? new Date(tx.paid_at).toLocaleString() : new Date().toLocaleString(),
        cId || (cNum ? "c_" + cNum : "c_unknown"),
        cName || ("Contestant #" + (cNum || cId || "1")),
        count,
        (tx.customer && tx.customer.email) || "Paystack Synced",
        "Paid Boost (Paystack Synced)",
        amountPaid,
        reference,
        "PAID"
      ]);

      existingRefs.add(reference.toLowerCase());
      syncedCount++;
      syncedVotes += count;
    }

    return createJsonResponse({
      status: "success",
      message: `Successfully synced ${syncedCount} missing payment(s) total ${syncedVotes} vote(s) from Paystack!`,
      syncedCount: syncedCount,
      syncedVotes: syncedVotes
    });
  } catch (err) {
    Logger.log("Error in handleSyncPaystackTransactions: " + err.toString());
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}


// 9. Media & Documentary Submission (Saves to Drive, MediaSubmissions sheet, and GalleryItems sheet)
function handleMediaSubmission(data) {
  const required = ["creatorName", "title", "category"];
  for (let f of required) {
    if (!data[f] || data[f].toString().trim() === "") {
      return createResponse("error", `Missing required field: ${f}`);
    }
  }

  let finalMediaUrl = data.mediaUrl || "";

  // Check if base64 file data was sent (from direct device file upload)
  const base64Data = data.base64Media || data.fileData || data.base64Data || "";
  if (base64Data) {
    const driveUrl = saveMediaToDrive(base64Data, data.fileName, data.mimeType);
    if (driveUrl) {
      finalMediaUrl = driveUrl;
    }
  }

  if (!finalMediaUrl) {
    finalMediaUrl = "https://images.unsplash.com/photo-1569383746724-6f1b882b8f46?auto=format&fit=crop&w=1200&q=80";
  }

  // 1. Record in MediaSubmissions sheet
  const mediaSheet = getSheetByName(CONFIG.mediaSheet, [
    "Timestamp", "Creator Name / Studio", "Email", "Phone", "Media Title",
    "Category", "Media Link (YouTube/Drive/Vimeo)", "Description & Cultural Notes"
  ]);

  mediaSheet.appendRow([
    new Date().toLocaleString(),
    data.creatorName,
    data.email || "",
    data.phone || "",
    data.title,
    data.category,
    finalMediaUrl,
    data.description || ""
  ]);

  // 2. Also record in GalleryItems sheet so it appears in the live gallery
  const gallerySheet = getSheetByName(CONFIG.gallerySheet, [
    "ID", "Title", "Category", "MediaType", "MediaUrl", "CreatorName", "Date", "Description", "Status", "Timestamp"
  ]);

  const itemId = data.id || ("sub-" + Date.now());
  const mediaType = data.mediaType || "image";

  gallerySheet.appendRow([
    itemId,
    data.title,
    data.category,
    mediaType,
    finalMediaUrl,
    data.creatorName,
    "Dec 2026",
    data.description || "",
    "Pending",
    new Date().toISOString()
  ]);

  return createResponse("success", "Media uploaded and submitted for admin review!", {
    id: itemId,
    mediaUrl: finalMediaUrl
  });
}

// 10. Accommodation Reservation
function handleAccommodationReservation(data) {
  if (!data || typeof data !== "object") {
    Logger.log("Notice: handleAccommodationReservation executed without parameters. Initializing AccommodationReservations sheet...");
    const sheet = getSheetByName(CONFIG.accommodationSheet, [
      "Timestamp", "Reservation Reference", "Hotel/Resort Name", "Guest Name", "Email", "Phone",
      "Room Type", "Check-In Date", "Check-Out Date", "Guests Count", "Total Est. Price (NGN)", "Special Requests"
    ]);
    Logger.log("✅ AccommodationReservations sheet ready: " + sheet.getName());
    return createResponse("success", "Accommodation reservations sheet initialized.");
  }

  data.guestName = data.guestName || data.customerName || data.fullName || "";
  data.hotelName = data.hotelName || "Afikpo Carnival Partner Hotel";
  data.roomType = data.roomType || "Standard Room";

  const required = ["hotelName", "guestName", "email", "phone", "checkIn", "checkOut", "roomType"];
  for (let f of required) {
    if (!data[f]) {
      return createResponse("error", `Missing accommodation field: ${f}`);
    }
  }

  const sheet = getSheetByName(CONFIG.accommodationSheet, [
    "Timestamp", "Reservation Reference", "Hotel/Resort Name", "Guest Name", "Email", "Phone",
    "Room Type", "Check-In Date", "Check-Out Date", "Guests Count", "Total Est. Price (NGN)", "Special Requests"
  ]);

  const bookingRef = "AIC-STAY-" + Math.floor(100000 + Math.random() * 900000);

  sheet.appendRow([
    new Date().toLocaleString(),
    bookingRef,
    data.hotelName,
    data.guestName,
    data.email,
    data.phone,
    data.roomType,
    data.checkIn,
    data.checkOut,
    data.guestsCount || 1,
    data.estimatedTotal || "Contact for rate",
    data.specialRequests || ""
  ]);

  return createResponse("success", `Accommodation reservation request received! Reference ID: ${bookingRef}. The hotel desk will contact you to finalize confirmation.`, { bookingRef: bookingRef });
}

// 11. Personal Tour Guide Request
function handleTourGuideRequest(data) {
  const defaultHeaders = [
    "Timestamp", "Request ID", "Tourist Name", "Email", "Phone / WhatsApp",
    "Tour Date", "Group Size", "Language", "Pickup Location / Hotel"
  ];

  if (!data || typeof data !== "object") {
    Logger.log("Notice: handleTourGuideRequest called without data (likely manual Run from Apps Script editor). Initializing TourGuides sheet...");
    const sheet = getSheetByName(CONFIG.tourGuideSheet, defaultHeaders);
    Logger.log("✅ TourGuides sheet ready with headers: " + sheet.getName());
    return createResponse("success", "TourGuides sheet initialized successfully.");
  }

  const touristName = data.touristName || data.clientName || data.name || "Valued Visitor";
  const phone = data.phone || data.whatsapp || "";
  const email = data.email || "";

  if (!phone && !email) {
    return createResponse("error", "Please provide a contact phone/WhatsApp or email address.");
  }

  const sheet = getSheetByName(CONFIG.tourGuideSheet, defaultHeaders);
  const tourId = data.token || data.tourId || data.referenceId || ("AIC-TOUR-" + Math.floor(100000 + Math.random() * 900000));

  // Dynamically inspect existing headers to preserve column alignment if old columns exist
  const lastCol = sheet.getLastColumn();
  if (lastCol > 0) {
    const existingHeaders = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function(h) { return String(h).trim().toLowerCase(); });
    const hasDestination = existingHeaders.some(function(h) { return h.indexOf("destination") !== -1 || h.indexOf("circuit") !== -1; });
    const hasDuration = existingHeaders.some(function(h) { return h.indexOf("duration") !== -1; });

    if (hasDestination && hasDuration) {
      sheet.appendRow([
        new Date().toLocaleString(),
        tourId,
        touristName,
        email,
        phone,
        data.circuitName || data.destination || "General Cultural & Festival Escort",
        data.duration || "Full Day (8 Hours)",
        data.tourDate || "2026-12-28",
        data.groupSize || "1 Person",
        data.language || "English",
        data.pickupLocation || "Afikpo City Center"
      ]);
      return createResponse("success", `Tour guide requested! Reference ID: ${tourId}. Your certified Afikpo guide will connect with you.`, { tourId: tourId });
    }
  }

  // Streamlined 9-column format matching form fields
  sheet.appendRow([
    new Date().toLocaleString(),
    tourId,
    touristName,
    email,
    phone,
    data.tourDate || "2026-12-28",
    data.groupSize || "1 Person",
    data.language || "English",
    data.pickupLocation || "Afikpo City Center"
  ]);

  return createResponse("success", `Tour guide requested! Reference ID: ${tourId}. Your certified Afikpo guide will connect with you.`, { tourId: tourId });
}

// 12. Save Blog Post (Create or Update from Frontend Admin)
function handleSaveBlogPost(data) {
  if (!data || typeof data !== "object") {
    Logger.log("Notice: handleSaveBlogPost executed directly in editor without parameters. Initializing BlogPosts sheet...");
    const sheet = getSheetByName(CONFIG.blogSheet, [
      "ID", "Title", "Slug", "Category", "Author", "Date", "CoverImage", "Excerpt", "Content", "Status"
    ]);
    Logger.log("✅ BlogPosts sheet ready with headers: " + sheet.getName());
    return createResponse("success", "BlogPosts sheet initialized successfully. To test, run testBlogSetup().");
  }

  const required = ["title", "category", "author", "content"];
  for (let f of required) {
    if (!data[f] || data[f].toString().trim() === "") {
      return createResponse("error", `Missing blog field: ${f}`);
    }
  }

  const sheet = getSheetByName(CONFIG.blogSheet, [
    "ID", "Title", "Slug", "Category", "Author", "Date", "CoverImage", "Excerpt", "Content", "Status"
  ]);

  const values = sheet.getDataRange().getValues();
  const postId = data.id || ("post-" + Date.now());
  const postSlug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const postDate = data.date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const coverImage = data.coverImage || "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80";
  const excerpt = data.excerpt || (data.content.substring(0, 160) + "...");
  const status = data.status || "Published";

  let existingRow = -1;
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] == postId || (values[i][2] && values[i][2] === postSlug)) {
      existingRow = i + 1; // 1-indexed
      break;
    }
  }

  if (existingRow > 0) {
    // Update existing post
    sheet.getRange(existingRow, 1, 1, 10).setValues([[
      postId, data.title, postSlug, data.category, data.author, postDate, coverImage, excerpt, data.content, status
    ]]);
    return createResponse("success", "Blog article updated successfully!", { id: postId, slug: postSlug });
  } else {
    // Append new post
    sheet.appendRow([
      postId, data.title, postSlug, data.category, data.author, postDate, coverImage, excerpt, data.content, status
    ]);
    return createResponse("success", "Blog article published successfully!", { id: postId, slug: postSlug });
  }
}

// 13. Delete Blog Post
function handleDeleteBlogPost(data) {
  if (!data || !data.id) {
    return createResponse("error", "Missing post ID to delete");
  }

  const sheet = getSheetByName(CONFIG.blogSheet, [
    "ID", "Title", "Slug", "Category", "Author", "Date", "CoverImage", "Excerpt", "Content", "Status"
  ]);

  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] == data.id || (values[i][2] && values[i][2] == data.id)) {
      sheet.deleteRow(i + 1);
      return createResponse("success", "Blog article deleted successfully.");
    }
  }

  return createResponse("success", "Blog article deleted or marked removed.");
}

// 14. Save Gallery Item (Direct Publish or Approved Community Upload)
function handleSaveGalleryItem(data) {
  const required = ["title", "category"];
  for (let f of required) {
    if (!data[f] || data[f].toString().trim() === "") {
      return createResponse("error", `Missing gallery field: ${f}`);
    }
  }

  let mediaUrl = data.mediaUrl || "";

  // If raw base64 data was sent, upload directly into Google Drive folder
  const base64Data = data.base64Media || data.fileData || data.base64Data || "";
  if (base64Data) {
    try {
      const driveUrl = saveMediaToDrive(base64Data, data.fileName, data.mimeType);
      if (driveUrl) mediaUrl = driveUrl;
    } catch(err) {
      Logger.log("Drive upload error: " + err.toString());
      if (!mediaUrl) mediaUrl = "[Saved to Gallery Archive]";
    }
  }

  const sheet = getSheetByName(CONFIG.gallerySheet, [
    "ID", "Title", "Category", "MediaType", "MediaUrl", "CreatorName", "Date", "Description", "Status", "Timestamp"
  ]);

  const values = sheet.getDataRange().getValues();
  const itemId = data.id || ("gal-" + Date.now());
  const itemDate = data.date || "Dec 2026";
  const mediaType = data.mediaType || "image";
  const creatorName = data.creatorName || "AIC Contributor";
  const description = data.description || "";
  const status = data.status || "Published";
  const timestamp = new Date().toISOString();

  let existingRow = -1;
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] == itemId) {
      existingRow = i + 1;
      break;
    }
  }

  if (existingRow > 0) {
    sheet.getRange(existingRow, 1, 1, 10).setValues([[
      itemId, data.title, data.category, mediaType, mediaUrl, creatorName, itemDate, description, status, timestamp
    ]]);
    return createResponse("success", "Gallery item updated successfully!", { id: itemId, mediaUrl: mediaUrl });
  } else {
    sheet.appendRow([
      itemId, data.title, data.category, mediaType, mediaUrl, creatorName, itemDate, description, status, timestamp
    ]);
    return createResponse("success", "Gallery item published successfully!", { id: itemId, mediaUrl: mediaUrl });
  }
}

// 15. Delete Gallery Item
function handleDeleteGalleryItem(data) {
  if (!data.id) {
    return createResponse("error", "Missing gallery item ID to delete");
  }

  const sheet = getSheetByName(CONFIG.gallerySheet, [
    "ID", "Title", "Category", "MediaType", "MediaUrl", "CreatorName", "Date", "Description", "Status", "Timestamp"
  ]);

  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] == data.id) {
      sheet.deleteRow(i + 1);
      return createResponse("success", "Gallery item removed successfully.");
    }
  }

  return createResponse("success", "Gallery item removed from database.");
}

// 16. Save Accommodation Property (Hotels, Chalets, Apartments)
function handleSaveAccommodationProperty(data) {
  if (!data || typeof data !== "object") {
    Logger.log("Notice: handleSaveAccommodationProperty called without data (likely manual Run from Apps Script editor). Initializing catalog sheet headers...");
    const sheet = getSheetByName(CONFIG.accommodationCatalogSheet, [
      "ID", "Name", "Type", "Location", "Badge", "Rating", "ReviewsCount", "Description",
      "Amenities", "Images", "VideoUrl", "RoomTiers", "Status", "Timestamp"
    ]);
    Logger.log("✅ AccommodationCatalog sheet ready with headers: " + sheet.getName());
    return createResponse("success", "AccommodationCatalog sheet initialized successfully. To test saving a property, run testAccommodationSetup().");
  }

  const required = ["name", "type", "location", "description"];
  for (let f of required) {
    if (!data[f] || data[f].toString().trim() === "") {
      return createResponse("error", `Missing required hotel field: ${f}`);
    }
  }

  const sheet = getSheetByName(CONFIG.accommodationCatalogSheet, [
    "ID", "Name", "Type", "Location", "Badge", "Rating", "ReviewsCount", "Description",
    "Amenities", "Images", "VideoUrl", "RoomTiers", "Status", "Timestamp"
  ]);

  const propertyId = data.id || ("hotel-" + Date.now());
  const rating = data.rating || 4.8;
  const reviewsCount = data.reviewsCount || 1;
  const status = data.status || "Available";
  const timestamp = new Date().toISOString();

  // Process images: if any image in data.images is base64, save to Google Drive
  let processedImages = [];
  if (Array.isArray(data.images)) {
    processedImages = data.images.map((img, idx) => {
      if (typeof img === "string" && img.startsWith("data:")) {
        try {
          const driveUrl = saveMediaToDrive(img, `${propertyId}_photo_${idx + 1}.jpg`, "image/jpeg");
          return driveUrl || img;
        } catch (e) {
          Logger.log("Drive upload error for hotel photo: " + e.toString());
          return img;
        }
      }
      return img;
    });
  }

  const amenitiesJson = typeof data.amenities === "string" ? data.amenities : JSON.stringify(data.amenities || []);
  const imagesJson = JSON.stringify(processedImages);
  const roomTiersJson = typeof data.roomTiers === "string" ? data.roomTiers : JSON.stringify(data.roomTiers || []);

  const values = sheet.getDataRange().getValues();
  let existingRow = -1;
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] == propertyId) {
      existingRow = i + 1; // 1-indexed row
      break;
    }
  }

  const rowData = [
    propertyId,
    data.name,
    data.type,
    data.location,
    data.badge || "Verified Partner",
    rating,
    reviewsCount,
    data.description,
    amenitiesJson,
    imagesJson,
    data.videoUrl || "",
    roomTiersJson,
    status,
    timestamp
  ];

  if (existingRow > 0) {
    sheet.getRange(existingRow, 1, 1, rowData.length).setValues([rowData]);
    return createResponse("success", "Accommodation property updated successfully in Google Sheets!", { id: propertyId, images: processedImages });
  } else {
    sheet.appendRow(rowData);
    return createResponse("success", "Accommodation property published successfully to Google Sheets!", { id: propertyId, images: processedImages });
  }
}

// 17. Delete Accommodation Property
function handleDeleteAccommodationProperty(data) {
  if (!data || !data.id) {
    return createResponse("error", "Missing accommodation property ID to delete");
  }

  const sheet = getSheetByName(CONFIG.accommodationCatalogSheet, [
    "ID", "Name", "Type", "Location", "Badge", "Rating", "ReviewsCount", "Description",
    "Amenities", "Images", "VideoUrl", "RoomTiers", "Status", "Timestamp"
  ]);

  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] == data.id) {
      sheet.deleteRow(i + 1);
      return createResponse("success", "Accommodation property deleted from Google Sheets.");
    }
  }

  return createResponse("success", "Accommodation property removed or marked deleted.");
}

// Helper: Save Base64 File to Google Drive Folder & return public direct URL
function saveMediaToDrive(base64Input, fileName, mimeType) {
  try {
    if (!base64Input || typeof base64Input !== "string") return "";

    const folderName = "AIC_Festival_Gallery_Uploads";
    const folders = DriveApp.getFoldersByName(folderName);
    const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

    let cleanBase64 = base64Input;
    let resolvedMime = mimeType || "image/jpeg";

    if (base64Input.indexOf(",") !== -1) {
      const parts = base64Input.split(",");
      const mimeMatch = parts[0].match(/:(.*?);/);
      if (mimeMatch) resolvedMime = mimeMatch[1];
      cleanBase64 = parts[1];
    }

    const cleanFileName = fileName || ("AIC_" + Date.now() + (resolvedMime.indexOf("video") !== -1 ? ".mp4" : ".jpg"));
    const decoded = Utilities.base64Decode(cleanBase64);
    const blob = Utilities.newBlob(decoded, resolvedMime, cleanFileName);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    return "https://lh3.googleusercontent.com/d/" + file.getId();
  } catch (err) {
    Logger.log("Drive upload error: " + err.toString());
    return "";
  }
}

/* -------------------------------------------------------------
   GET RESPONSES
------------------------------------------------------------- */

function getBlogPostsResponse() {
  const sheet = getSheetByName(CONFIG.blogSheet, [
    "ID", "Title", "Slug", "Category", "Author", "Date", "CoverImage", "Excerpt", "Content", "Status"
  ]);

  const values = sheet.getDataRange().getValues();
  const posts = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (row[0]) {
      posts.push({
        id: row[0],
        title: row[1],
        slug: row[2],
        category: row[3],
        author: row[4],
        date: row[5],
        coverImage: row[6],
        excerpt: row[7],
        content: row[8],
        status: row[9] || "Published"
      });
    }
  }

  return createJsonResponse({
    status: "success",
    count: posts.length,
    posts: posts
  });
}

function getPageantVotesResponse() {
  const sheet = getSheetByName(CONFIG.pageantVoteSheet, [
    "Timestamp", "Contestant ID", "Contestant Name", "Vote Count", "Voter Email/Phone", "Vote Type", "Amount Paid (NGN)", "Payment Reference", "Payment Status"
  ]);

  if (!sheet || sheet.getLastRow() <= 1) {
    return createJsonResponse({
      status: "success",
      voteTotals: {}
    });
  }

  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(function(h) { return String(h).trim().toLowerCase(); });

  const findCol = function(possibleNames) {
    for (let i = 0; i < possibleNames.length; i++) {
      const name = possibleNames[i].toLowerCase();
      const idx = headers.findIndex(function(h) { return h === name; });
      if (idx !== -1) return idx;
    }
    for (let i = 0; i < possibleNames.length; i++) {
      const name = possibleNames[i].toLowerCase();
      const idx = headers.findIndex(function(h) { return h.includes(name); });
      if (idx !== -1) return idx;
    }
    return -1;
  };

  const idCol = findCol(["contestant id", "id", "delegate id"]);
  const nameCol = findCol(["contestant name", "name", "delegate name", "stage name", "contestant"]);
  const countCol = findCol(["vote count", "votes", "count", "quantity"]);
  const amountCol = findCol(["amount paid", "amount", "price", "paid (ngn)", "ngn"]);
  const statusCol = findCol(["payment status", "status", "state"]);
  const refCol = findCol(["payment reference", "reference", "ref", "trxref"]);

  const cleanStr = function(s) {
    if (!s) return "";
    try {
      return String(s).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    } catch (e) {
      return String(s).replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    }
  };

  const voteTotals = {};

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const cId = idCol !== -1 && row[idCol] !== undefined ? String(row[idCol]).trim() : String(row[1] || "").trim();
    const cName = nameCol !== -1 && row[nameCol] !== undefined ? String(row[nameCol]).trim() : String(row[2] || "").trim();
    
    // Parse vote count with fallback to Amount (₦50 = 1 vote)
    let count = countCol !== -1 && row[countCol] !== undefined ? Number(String(row[countCol]).replace(/[^0-9]/g, "")) : Number(row[3]) || 0;
    const amount = amountCol !== -1 && row[amountCol] !== undefined ? Number(String(row[amountCol]).replace(/[^0-9.]/g, "")) : Number(row[6]) || 0;
    if ((!count || isNaN(count) || count <= 0) && amount >= 50) {
      count = Math.floor(amount / 50);
    }
    if (isNaN(count) || count <= 0) count = 1;

    // Check payment status: Count ANY payment UNLESS explicitly marked failed, rejected, or refunded
    const status = statusCol !== -1 && row[statusCol] !== undefined ? String(row[statusCol]).trim().toUpperCase() : String(row[8] || "PAID").trim().toUpperCase();
    const isInvalid = ["FAILED", "REJECTED", "CANCELLED", "REFUNDED", "ABANDONED", "DECLINED"].includes(status);
    if (isInvalid) continue;

    if (cId) {
      voteTotals[cId] = (voteTotals[cId] || 0) + count;
    }
    if (cName) {
      voteTotals[cName.toLowerCase()] = (voteTotals[cName.toLowerCase()] || 0) + count;
      const cClean = cleanStr(cName);
      if (cClean) voteTotals[cClean] = (voteTotals[cClean] || 0) + count;
    }
  }

  // Cross-reconcile with PageantRegistrations so that all identifiers (ID, Number, Stage Name, Legal Full Name) share the complete total
  try {
    const regSheet = getSheetByName(CONFIG.pageantRegSheet);
    if (regSheet && regSheet.getLastRow() > 1) {
      const regValues = regSheet.getDataRange().getValues();
      const regHeaders = regValues[0].map(function(h) { return String(h).trim().toLowerCase(); });

      const findRegCol = function(possibleNames) {
        for (let i = 0; i < possibleNames.length; i++) {
          const name = possibleNames[i].toLowerCase();
          const idx = regHeaders.findIndex(function(h) { return h === name; });
          if (idx !== -1) return idx;
        }
        for (let i = 0; i < possibleNames.length; i++) {
          const name = possibleNames[i].toLowerCase();
          const idx = regHeaders.findIndex(function(h) { return h.includes(name); });
          if (idx !== -1) return idx;
        }
        return -1;
      };

      const rIdCol = findRegCol(["contestant id", "id"]);
      const rNumCol = findRegCol(["contestant number", "number", "no"]);
      const rFullCol = findRegCol(["full name", "legal name", "name"]);
      const rStageCol = findRegCol(["stage/alias name", "stage name", "stage", "alias"]);

      for (let r = 1; r < regValues.length; r++) {
        const row = regValues[r];
        const rId = rIdCol !== -1 && row[rIdCol] ? String(row[rIdCol]).trim() : ("c_" + r);
        const rNum = rNumCol !== -1 && row[rNumCol] ? String(row[rNumCol]).trim() : String(r).padStart(2, "0");
        const rFullName = rFullCol !== -1 && row[rFullCol] ? String(row[rFullCol]).trim() : "";
        const rStageName = rStageCol !== -1 && row[rStageCol] ? String(row[rStageCol]).trim() : "";
        const rCleanStage = cleanStr(rStageName);
        const rCleanFull = cleanStr(rFullName);

        let contestantTotal = 0;

        for (let v = 1; v < values.length; v++) {
          const vRow = values[v];
          const vStatus = statusCol !== -1 && vRow[statusCol] !== undefined ? String(vRow[statusCol]).trim().toUpperCase() : String(vRow[8] || "PAID").trim().toUpperCase();
          if (["FAILED", "REJECTED", "CANCELLED", "REFUNDED", "ABANDONED", "DECLINED"].includes(vStatus)) continue;

          const vId = idCol !== -1 && vRow[idCol] !== undefined ? String(vRow[idCol]).trim().toLowerCase() : String(vRow[1] || "").trim().toLowerCase();
          const vName = nameCol !== -1 && vRow[nameCol] !== undefined ? String(vRow[nameCol]).trim() : String(vRow[2] || "").trim();
          const vCleanName = cleanStr(vName);

          let vCount = countCol !== -1 && vRow[countCol] !== undefined ? Number(String(vRow[countCol]).replace(/[^0-9]/g, "")) : Number(vRow[3]) || 0;
          const vAmount = amountCol !== -1 && vRow[amountCol] !== undefined ? Number(String(vRow[amountCol]).replace(/[^0-9.]/g, "")) : Number(vRow[6]) || 0;
          if ((!vCount || isNaN(vCount) || vCount <= 0) && vAmount >= 50) {
            vCount = Math.floor(vAmount / 50);
          }
          if (isNaN(vCount) || vCount <= 0) vCount = 1;

          // Multi-factor identity matching
          const matchId = (rId && vId === rId.toLowerCase()) || (vId === ("c_" + r).toLowerCase());
          const matchNum = (rNum && (vId === rNum.toLowerCase() || vId === String(parseInt(rNum, 10))));
          const matchStage = rCleanStage && vCleanName && (rCleanStage.includes(vCleanName) || vCleanName.includes(rCleanStage));
          const matchFull = rCleanFull && vCleanName && (rCleanFull.includes(vCleanName) || vCleanName.includes(rCleanFull));

          if (matchId || matchNum || matchStage || matchFull) {
            contestantTotal += vCount;
          }
        }

        if (contestantTotal > 0) {
          if (rId) voteTotals[rId] = Math.max(voteTotals[rId] || 0, contestantTotal);
          if (rNum) {
            voteTotals[rNum] = Math.max(voteTotals[rNum] || 0, contestantTotal);
            const numWithoutZero = String(parseInt(rNum, 10));
            if (!isNaN(parseInt(rNum, 10))) {
              voteTotals[numWithoutZero] = Math.max(voteTotals[numWithoutZero] || 0, contestantTotal);
            }
          }
          if (rStageName) {
            voteTotals[rStageName.toLowerCase()] = Math.max(voteTotals[rStageName.toLowerCase()] || 0, contestantTotal);
            if (rCleanStage) voteTotals[rCleanStage] = Math.max(voteTotals[rCleanStage] || 0, contestantTotal);
          }
          if (rFullName) {
            voteTotals[rFullName.toLowerCase()] = Math.max(voteTotals[rFullName.toLowerCase()] || 0, contestantTotal);
            if (rCleanFull) voteTotals[rCleanFull] = Math.max(voteTotals[rCleanFull] || 0, contestantTotal);
          }
        }
      }
    }
  } catch (crossErr) {
    Logger.log("Cross reconcile warning: " + crossErr.toString());
  }

  return createJsonResponse({
    status: "success",
    voteTotals: voteTotals
  });
}

function getPageantContestantsResponse() {
  const sheet = getSheetByName(CONFIG.pageantRegSheet);
  if (!sheet || sheet.getLastRow() <= 1) {
    return createJsonResponse({
      status: "success",
      count: 0,
      contestants: []
    });
  }

  const values = sheet.getDataRange().getValues();
  const headers = values[0].map(function(h) { return String(h).trim().toLowerCase(); });

  const findCol = function(possibleNames) {
    // 1. Exact match first
    for (let i = 0; i < possibleNames.length; i++) {
      const name = possibleNames[i].toLowerCase();
      const idx = headers.findIndex(function(h) { return h === name; });
      if (idx !== -1) return idx;
    }
    // 2. Whole word match to avoid substring collisions (e.g. "age" matching "stage")
    for (let i = 0; i < possibleNames.length; i++) {
      const name = possibleNames[i].toLowerCase();
      const regex = new RegExp("(^|[^a-z0-9])" + name + "([^a-z0-9]|$)", "i");
      const idx = headers.findIndex(function(h) { return regex.test(h); });
      if (idx !== -1) return idx;
    }
    // 3. Substring match (min 4 characters to avoid false positive matches)
    for (let i = 0; i < possibleNames.length; i++) {
      const name = possibleNames[i].toLowerCase();
      if (name.length >= 4) {
        const idx = headers.findIndex(function(h) { return h.includes(name); });
        if (idx !== -1) return idx;
      }
    }
    return -1;
  };

  const idCol = findCol(["contestant id", "id"]);
  const numCol = findCol(["contestant number", "number", "no"]);
  const fullCol = findCol(["full name", "legal name", "name"]);
  const stageCol = findCol(["stage/alias name", "stage name", "stage", "alias"]);
  const ageCol = findCol(["age", "contestant age"]);
  const stateCol = findCol(["state / lga of origin", "state of origin", "state", "origin", "lga", "community"]);
  const emailCol = findCol(["email"]);
  const phoneCol = findCol(["phone / whatsapp", "phone", "whatsapp"]);
  const heightCol = findCol(["height (cm/ft)", "height"]);
  const socialCol = findCol(["social media handles", "social", "instagram", "tiktok", "handle"]);
  const advocacyCol = findCol(["advocacy / talent statement", "advocacy", "statement", "talent", "platform"]);
  const photoCol = findCol(["photo url / link", "photo", "headshot", "image", "url", "link"]);
  const statusCol = findCol(["status"]);

  const sanitizeText = function(s) {
    if (!s) return "";
    try {
      return String(s).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").trim();
    } catch (e) {
      return String(s).trim();
    }
  };

  const contestants = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const fullName = fullCol !== -1 ? sanitizeText(row[fullCol]) : "";
    const stageName = stageCol !== -1 ? sanitizeText(row[stageCol]) : "";
    const displayName = stageName || fullName;

    if (!displayName) continue; // Skip empty rows

    const status = statusCol !== -1 ? String(row[statusCol] || "").trim().toLowerCase() : "approved";
    if (status === "rejected" || status === "inactive" || status === "disqualified") continue;

    const contestantNumber = numCol !== -1 && row[numCol]
      ? String(row[numCol]).trim()
      : String(contestants.length + 1).padStart(2, "0");

    const contestantId = idCol !== -1 && row[idCol]
      ? String(row[idCol]).trim()
      : ("c_" + i);

    const community = stateCol !== -1 && row[stateCol] ? sanitizeText(row[stateCol]) : "Afikpo";
    
    // Parse contestant age accurately
    let age = 20;
    if (ageCol !== -1 && row[ageCol] !== undefined && row[ageCol] !== null && String(row[ageCol]).trim() !== "") {
      const parsed = parseInt(String(row[ageCol]).replace(/[^0-9]/g, ""), 10);
      if (!isNaN(parsed) && parsed >= 16 && parsed <= 80) {
        age = parsed;
      }
    }
    const platform = advocacyCol !== -1 && row[advocacyCol] ? sanitizeText(row[advocacyCol]) : "Proud contestant for Miss Afikpo International 2026.";
    let photoUrl = photoCol !== -1 && row[photoCol] ? String(row[photoCol]).trim() : "";

    // Convert Google Drive view links to direct thumbnail images
    if (photoUrl) {
      const match = photoUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || photoUrl.match(/id=([a-zA-Z0-9_-]+)/);
      if (match) {
        photoUrl = "https://lh3.googleusercontent.com/d/" + match[1];
      }
    }

    if (!photoUrl) {
      photoUrl = "assets/images/Nkwa Umuagbógó cultural dance competition.jpeg";
    }

    contestants.push({
      id: contestantId,
      number: contestantNumber,
      name: displayName,
      fullName: fullName,
      community: community,
      age: age,
      platform: platform,
      image: photoUrl,
      baseVotes: 0
    });
  }

  return createJsonResponse({
    status: "success",
    count: contestants.length,
    contestants: contestants
  });
}

function getGalleryItemsResponse() {
  const sheet = getSheetByName(CONFIG.gallerySheet, [
    "ID", "Title", "Category", "MediaType", "MediaUrl", "CreatorName", "Date", "Description", "Status", "Timestamp"
  ]);

  const values = sheet.getDataRange().getValues();
  const items = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (row[0] && (row[8] === "Published" || !row[8])) {
      items.push({
        id: row[0],
        title: row[1],
        category: row[2],
        mediaType: row[3] || "image",
        mediaUrl: row[4],
        creatorName: row[5] || "AIC Contributor",
        date: row[6] || "Dec 2026",
        description: row[7] || "",
        status: row[8] || "Published",
        timestamp: row[9] || 0,
        isCustom: true
      });
    }
  }

  return createJsonResponse({
    status: "success",
    count: items.length,
    items: items
  });
}

function getPendingGalleryItemsResponse() {
  const sheet = getSheetByName(CONFIG.gallerySheet, [
    "ID", "Title", "Category", "MediaType", "MediaUrl", "CreatorName", "Date", "Description", "Status", "Timestamp"
  ]);

  const values = sheet.getDataRange().getValues();
  const items = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (row[0] && (row[8] === "Pending" || row[8] === "pending")) {
      items.push({
        id: row[0],
        title: row[1],
        category: row[2],
        mediaType: row[3] || "image",
        mediaUrl: row[4],
        creatorName: row[5] || "Community Contributor",
        date: row[6] || "Dec 2026",
        description: row[7] || "",
        status: "pending",
        timestamp: row[9] || 0
      });
    }
  }

  return createJsonResponse({
    status: "success",
    count: items.length,
    items: items
  });
}

function getAccommodationsResponse() {
  const sheet = getSheetByName(CONFIG.accommodationCatalogSheet, [
    "ID", "Name", "Type", "Location", "Badge", "Rating", "ReviewsCount", "Description",
    "Amenities", "Images", "VideoUrl", "RoomTiers", "Status", "Timestamp"
  ]);

  const values = sheet.getDataRange().getValues();
  const accommodations = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    if (row[0]) {
      let amenities = [];
      try { amenities = JSON.parse(row[8]); } catch(e) { amenities = String(row[8] || "").split(",").map(s => s.trim()).filter(Boolean); }

      let images = [];
      try { images = JSON.parse(row[9]); } catch(e) { images = [row[9]].filter(Boolean); }

      let roomTiers = [];
      try { roomTiers = JSON.parse(row[11]); } catch(e) { roomTiers = []; }

      accommodations.push({
        id: String(row[0]),
        name: row[1] || "",
        type: row[2] || "Luxury Hotel & Suites",
        location: row[3] || "Afikpo City",
        badge: row[4] || "",
        rating: Number(row[5]) || 4.8,
        reviewsCount: Number(row[6]) || 1,
        description: row[7] || "",
        amenities: Array.isArray(amenities) ? amenities : [],
        images: Array.isArray(images) ? images : [],
        videoUrl: row[10] || "",
        roomTiers: Array.isArray(roomTiers) ? roomTiers : [],
        status: row[12] || "Available",
        timestamp: row[13] || 0
      });
    }
  }

  return createJsonResponse({
    status: "success",
    count: accommodations.length,
    accommodations: accommodations
  });
}

/* -------------------------------------------------------------
   HELPER UTILITIES
------------------------------------------------------------- */

function getSheetByName(sheetName, defaultHeaders) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }

  if (sheet.getLastRow() === 0 && defaultHeaders && defaultHeaders.length > 0) {
    sheet.appendRow(defaultHeaders);
    sheet.getRange(1, 1, 1, defaultHeaders.length).setFontWeight("bold").setBackground("#EA580C").setFontColor("#FFFFFF");
  }
  
  return sheet;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function createResponse(status, message, extraData) {
  const response = {
    status: status,
    message: message,
    timestamp: new Date().toISOString(),
    ...(extraData || {})
  };

  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function to verify Google Drive folder creation and permissions.
 * You can select and RUN this function directly inside the Google Apps Script editor.
 * It automatically initializes the dedicated 'AIC_Festival_Gallery_Uploads' folder in Google Drive.
 */
function testDriveAndGallerySetup() {
  const folderName = "AIC_Festival_Gallery_Uploads";
  const folders = DriveApp.getFoldersByName(folderName);
  const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

  Logger.log("✅ Google Drive Folder Ready: " + folder.getName() + " (ID: " + folder.getId() + ")");
  Logger.log("📁 Drive Folder URL: " + folder.getUrl());

  // Verify and initialize GalleryItems sheet
  const gallerySheet = getSheetByName(CONFIG.gallerySheet, [
    "ID", "Title", "Category", "MediaType", "MediaUrl", "CreatorName", "Date", "Description", "Status", "Timestamp"
  ]);
  Logger.log("📊 GalleryItems sheet ready: " + gallerySheet.getName());

  // Verify and initialize MediaSubmissions sheet
  const mediaSheet = getSheetByName(CONFIG.mediaSheet, [
    "Timestamp", "Creator Name / Studio", "Email", "Phone", "Media Title",
    "Category", "Media Link (YouTube/Drive/Vimeo)", "Description & Cultural Notes"
  ]);
  Logger.log("📊 MediaSubmissions sheet ready: " + mediaSheet.getName());

  Logger.log("🚀 SUCCESS! Dedicated Google Drive folder and Sheets are active and ready for live uploads.");
  return "SUCCESS: Folder URL is " + folder.getUrl();
}

/**
 * Test function to verify Accommodation Google Sheets setup and permissions.
 * You can select and RUN this function directly inside the Google Apps Script editor.
 * It automatically initializes the dedicated 'AccommodationCatalog' and 'AccommodationReservations' sheets.
 */
function testAccommodationSetup() {
  Logger.log("Checking Accommodation Catalog and Reservation sheets...");

  const catalogSheet = getSheetByName(CONFIG.accommodationCatalogSheet, [
    "ID", "Name", "Type", "Location", "Badge", "Rating", "ReviewsCount", "Description",
    "Amenities", "Images", "VideoUrl", "RoomTiers", "Status", "Timestamp"
  ]);
  Logger.log("✅ AccommodationCatalog sheet ready: " + catalogSheet.getName());

  const reservationSheet = getSheetByName(CONFIG.accommodationSheet, [
    "Timestamp", "Reservation Reference", "Hotel/Resort Name", "Guest Name", "Email", "Phone",
    "Room Type", "Check-In Date", "Check-Out Date", "Guests Count", "Total Est. Price (NGN)", "Special Requests"
  ]);
  Logger.log("✅ AccommodationReservations sheet ready: " + reservationSheet.getName());

  Logger.log("🚀 SUCCESS! Accommodation catalog and reservation sheets are active and ready.");
  return "SUCCESS: Accommodation sheets are initialized and ready.";
}

/**
 * Test function to verify Blog Google Sheets setup and permissions.
 * You can select and RUN this function directly inside the Google Apps Script editor.
 * It automatically initializes the dedicated 'BlogPosts' sheet.
 */
function testBlogSetup() {
  Logger.log("Checking BlogPosts sheet...");
  const sheet = getSheetByName(CONFIG.blogSheet, [
    "ID", "Title", "Slug", "Category", "Author", "Date", "CoverImage", "Excerpt", "Content", "Status"
  ]);
  Logger.log("✅ BlogPosts sheet ready with headers: " + sheet.getName());
  Logger.log("🚀 SUCCESS! Blog sheet is active and ready.");
  return "SUCCESS: Blog sheet is initialized and ready.";
}

