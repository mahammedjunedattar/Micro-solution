import { connectToDatabase } from "@/app/utils/database";

export async function GET(req) {
  const { db } = await connectToDatabase();

  try {
    // Total Unpaid Amount

    const totalUnpaid = await db.collection('invoice-collection').aggregate([
      { $match: { status: { $in: ['sent', 'pending'] } } }, // Include 'sent' as unpaid
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]).toArray()
    
    console.log("Total Unpaid:", totalUnpaid);

    // Overdue Invoices Count
    const overdueInvoices = await db.collection('invoice-collection').countDocuments({
      status: 'pending',
      dueDate: { $lt: new Date() }
    });

    console.log("Overdue Invoices:", overdueInvoices);

    // Average Payment Time
    const paymentTimes = await db.collection('invoice-collection').aggregate([
      { $match: { status: 'paid', paidAt: { $exists: true }, createdAt: { $exists: true } } },
      { $project: { 
          days: { 
            $divide: [
              { $subtract: ["$paidAt", "$createdAt"] },
              1000 * 60 * 60 * 24 // Convert milliseconds to days
            ] 
          } 
        } 
      },
      { $group: { _id: null, avg: { $avg: "$days" } } }
    ]).toArray();

    console.log("Average Payment Time:", paymentTimes);

    // Paid This Month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const paidThisMonth = await db.collection('invoice-collection').aggregate([
      { $match: { 
          status: 'paid',
          paidAt: { $gte: startOfMonth } 
        } 
      },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]).toArray();

    console.log("Paid This Month:", paidThisMonth);

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
