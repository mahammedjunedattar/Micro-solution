'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function ErrorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages = {
    Configuration: 'Server configuration error',
    AccessDenied: 'Access denied',
    Verification: 'Token verification failed',
    Default: 'Authentication failed'
  }

  useEffect(() => {
    if (!error) router.push('/login')
  }, [error, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          {errorMessages[error] || errorMessages.Default}
        </h2>
        <button
          onClick={() => router.push('/login')}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Return to Login
        </button>
      </div>
    </div>
  )
}