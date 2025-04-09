import { connectToDatabase } from "@/app/utils/database"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
export async function GET(req) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userEmail = session.user.email
  const { db } = await connectToDatabase()

  const { searchParams } = new URL(req.url)
  const filter = searchParams.get("filter") || "all"
  const sort = searchParams.get("sort") || "dueDate"
  const search = searchParams.get("search") || ""

  let query = { userEmail } // Only fetch user's own invoices

  if (filter !== "all") {
    query.status = filter
  }

  if (search) {
    query.$or = [
      { "client.name": new RegExp(search, "i") },
      { number: new RegExp(search, "i") }
    ]
  }

  let sortOption = { dueDate: 1 }
  if (sort === "amount") sortOption = { amount: -1 }
  if (sort === "client") sortOption = { "client.name": 1 }

  try {
    const invoices = await db.collection("invoice-collection")
      .find(query)
      .sort(sortOption)
      .toArray()

    return Response.json(invoices, { status: 200 })
  } catch (error) {
    return Response.json({ error: "Failed to fetch invoices" }, { status: 500 })
  }
}

