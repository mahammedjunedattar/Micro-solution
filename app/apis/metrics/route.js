import { connectToDatabase } from "@/app/utils/database";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
export async function GET(req) {
  const { db } = await connectToDatabase();

  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session?.user?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user in database
    const user = await db.collection('users').findOne({
      user: session.user.id
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Common match filter for user's documents
    const userFilter = { userId: user._id };

    // Total Unpaid Amount
    const totalUnpaid = await db.collection('invoice-collection').aggregate([
      { 
        $match: { 
          ...userFilter,
          status: { $in: ['sent', 'pending'] } 
        } 
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).toArray();

    // Overdue Invoices Count
    const overdueInvoices = await db.collection('invoice-collection').countDocuments({
      ...userFilter,
      status: 'pending',
      dueDate: { $lt: new Date() }
    });

    // Average Payment Time
    const paymentTimes = await db.collection('invoice-collection').aggregate([
      { 
        $match: { 
          ...userFilter,
          status: 'paid', 
          paidAt: { $exists: true }, 
          createdAt: { $exists: true } 
        } 
      },
      { $project: { 
          days: { 
            $divide: [
              { $subtract: ["$paidAt", "$createdAt"] },
              1000 * 60 * 60 * 24
            ] 
          } 
        } 
      },
      { $group: { _id: null, avg: { $avg: "$days" } } }
    ]).toArray();

    // Paid This Month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const paidThisMonth = await db.collection('invoice-collection').aggregate([
      { 
        $match: { 
          ...userFilter,
          status: 'paid',
          paidAt: { $gte: startOfMonth } 
        } 
      },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]).toArray();

    return Response.json({
      totalUnpaid: totalUnpaid[0]?.total || 0,
      overdueInvoices,
      avgPaymentTime: paymentTimes[0]?.avg ? Math.round(paymentTimes[0].avg) : 0,
      paidThisMonth: paidThisMonth[0]?.total || 0
    }, { status: 200 });

  } catch (error) {
    console.error("Metrics API Error:", error);
    return Response.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
}
