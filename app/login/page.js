'use client'

import { useState, useEffect } from 'react'
import { signIn, getCsrfToken } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [csrfToken, setCsrfToken] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const token = await getCsrfToken()
        setCsrfToken(token || '')
      } catch (err) {
        console.error('Failed to fetch CSRF token:', err)
      }
    }
  
    fetchCsrfToken()
  }, [])
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      });
  
      console.log('SignIn Result:', result); // Add logging
  
      if (result?.error) {
        setError(result.error === 'CredentialsSignin' 
          ? 'Invalid email or password' 
          : `Login failed: ${result.error}`
        );
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login Error:', error);
      setError('Connection error. Please try again.');
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input name="csrfToken" type="hidden" value={csrfToken} />

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  )
}

