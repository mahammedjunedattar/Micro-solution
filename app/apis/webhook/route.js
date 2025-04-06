// pages/api/webhooks/razorpay.js
export default async function handler(req, res) {
    const signature = req.headers['x-razorpay-signature']
    const body = JSON.stringify(req.body)
    
    // Verify webhook signature
    const isValid = validateWebhookSignature(
      body,
      signature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    )
  
    if (!isValid) return res.status(401).end()
  
    const event = req.body.event
  
    switch (event) {
      case 'payment.captured':
        // Handle successful payment
        break
      case 'payment.failed':
        // Handle failed payment
        break
      case 'subscription.charged':
        // Handle recurring payment
        break
    }
  
    res.status(200).end()
  }