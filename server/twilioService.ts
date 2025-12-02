import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
const authToken = process.env.TWILIO_AUTH_TOKEN || "";
const fromPhone = process.env.TWILIO_PHONE_NUMBER || "";
const fromWhatsApp = process.env.TWILIO_WHATSAPP_NUMBER || "";

let twilioClient: any = null;

function getTwilioClient() {
  if (!accountSid || !authToken) {
    console.warn("Twilio credentials not configured, OTP will be logged only");
    return null;
  }
  if (!twilioClient) {
    twilioClient = new Twilio(accountSid, authToken);
  }
  return twilioClient;
}

export async function sendSmsOtp(phone: string, otp: string): Promise<boolean> {
  const client = getTwilioClient();
  if (!client) {
    console.log(`[SMS] OTP ${otp} for ${phone} (Twilio not configured)`);
    return true;
  }

  try {
    await client.messages.create({
      body: `Your VaxTrack verification code is: ${otp}. Valid for 10 minutes.`,
      from: fromPhone,
      to: phone,
    });
    console.log(`[SMS] OTP sent to ${phone}`);
    return true;
  } catch (error) {
    console.error("SMS send failed:", error);
    return false;
  }
}

export async function sendWhatsAppOtp(phone: string, otp: string): Promise<boolean> {
  const client = getTwilioClient();
  if (!client) {
    console.log(`[WhatsApp] OTP ${otp} for ${phone} (Twilio not configured)`);
    return true;
  }

  try {
    const whatsappPhone = `whatsapp:${phone}`;
    await client.messages.create({
      body: `Your VaxTrack verification code is: ${otp}. Valid for 10 minutes.`,
      from: `whatsapp:${fromWhatsApp}`,
      to: whatsappPhone,
    });
    console.log(`[WhatsApp] OTP sent to ${phone}`);
    return true;
  } catch (error) {
    console.error("WhatsApp send failed:", error);
    return false;
  }
}
