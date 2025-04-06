import Link from "next/link"
// app/payment/success/[id]/page.js
export default function PaymentSuccess({ params }) {
    const { id: paymentId } = params
  
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <div className="text-emerald-600 text-6xl mb-4">✓</div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-4">
            Payment ID: {paymentId}
          </p>
          <Button asChild>
            <Link href={'/Dashboard'} >Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }