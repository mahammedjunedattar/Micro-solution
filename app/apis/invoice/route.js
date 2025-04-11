import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { MongoClient, ObjectId, GridFSBucket } from 'mongodb';
import { PDFDocument, rgb } from 'pdf-lib';
import { v4 as uuidv4 } from 'uuid';
import { Resend } from 'resend';

const uri = process.env.MONGODB_URI;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

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

async function storePDFInGridFS(db, filename, buffer) {
  const bucket = new GridFSBucket(db, { bucketName: 'invoices' });
  const uploadStream = bucket.openUploadStream(filename);

  return new Promise((resolve, reject) => {
    uploadStream.end(buffer);
    uploadStream.on('finish', () => resolve(uploadStream.id));
    uploadStream.on('error', reject);
  });
}

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ]
    : [0, 0, 0];
};

async function generateInvoicePDF(data, brandSettings) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);

  if (brandSettings.logo) {
    try {
      const logoImage = await pdfDoc.embedPng(brandSettings.logo);
      page.drawImage(logoImage, { x: 50, y: 700, width: 100, height: 40 });
    } catch (error) {
      console.error('Error embedding logo:', error);
    }
  }

  page.drawText(`INVOICE #${data.invoiceNumber}`, {
    x: 50,
    y: 650,
    size: 20,
    color: rgb(...hexToRgb(brandSettings.primaryColor)),
  });

  return await pdfDoc.save();
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const clients = JSON.parse(formData.get('clients'));
    const brandSettings = JSON.parse(formData.get('brandSettings'));
    const user = JSON.parse(formData.get('user'));

    if (!user || !user._id) {
      return NextResponse.json({ error: 'User data missing or invalid' }, { status: 400 });
    }

    if (!Array.isArray(clients) || clients.length === 0) {
      return NextResponse.json({ error: 'Client data invalid or empty' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const collection = db.collection('invoice-collection');
    const resend = new Resend(RESEND_API_KEY);

    const invoices = await Promise.all(
      clients.map(async (client) => {
        try {
          const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
          const invoiceData = {
            ...client,
            invoiceNumber,
          };

          const pdfBytes = await generateInvoicePDF(invoiceData, brandSettings);
          const invoiceId = uuidv4();

          const pdfId = await storePDFInGridFS(db, `${invoiceId}.pdf`, Buffer.from(pdfBytes));

          await collection.insertOne({
            _id: invoiceId,
            user: user._id,
            client: {
              name: client.name,
              email: client.email,
              amount: parseFloat(client.amount) || 0,
              dueDate: new Date(client.dueDate || client.duedate),
            },
            status: 'sent',
            pdfId,
            createdAt: new Date(),
          });

          await resend.emails.send({
            from: 'billing@yourdomain.com',
            to: client.email,
            subject: `Invoice #${invoiceNumber} from ${user.businessName}`,
            attachments: [
              {
                content: Buffer.from(pdfBytes).toString('base64'),
                filename: `invoice_${invoiceNumber}.pdf`,
                contentType: 'application/pdf',
              },
            ],
          });

          return { success: true, invoiceId };
        } catch (error) {
          console.error(`Failed for ${client.email}:`, error);
          return { success: false, error: error.message };
        }
      })
    );

    return NextResponse.json({
      success: true,
      processed: invoices.filter((i) => i.success).length,
      failed: invoices.filter((i) => !i.success).length,
      invoices,
    });
  } catch (error) {
    console.error('Invoice generation failed:', error);
    return NextResponse.json(
      { error: 'Processing failed', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = await connectToDatabase();
    const userId = session.user.id;

    const invoices = await db
      .collection('invoice-collection')
      .find({ user: userId })
      .project({
        _id: 1,
        pdfId: 1,
        number: 1,
        'client.name': 1,
        'client.amount': 1,
        'client.dueDate': 1,
        status: 1,
        createdAt: 1,
      })
      .sort({ createdAt: -1 })
      .toArray();

    const sanitized = invoices.map((inv) => ({
      _id: inv._id?.toString() || '',
      pdfId: inv.pdfId?.toString() || '',
      number: inv.number || 'N/A',
      client: {
        name: inv.client?.name || 'Unknown',
        amount: inv.client?.amount || 0,
        dueDate: inv.client?.dueDate?.toISOString() || '',
      },
      status: inv.status || 'draft',
      createdAt: inv.createdAt?.toISOString() || '',
    }));

    return NextResponse.json(sanitized);
  } catch (error) {
    console.error('Fetch invoices failed:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices', details: error.message },
      { status: 500 }
    );
  }
}

