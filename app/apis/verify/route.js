// pages/api/payments/verify.js
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
})

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body
    
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex')

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' })
    }

    // Update database
    // ...

    res.status(200).json({ 
      success: true,
      paymentId: razorpay_payment_id
    })

  } catch (error) {
    console.error('Payment Verification Error:', error)
    res.status(500).json({ error: 'Payment verification failed' })
  }
}