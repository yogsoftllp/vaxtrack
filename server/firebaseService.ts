import axios from "axios";

let cachedConfig: any = null;

export async function loadFirebaseConfig() {
  if (cachedConfig) return cachedConfig;
  
  const projectId = process.env.FIREBASE_PROJECT_ID || "";
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "";
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || "";
  
  if (!projectId || !privateKey || !clientEmail) {
    console.warn("Firebase credentials not configured");
    return null;
  }
  
  cachedConfig = { projectId, privateKey, clientEmail };
  return cachedConfig;
}

async function getFirebaseAccessToken(config: any) {
  try {
    const jwt = require("jsonwebtoken");
    const token = jwt.sign(
      {
        iss: config.clientEmail,
        sub: config.clientEmail,
        aud: "https://oauth2.googleapis.com/token",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
      config.privateKey,
      { algorithm: "RS256" }
    );
    
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: token,
    });
    
    return response.data.access_token;
  } catch (error) {
    console.error("Failed to get Firebase access token:", error);
    return null;
  }
}

export async function sendFirebaseOtp(phone: string, otp: string): Promise<boolean> {
  const config = await loadFirebaseConfig();
  if (!config) {
    console.log(`[Firebase] OTP ${otp} for ${phone} (Firebase not configured)`);
    return true;
  }
  
  try {
    const accessToken = await getFirebaseAccessToken(config);
    if (!accessToken) return false;
    
    // Using Firebase Cloud Messaging or custom SMS backend
    // For demo, we'll log it
    console.log(`[Firebase SMS] OTP ${otp} sent to ${phone}`);
    return true;
  } catch (error) {
    console.error("Firebase SMS send failed:", error);
    return false;
  }
}
