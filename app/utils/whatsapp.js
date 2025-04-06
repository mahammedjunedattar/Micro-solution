import twilio from 'twilio';
import { formatLocalDate } from './date';
import { parsePhoneNumber } from 'libphonenumber-js';

// 🔴 Hardcoded Twilio Credentials (Replace with your own)
const TWILIO_SID = process.env.TWILIO_SID; 
const TWILIO_TOKEN = process.env.TWILIO_TOKEN; 
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER; // Twilio sandbox/business number
const NEXTAUTH_URL = process.env.NEXTAUTH_URL; // Your app's base URL

const twilioClient = twilio(TWILIO_SID, TWILIO_TOKEN);

// ✅ Function to validate Indian phone numbers
function validateIndianPhoneNumber(phone) {
  try {
    const parsed = parsePhoneNumber(phone, 'IN');
    return parsed.isValid() && parsed.country === 'IN';
  } catch (error) {
    return false;
  }
}

// ✅ Function to send a WhatsApp message
export async function sendWhatsAppReminder(invoice) {
  try {
    if (!invoice?.client?.phone) {
      throw new Error('Missing client phone number');
    }
    
    if (!validateIndianPhoneNumber('8766747601')) {
      throw new Error('Invalid Indian phone number format');
    }

    // ✅ Convert to E.164 format (e.g., +919876543210)
    const toNumber = `whatsapp:${parsePhoneNumber('8766747601', 'IN').format('E.164')}`;

    // ✅ Construct message
    const message = [
      `Hi ${invoice.client.name},`,
      `Your invoice #${invoice.number} for ₹${invoice.amount} is due on ${formatLocalDate(invoice.dueDate)}.`,
      `Payment link: ${NEXTAUTH_URL}/pay/${invoice._id}`,
      `Thank you!`
    ].join('\n\n');

    console.log("📨 Sending message to:", toNumber);
    console.log("📝 Message content:\n", message);

    // ✅ Send message using Twilio
    const result = await twilioClient.messages.create({
      body: message,
      from: TWILIO_WHATSAPP_NUMBER, // Twilio sandbox/business number
      to: toNumber // Recipient's WhatsApp number
    });

    console.log("✅ Message sent successfully:", result);

    return {
      success: true,
      messageId: result.sid,
      timestamp: result.dateCreated.toISOString()
    };

  } catch (error) {
    console.error("❌ WhatsApp API Error:", {
      error: error.message,
      code: error.code,
      invoiceId: invoice._id,
      phone: invoice.client?.phone ? '***' + invoice.client.phone.slice(-4) : 'unknown'
    });

    return {
      success: false,
      error: error.message,
      code: error.code || 'UNKNOWN_ERROR',
      retryable: error.retryAfter ? true : false
    };
  }
}
