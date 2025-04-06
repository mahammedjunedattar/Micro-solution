// app/pricing/page.js
'use client'

import { motion } from 'framer-motion'
import { CheckIcon } from '@heroicons/react/24/outline'
import { Button } from '../components/ui/button/button'
import { useState } from 'react'

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: { monthly: '$0', annual: '$0' },
      description: 'Perfect for solo entrepreneurs',
      features: [
        '10 invoices/month',
        'Basic templates',
        'Email reminders',
        'Payment tracking',
        'CSV imports'
      ],
      cta: 'Get Started'
    },
    {
      name: 'Professional',
      price: { monthly: '$9.99', annual: '$99' },
      description: 'For growing micro-businesses',
      features: [
        'Unlimited invoices',
        'Premium templates',
        'WhatsApp/SMS reminders',
        'Auto late fees',
        'Client portal',
        'Tax reports',
        'Priority support'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: { custom: true },
      description: 'Custom solutions for teams',
      features: [
        'Everything in Professional',
        'White-labeling',
        'API access',
        'Dedicated account manager',
        'SLA 99.9% uptime',
        'Custom workflows'
      ],
      cta: 'Contact Sales'
    }
  ]

  const [billingCycle, setBillingCycle] = useState('monthly')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4"
        >
          Simple, Transparent Pricing
        </motion.h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Start free, upgrade as you grow. Cancel anytime.
        </p>

        {/* Billing Toggle */}
        <div className="flex justify-center items-center gap-4 mb-16">
          <span className="text-gray-900">Monthly</span>
          <button
            onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly')}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          >
            <span className={`${
              billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-gray-900">Annual</span>
            <span className="px-2 py-1 text-sm bg-emerald-100 text-emerald-700 rounded-full">
              Save 20%
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-3 lg:gap-6">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-8 bg-white rounded-2xl shadow-lg border ${
                plan.popular 
                  ? 'border-indigo-600 ring-1 ring-indigo-600' 
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-4 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm">
                  Most Popular
                </div>
              )}
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  {plan.price.custom ? (
                    <span className="text-4xl font-bold text-gray-900">Custom</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price[billingCycle]}
                      </span>
                      <span className="text-gray-600">/{billingCycle}</span>
                    </>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                className={`w-full ${
                  plan.popular 
                    ? 'bg-indigo-600 hover:bg-indigo-700' 
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Feature Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left pb-4">Feature</th>
                  {plans.map((plan) => (
                    <th key={plan.name} className="text-center pb-4">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Monthly Invoices', '10', 'Unlimited', 'Unlimited'],
                  ['Payment Reminders', 'Email only', 'Email + SMS/WhatsApp', 'All channels'],
                  ['Support', 'Email', 'Priority Email', '24/7 Chat + Phone'],
                  ['Custom Branding', 'Basic', 'Advanced', 'White-label'],
                  ['Team Members', '1', '3', 'Unlimited'],
                ].map(([feature, ...values]) => (
                  <tr key={feature} className="border-t">
                    <td className="py-4 text-gray-700">{feature}</td>
                    {values.map((value, i) => (
                      <td key={i} className="text-center py-4 text-gray-600">
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {[
              {
                question: 'Can I switch plans later?',
                answer: 'Yes, you can upgrade or downgrade at any time.'
              },
              {
                question: 'Do you offer discounts for annual billing?',
                answer: 'Yes! Annual plans save you 20% compared to monthly billing.'
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'All major credit cards and PayPal.'
              },
            ].map((faq) => (
              <div key={faq.question} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Start Saving Time Today
          </h2>
          <p className="text-indigo-100 mb-8 text-xl">
            Join 1,000+ micro-businesses automating their invoicing
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="secondary" size="lg">
              Start Free Trial
            </Button>
            <Button className="bg-white text-indigo-600 hover:bg-gray-100" size="lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}