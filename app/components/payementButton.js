// components/PaymentButton.js
'use client'

import { useState } from 'react'
import Script from 'next/script'
import { Button } from '@/components/ui/button'

export default function PaymentButton({ invoice }) {
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    setLoading(true)
    
    try {
      // Create order
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: invoice.amount,
          invoiceId: invoice._id
        })
      })

      const order = await orderRes.json()

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount.toString(),
        currency: order.currency,
        name: 'Your SaaS Name',
        description: `Payment for Invoice #${invoice.number}`,
        image: '/logo.png',
        order_id: order.id,
        handler: async (response) => {
          // Verify payment
          await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
          })
          
          // Update UI
          window.location.reload()
        },
        prefill: {
          name: invoice.client.name,
          email: invoice.client.email || '',
          contact: invoice.client.phone || ''
        },
        theme: {
          color: '#2563eb'
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (error) {
      console.error('Payment Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Script
        id="razorpay-sdk"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      <Button 
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </Button>
    </>
  )
}