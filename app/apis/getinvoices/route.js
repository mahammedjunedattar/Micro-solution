import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { ObjectId } from 'mongodb'
import { MongoClient } from 'mongodb'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const uri = process.env.MONGODB_URI
let cachedDb = null

async function connectToDatabase() {
  if (cachedDb) return cachedDb
  const client = new MongoClient(uri)
  await client.connect()
  cachedDb = client.db('invoice')
  return cachedDb
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await connectToDatabase()

    const pdfId = '67d133a2a9934c77a06aeacd'
    if (!ObjectId.isValid(pdfId)) {
      throw new Error('Invalid ObjectId format')
    }

    const rawInvoices = await db.collection('invoice-collection')
      .find({ 
        user: session.user.id, 
        pdfId: new ObjectId(pdfId) 
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
      .toArray()

    const safeInvoices = rawInvoices.map(doc => ({
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
    }))

    return NextResponse.json(safeInvoices)

  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })

    return NextResponse.json(
      {
        error: 'Failed to process request',
        details: error.message.includes("ObjectId") 
          ? "Invalid ID format" 
          : error.message
      },
      { status: 500 }
    )
  }
}

