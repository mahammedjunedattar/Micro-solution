import { connectToDatabase } from "@/app/utils/database"

export async function GET(req) {
  const { db } = await connectToDatabase()
  const { searchParams } = new URL(req.url)
  
  const filter = searchParams.get("filter") || "all"
  const sort = searchParams.get("sort") || "dueDate"
  const search = searchParams.get("search") || ""

  let query = {}

  // Filter logic
  if (filter !== "all") {
    query.status = filter
  }

  // Search logic
  if (search) {
    query.$or = [
      { "client.name": new RegExp(search, "i") },
      { number: new RegExp(search, "i") }
    ]
  }

  // Sorting logic
  let sortOption = { dueDate: 1 }
  if (sort === "amount") sortOption = { amount: -1 }
  if (sort === "client") sortOption = { "client.name": 1 }

  try {
    const invoices = await db.collection("invoice-collection")
      .find(query)
      .sort(sortOption)
      .toArray()
    console.log(invoices)
    return Response.json(invoices, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}
