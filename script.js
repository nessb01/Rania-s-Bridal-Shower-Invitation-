/* EDIT ONLY THE VALUES BELOW. Keep the quotation marks. */
const CONFIG = {
  date: "Saturday 07th November 2026",                 // Example: "Saturday, 14 November 2026"
  time: "14:00 - 16:30",                 // Example: "3:00 PM – 6:00 PM"
  venue: "Rania's Family House",                // Example: "Rose Garden Hall"
  address: "Will be sent by text",              // Example: "Dublin, Ireland"
  rsvpDeadline: "Saturday 31st October 2026",         // Example: "1 November 2026"
  googleScriptUrl: "https://script.google.com/macros/s/AKfycbxZA2x4t4nr0NaKP8yHvTrcRxYi-mhiZ0V4MpB-qfYXpK4VKxoSaqMZFZ_F5xlJsl9I/exec"       // Paste the Google Apps Script Web App URL ending in /exec
};

function setText(id, value, fallback) {
  document.getElementById(id).textContent = value.trim() || fallback;
}
setText("date-text", CONFIG.date, "Date to be announced");
setText("time-text", CONFIG.time, "Time to be announced");
setText("venue-text", CONFIG.venue, "Venue to be announced");
setText("address-text", CONFIG.address, "Details coming soon");
setText("deadline-text", CONFIG.rsvpDeadline ? "Please RSVP by " + CONFIG.rsvpDeadline : "RSVP deadline to be announced");

const form = document.getElementById("rsvp-form");
const status = document.getElementById("form-status");
const button = document.getElementById("submit-btn");
const iframe = document.getElementById("rsvp-target");
let awaitingResponse = false;
let timeoutId;

form.addEventListener("submit", (event) => {
  if (!CONFIG.googleScriptUrl.startsWith("https://script.google.com/macros/s/") || !CONFIG.googleScriptUrl.endsWith("/exec")) {
    event.preventDefault();
    status.className = "form-status error";
    status.textContent = "RSVP collection isn't connected yet. The organiser needs to add the Google Apps Script URL.";
    return;
  }
  if (document.getElementById("website").value) {
    event.preventDefault();
    return;
  }
  form.action = CONFIG.googleScriptUrl;
  awaitingResponse = true;
  button.disabled = true;
  status.className = "form-status";
  status.textContent = "Sending your RSVP…";
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    if (awaitingResponse) {
      awaitingResponse = false;
      button.disabled = false;
      status.className = "form-status error";
      status.textContent = "We couldn't confirm delivery. Please contact the organiser before trying again.";
    }
  }, 15000);
});

// A hidden iframe permits a POST from static GitHub Pages to Apps Script.
// Its load event does not prove the spreadsheet write succeeded; check the sheet.
iframe.addEventListener("load", () => {
  if (!awaitingResponse) return;
  awaitingResponse = false;
  clearTimeout(timeoutId);
  button.disabled = false;
  status.className = "form-status";
  status.textContent = "Your RSVP was sent. Thank you! ♡";
  form.reset();
});
