import { NextResponse } from 'next/server';
import connectToDatabase from '@/utils/connectToDatabase';
import { sendPaymentReminder } from '@/services/reminderService';

export async function GET() {
  try {
    const client = await connectToDatabase();
    const db = client.db(); // Access the database directly

    const overdueInvoices = await db.collection('invoices').find({
      status: 'sent',
      dueDate: { $lt: new Date() },
      reminders: { 
        $not: { 
          $elemMatch: { 
            channel: 'whatsapp',
            status: 'sent'
          }
        }
      }
    }).toArray();

    const results = await Promise.all(
      overdueInvoices.map(invoice => sendPaymentReminder(invoice._id))
    );

    return NextResponse.json({
      sent: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    }, { status: 200 });

  } catch (error) {
    console.error('Scheduled reminders error:', error);
    return NextResponse.json(
      { error: 'Scheduled reminders failed' }, 
      { status: 500 }
    );
  }
}
