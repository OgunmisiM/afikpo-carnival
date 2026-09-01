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
 * - PageantRegistrations (Queen of Afikpo Contestants)
 * - PageantVotes (Queen Voting Records & Tallies)
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
  tourGuideSheet: "TourGuides",
  blogSheet: "BlogPosts"
};

/**
 * Handle GET requests - Serves dynamic content (Blog Posts, Pageant Votes, etc.)
 */
function doGet(e) {
  try {
    const action = e && e.parameter ? e.parameter.action : "get_blog_posts";
    
    if (action === "get_blog_posts") {
      return getBlogPostsResponse();
    } else if (action === "get_pageant_votes") {
      return getPageantVotesResponse();
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
      case "media_submission":
        return handleMediaSubmission(requestData);
      case "accommodation_reservation":
        return handleAccommodationReservation(requestData);
      case "tour_guide_request":
        return handleTourGuideRequest(requestData);
      case "save_blog_post":
        return handleSaveBlogPost(requestData);
      case "delete_blog_post":
        return handleDeleteBlogPost(requestData);
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

  const refId = data.referenceId || ("AIC-TKT-" + Math.floor(100000 + Math.random() * 900000));

  sheet.appendRow([
    new Date().toLocaleString(),
    refId,
    data.fullName,
    data.email,
    data.phone,
    data.ticketType,
    data.ticketCount,
    data.totalAmount,
    data.visitDate || "Carnival Week Dec 2026",
    data.paymentStatus || "Confirmed / Reserved"
  ]);

  return createResponse("success", `Ticket purchase reserved successfully! Your Reference ID is ${refId}. Check your email for details.`, { referenceId: refId });
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

  const orderId = data.orderId || ("AIC-SHOP-" + Math.floor(100000 + Math.random() * 900000));
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
    "Pending Dispatch"
  ]);

  return createResponse("success", `Order placed successfully! Reference ID: ${orderId}. Our store team will contact you for fulfillment.`, { orderId: orderId });
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
    "Timestamp", "Full Name", "Stage/Alias Name", "Age", "State / LGA of Origin",
    "Email", "Phone / WhatsApp", "Current City", "Height (cm/ft)", "Social Media Handles",
    "Advocacy / Talent Statement", "Photo URL / Link"
  ]);

  sheet.appendRow([
    new Date().toLocaleString(),
    data.fullName,
    data.stageName || data.fullName,
    data.age,
    data.stateOfOrigin,
    data.email,
    data.phone,
    data.currentCity || "",
    data.height || "",
    data.socialHandles || "",
    data.advocacyStatement,
    data.photoUrl || ""
  ]);

  return createResponse("success", "Pageant registration submitted! The screening committee will review your profile and send audition guidelines.");
}

// 8. Queen Voting
function handlePageantVote(data) {
  if (!data.contestantId || !data.voteCount) {
    return createResponse("error", "Invalid vote payload");
  }

  const sheet = getSheetByName(CONFIG.pageantVoteSheet, [
    "Timestamp", "Contestant ID", "Contestant Name", "Vote Count", "Voter Email/Phone", "Vote Type", "Amount Paid (NGN)"
  ]);

  sheet.appendRow([
    new Date().toLocaleString(),
    data.contestantId,
    data.contestantName || ("Contestant #" + data.contestantId),
    data.voteCount,
    data.voterContact || "Anonymous/Free Daily",
    data.voteType || (data.voteCount > 1 ? "Bundle Vote" : "Free Daily Vote"),
    data.amountPaid || 0
  ]);

  return createResponse("success", `Thank you! ${data.voteCount} vote(s) successfully cast for ${data.contestantName || 'Contestant #' + data.contestantId}!`);
}

// 9. Media & Documentary Submission
function handleMediaSubmission(data) {
  const required = ["creatorName", "email", "title", "category", "mediaUrl"];
  for (let f of required) {
    if (!data[f] || data[f].toString().trim() === "") {
      return createResponse("error", `Missing required field: ${f}`);
    }
  }

  const sheet = getSheetByName(CONFIG.mediaSheet, [
    "Timestamp", "Creator Name / Studio", "Email", "Phone", "Media Title",
    "Category", "Media Link (YouTube/Drive/Vimeo)", "Description & Cultural Notes"
  ]);

  sheet.appendRow([
    new Date().toLocaleString(),
    data.creatorName,
    data.email,
    data.phone || "",
    data.title,
    data.category,
    data.mediaUrl,
    data.description || ""
  ]);

  return createResponse("success", "Video/Documentary submitted successfully! Our media curation committee will review it for showcase.");
}

// 10. Accommodation Reservation
function handleAccommodationReservation(data) {
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
  const required = ["touristName", "email", "phone", "circuitName", "tourDate"];
  for (let f of required) {
    if (!data[f]) {
      return createResponse("error", `Missing tour guide field: ${f}`);
    }
  }

  const sheet = getSheetByName(CONFIG.tourGuideSheet, [
    "Timestamp", "Request ID", "Tourist Name", "Email", "Phone / WhatsApp",
    "Selected Tour Circuit", "Tour Date", "Duration", "Group Size", "Language", "Pickup Location / Hotel"
  ]);

  const tourId = "AIC-TOUR-" + Math.floor(100000 + Math.random() * 900000);

  sheet.appendRow([
    new Date().toLocaleString(),
    tourId,
    data.touristName,
    data.email,
    data.phone,
    data.circuitName,
    data.tourDate,
    data.duration || "Full Day",
    data.groupSize || 1,
    data.language || "English",
    data.pickupLocation || "Afikpo City Center"
  ]);

  return createResponse("success", `Tour guide requested! Reference ID: ${tourId}. Your certified Afikpo guide will connect with you.`, { tourId: tourId });
}

// 12. Save Blog Post (Create or Update from Frontend Admin)
function handleSaveBlogPost(data) {
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
  const coverImage = data.coverImage || "assets/images/Gold sand beach, Afikpo.webp";
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
  if (!data.id) {
    return createResponse("error", "Missing post ID to delete");
  }

  const sheet = getSheetByName(CONFIG.blogSheet, [
    "ID", "Title", "Slug", "Category", "Author", "Date", "CoverImage", "Excerpt", "Content", "Status"
  ]);

  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] == data.id) {
      sheet.deleteRow(i + 1);
      return createResponse("success", "Blog article deleted successfully.");
    }
  }

  return createResponse("warning", "Post not found in database.");
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
    "Timestamp", "Contestant ID", "Contestant Name", "Vote Count", "Voter Email/Phone", "Vote Type", "Amount Paid (NGN)"
  ]);

  const values = sheet.getDataRange().getValues();
  const voteTotals = {};

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const cId = String(row[1]);
    const count = Number(row[3]) || 0;
    voteTotals[cId] = (voteTotals[cId] || 0) + count;
  }

  return createJsonResponse({
    status: "success",
    voteTotals: voteTotals
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
