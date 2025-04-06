// pages/api/payments/create-order.js
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const { amount, currency = 'INR', invoiceId } = req.body
    
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `INV-${invoiceId}`,
      payment_capture: 1,
      notes: {
        invoiceId
      }
    }

    const order = await razorpay.orders.create(options)
    
    res.status(200).json({
      id: order.id,
      currency: order.currency,
      amount: order.amount
    })

  } catch (error) {
    console.error('Razorpay Order Error:', error)
    res.status(500).json({ error: error.error.description })
  }
}