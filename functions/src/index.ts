/*
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as sgMail from "@sendgrid/mail";

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Set SendGrid API Key
// The user will set this using firebase functions:config:set sendgrid.key="YOUR_API_KEY"
const SENDGRID_API_KEY = functions.config().sendgrid.key;
sgMail.setApiKey(SENDGRID_API_KEY);

// --- Callable Functions ---

/**
 * Generates a 6-digit OTP, saves it to Firestore, and sends it to the user's email.
 * @param {string} email - The user's email address.
 * /
export const sendOtp = functions.https.onCall(async (data, context) => {
  const email = data.email;
  if (!email) {
    throw new functions.https.HttpsError("invalid-argument", "The function must be called with one argument 'email'.");
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + 10); // OTP expires in 10 minutes

  // Save the OTP to Firestore
  const otpRef = db.collection("otps").doc(email);
  await otpRef.set({
    otp: otp,
    expires: expiration,
  });

  // Send the OTP via email using SendGrid
  const msg = {
    to: email,
    // The user should configure a verified sender in SendGrid
    from: "verification@example.com", // TODO: Instruct user to change this
    subject: "Your Verification Code",
    text: `Your verification code is ${otp}. It will expire in 10 minutes.`,
    html: `<strong>Your verification code is ${otp}.</strong> It will expire in 10 minutes.`,
  };

  try {
    await sgMail.send(msg);
    return { success: true, message: "OTP sent successfully." };
  } catch (error) {
    console.error("Error sending email:", error);
    throw new functions.https.HttpsError("internal", "Failed to send OTP email.");
  }
});

/**
 * Verifies the OTP submitted by the user.
 * @param {string} email - The user's email address.
 * @param {string} otp - The 6-digit OTP submitted by the user.
 * /
export const verifyOtp = functions.https.onCall(async (data, context) => {
  const email = data.email;
  const otp = data.otp;

  if (!email || !otp) {
    throw new functions.https.HttpsError("invalid-argument", "The function must be called with 'email' and 'otp' arguments.");
  }

  const otpRef = db.collection("otps").doc(email);
  const otpDoc = await otpRef.get();

  if (!otpDoc.exists) {
    throw new functions.https.HttpsError("not-found", "OTP not found for this email. Please request a new one.");
  }

  const otpData = otpDoc.data();
  if (!otpData) {
    throw new functions.https.HttpsError("internal", "Error reading OTP data.");
  }


  if (otpData.expires.toDate() < new Date()) {
    throw new functions.https.HttpsError("deadline-exceeded", "The OTP has expired. Please request a new one.");
  }

  if (otpData.otp !== otp) {
    throw new functions.https.HttpsError("invalid-argument", "The OTP is incorrect.");
  }

  // OTP is correct. Delete it so it can't be used again.
  await otpRef.delete();

  // Also, mark the user's email as verified in Firebase Auth
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(user.uid, { emailVerified: true });
    return { success: true, message: "Email verified successfully." };
  } catch (error) {
    console.error("Error updating user verification status:", error);
    // This is not ideal, but we'll still let the user in.
    // In a real app, you might want to handle this more gracefully.
    return { success: true, message: "OTP verified, but failed to update verification status." };
  }
});
*/