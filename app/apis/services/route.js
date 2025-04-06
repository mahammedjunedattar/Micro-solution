import { sendWhatsAppReminder } from '@/app/utils/whatsapp';
import { safeDateConverter } from '@/app/utils/date';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI
// Connection handling
let cachedClient = null;
let cachedDb1 = null;
let cachedDb2 = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb1 && cachedDb2) {
    return { client: cachedClient, db1: cachedDb1, db2: cachedDb2 };
  }

  const client = new MongoClient(uri);
  await client.connect();
  
  cachedClient = client;
  cachedDb1 = client.db('invoice');
  cachedDb2 = client.db('reminder');

  return { client: cachedClient, db1: cachedDb1, db2: cachedDb2 };
}

export async function sendPaymentReminder(invoiceId) {
  try {
    const { db1 } = await connectToDatabase();

    // Validate UUID format

    // Fetch invoice
    const invoice = await db1.collection('invoice-collection').findOne({
      _id: invoiceId,
      status: { $ne: 'paid' }
    });

    // Validate invoice structure
    if (!invoice?.client) {
      throw new Error('Invalid invoice structure');
    }

    // Add type safety for critical fields
    const validatedInvoice = {
      ...invoice,
      number: invoice.number || 'N/A',
      amount: invoice.amount?.$numberInt ? 
        parseInt(invoice.amount.$numberInt, 10) / 100 : 0,
      dueDate: safeDateConverter(invoice.dueDate),
      client: {
        ...invoice.client,
        phone: invoice.client.phone?.toString() || ''
      }
    };

    // Send reminder with validated data
    const result = await sendWhatsAppReminder(validatedInvoice);

    // Update invoice history
    await db1.collection('invoice-collection').updateOne(
      { _id: invoiceId },
      {
        $push: {
          reminders: {
            channel: 'whatsapp',
            status: result.success ? 'sent' : 'failed',
            timestamp: new Date().toISOString(),
            response: result
          }
        }
      }
    );

    return result;

  } catch (error) {
    console.error('Reminder Processing Error:', {
      invoiceId,
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : error.stack
    });
    
    return {
      success: false,
      error: error.message,
      retryable: true
    };
  }
}