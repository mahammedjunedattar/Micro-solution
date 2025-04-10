import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { ObjectId } from 'mongodb';
import { MongoClient } from 'mongodb';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const uri = process.env.MONGODB_URI;

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await client.connect();
  cachedDb = client.db('invoice');
  return cachedDb;
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectToDatabase();

    const userId = session.user.id;

    const rawInvoices = await db.collection('invoice-collection')
      .find({ 
        user: userId,
        pdfId: new ObjectId('67d133a2a9934c77a06aeacd')
      })
      .project({
        _id: 1,
        number: 1,
        'client.name': 1,
        amount: 1,
        dueDate: 1,
        status: 1,
        reminders: 1,
        createdAt: 1
      })
      .sort({ dueDate: 1 })
      .toArray();

    const safeInvoices = rawInvoices.map(doc => {
      const safeDoc = {
        _id: doc._id?.toString() || '',
        pdfId: doc.pdfId?.toString() || '',
        number: doc.number || 0,
        client: {
          name: doc.client?.name || 'Unknown Client'
        },
        amount: doc.amount || 0,
        dueDate: doc.dueDate?.toISOString() || new Date().toISOString(),
        status: doc.status || 'draft',
        reminders: doc.reminders || [],
        createdAt: doc.createdAt?.toISOString() || new Date().toISOString()
      };

      if (!doc._id || !doc.pdfId) {
        console.warn('Invalid document structure:', doc);
      }

      return safeDoc;
    });

    console.log('Processed invoices:', safeInvoices);

    return NextResponse.json(safeInvoices);

  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        error: 'Failed to process request',
        details: error.message.includes("ObjectId") 
          ? "Invalid ID format" 
          : error.message
      },
      { status: 500 }
    );
  }
}

