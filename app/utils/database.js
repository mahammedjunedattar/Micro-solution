import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('Define MONGODB_URI')

let cachedClient = null
let cachedDb = null

export async function connectToDatabase() {
  if (cachedDb) return { db: cachedDb }

  const client = new MongoClient(uri)
  await client.connect()
  cachedClient = client
  cachedDb = client.db('invoice')

  return { db: cachedDb }
}
