import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/utils/database";

export async function GET() {
  try {
    const { db } = await connectToDatabase(); // Ensure correct destructuring

    const recentInvoices = await db.collection("invoice-collection")
    .find()
    .sort({ createdAt: -1 }) // Sorts by 'createdAt' in descending order
    .limit(5) // Limits the results to 5 invoices
    .project({
      _id: 1, 
      clientName: "$client.name", // Extracts 'name' from 'client' object
      amount: "$client.amount", // Extracts 'amount' from 'client' object
      dueDate: "$client.dueDate",
      status: 1,
      createdAt: 1,
    })
    .toArray();
    return NextResponse.json(recentInvoices);
  } catch (error) {
    console.error("Recent Invoices API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent invoices" },
      { status: 500 }
    );
  }
}
