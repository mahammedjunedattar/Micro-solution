import { NextResponse } from 'next/server';
import { sendPaymentReminder } from '../services/route';
export async function POST(req) {
  try {
    const body = await req.json();

    if (!body?.invoiceId) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    const result = await sendPaymentReminder(body.invoiceId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send reminder' },
        { status: 400 }
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
