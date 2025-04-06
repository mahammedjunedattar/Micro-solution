import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/utils/database";

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    const chartData = await db.collection("invoice-collection").aggregate([
      {
        $project: {
          month: { $dateToString: { format: "%Y-%m", date: { $toDate: "$createdAt" } } },
          status: 1,
          amount: 1,
          dueDate: { $toDate: "$dueDate" }
        }
      },
      {
        $group: {
          _id: "$month",
          paid: {
            $sum: { $cond: [{ $eq: ["$status", "paid"] }, "$amount", 0] }
          },
          overdue: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$status", "pending"] }, { $lt: ["$dueDate", new Date()] }] },
                "$amount",
                0
              ]
            }
          }
        }
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          month: "$_id",
          paid: 1,
          overdue: 1,
          _id: 0
        }
      }
    ]).toArray();

    return NextResponse.json(chartData);
  } catch (error) {
    console.error("Chart Data API Error:", error);
    return NextResponse.json({ error: "Failed to fetch chart data" }, { status: 500 });
  }
}
