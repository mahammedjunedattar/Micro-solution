// app/page.js
// app/page.js
'use client'

import { motion } from 'framer-motion'
import { Button } from './components/ui/button/button'
import { BarChart } from '@tremor/react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/ui/acoordion'
import { useState } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  const [showSignIn, setShowSignIn] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showDemoModal, setShowDemoModal] = useState(false)
  const handleDemoOpen = () => {
    setShowDemoModal(true);
    if (window.analytics) {
        window.analytics.track('Demo Video Started');
    }
};

// Improved handleSignUp
const handleSignUp = async (e) => {
    e.preventDefault();
    setError(''); // Reset error before request
    try {
        const response = await fetch('/apis/auth/Signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Sign up failed');
        }

        setShowSignUp(false);
        window.location.reload();
    } catch (err) {
        setError(err.message);
    }
};

  const stats = [
    { name: 'Manual Invoicing', value: '5+ hours/month' },
    { name: 'Late Payments', value: '30% invoices' },
    { name: 'Growth Focus', value: 'No time' },
  ]

  const chartData = [
    { month: 'Jan', Paid: 45, Pending: 12 },
    { month: 'Feb', Paid: 52, Pending: 8 },
    { month: 'Mar', Paid: 48, Pending: 15 },
  ]

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('/api/auth/callback/credentials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Sign in failed');
        }

        setShowSignIn(false);
        window.location.reload();
    } catch (err) {
        setError(err.message);
    }
};

  return (
    <div className="min-h-screen bg-gray-50">
            {/* Demo Video Modal */}
            {showDemoModal && (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={() => setShowDemoModal(false)}
    >
      <div
        className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
      >
        <button
          onClick={() => setShowDemoModal(false)}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
        >
          ✕
        </button>
        
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1"
            title="InvoiceFlow Demo - See How It Works"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          ></iframe>
        </div>
      </div>
    </div>
)}


      {/* Sign Up Modal */}
      {showSignUp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create Account</h2>
              <button 
                onClick={() => setShowSignUp(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
            )}

            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                  minLength="6"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Create Account
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button 
                  className="text-indigo-600 hover:underline"
                  onClick={() => {
                    setShowSignUp(false)
                    setShowSignIn(true)
                  }}
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
            {/* Sign In Modal */}
            {showSignIn && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Sign In</h2>
              <button 
                onClick={() => setShowSignIn(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
            )}

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <button className="text-indigo-600 hover:underline">
                Forgot password?
              </button>
              <p className="mt-2 text-gray-600">
                Don't have an account?{' '}
                <button className="text-indigo-600 hover:underline" onClick={()=>{
                                      setShowSignUp(true)
                                      setShowSignIn(false)
                  
                }}>
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      )}


      {/* Updated Navigation */}
      <nav className="fixed top-0 w-full bg-white shadow-sm z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-indigo-600">InvoiceFlow</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
          <Link href={'/features'} className="text-gray-600 hover:text-indigo-600">Features</Link>
<Link href={'/pricing'} className="text-gray-600 hover:text-indigo-600">Pricing</Link>
<Link href={'/faq'} className="text-gray-600 hover:text-indigo-600">FAQ</Link>
            <Button 
              variant="outline" 
              className="ml-4"
              onClick={() => setShowSignIn(true)}
            >
              Sign In
            </Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-700"
              onClick={() => setShowSignUp(true)}
            >
              Start Free
            </Button>
          </div>
        </div>
      </nav>

      {/* Rest of your existing landing page content... */}
   {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
          >
            Automate Your Invoicing & Payments
            <span className="block text-indigo-600 mt-2">Get Paid 2x Faster</span>
          </motion.h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create branded invoices, send reminders, and track payments in 3 clicks. 
            Designed for freelancers, shops, and micro-businesses.
          </p>

          <div className="flex justify-center space-x-4">
            <Button className="bg-indigo-600 hover:bg-indigo-700 px-8 py-4 text-lg">
              Start Free Trial
            </Button>
            <Button  variant="outline" className="px-8 py-4 text-lg border-indigo-600 text-indigo-600"
            onClick={() => handleDemoOpen(true)}
                          >
              Watch Demo
            </Button>
          </div>

          {/* Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-16 rounded-xl shadow-lg overflow-hidden border border-gray-200"
          >
            <div className="bg-white p-4">
              <BarChart
                data={chartData}
                categories={["Paid", "Pending"]}
                index="month"
                colors={["indigo", "emerald"]}
                className="h-64"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need to Get Paid Effortlessly
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {['Auto-Invoicing', 'Payment Reminders', 'Dashboard'].map((feature, idx) => (
              <motion.div 
                key={feature}
                whileHover={{ y: -5 }}
                className="p-6 rounded-xl border border-gray-200 hover:border-indigo-100 hover:bg-indigo-50/50"
              >
                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-indigo-600 text-2xl">
                    {idx === 0 ? '📄' : idx === 1 ? '⏰' : '📊'}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature}</h3>
                <p className="text-gray-600">
                  {idx === 0 && "Upload CSV, brand with logo, and auto-send invoices"}
                  {idx === 1 && "Automatic 3/7/14-day reminders via email/SMS"}
                  {idx === 2 && "Real-time tracking of paid vs pending invoices"}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50" id="pricing">
        {/* ... Pricing section JSX similar to features ... */}
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white" id="faq">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I import client data?</AccordionTrigger>
              <AccordionContent>
                You can upload CSV files or connect directly with Google Contacts.
              </AccordionContent>
            </AccordionItem>
            {/* Add more FAQ items */}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="mb-4">&copy; {new Date().getFullYear()} InvoiceFlow. All rights reserved.</p>
          <div className="flex justify-center space-x-6">
            <Link href={'/privacy'} className="hover:text-indigo-400">Privacy</Link>
            <Link href={'/terms'} className="hover:text-indigo-400">terms</Link>
            <Link href={'/contact'} className="hover:text-indigo-400">contact</Link>
            <Link href={'/refund-policy'} className="hover:text-indigo-400">refund-policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}