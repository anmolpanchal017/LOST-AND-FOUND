const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const { defineString } = require("firebase-functions/params");

admin.initializeApp();

/* ✅ DEFINE ENV VARIABLES (NEW WAY) */
const GMAIL_EMAIL = defineString("GMAIL_EMAIL");
const GMAIL_PASSWORD = defineString("GMAIL_PASSWORD");

/* ✅ MAIL TRANSPORT */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_EMAIL.value(),
    pass: GMAIL_PASSWORD.value(),
  },
});

/* 🔔 NEW CLAIM → FINDER EMAIL */
exports.notifyFinderOnClaim = functions.firestore
  .document("claims/{claimId}")
  .onCreate(async (snap) => {
    const claim = snap.data();
    if (!claim.finderEmail) return null;

    await transporter.sendMail({
      from: GMAIL_EMAIL.value(),
      to: claim.finderEmail,
      subject: "📢 New Claim on Your Found Item",
      text:
        "Someone has claimed an item you found.\n\n" +
        "Please login to your dashboard to review it.",
    });

    return null;
  });

/* 🔔 CLAIM STATUS CHANGE → CLAIMER EMAIL */
exports.notifyClaimerOnStatusChange = functions.firestore
  .document("claims/{claimId}")
  .onUpdate(async (change) => {
    const before = change.before.data();
    const after = change.after.data();

    if (before.status === after.status) return null;
    if (!after.claimerEmail) return null;

    await transporter.sendMail({
      from: GMAIL_EMAIL.value(),
      to: after.claimerEmail,
      subject: `📌 Claim ${after.status.toUpperCase()}`,
      text:
        `Your claim has been ${after.status}.\n\n` +
        "Please login to your dashboard for details.",
    });

    return null;
  });
