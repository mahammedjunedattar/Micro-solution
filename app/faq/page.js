// app/faq/page.js
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/button/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/acoordion'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  
  const faqCategories = [
    {
      name: 'General',
      questions: [
        {
          question: 'What types of businesses use InvoiceFlow?',
          answer: 'InvoiceFlow is perfect for freelancers, small shops, consultants, and any micro-business that needs to automate their financial operations.'
        },
        {
          question: 'Is there a free trial available?',
          answer: 'Yes! Our Professional plan comes with a 14-day free trial. No credit card required.'
        }
      ]
    },
    {
      name: 'Account & Billing',
      questions: [
        {
          question: 'Can I upgrade or downgrade my plan?',
          answer: 'Yes, you can change plans at any time. Your billing will be prorated based on your usage.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, Mastercard, Amex) and PayPal.'
        }
      ]
    },
    {
      name: 'Features',
      questions: [
        {
          question: 'How do I customize invoice templates?',
          answer: 'Navigate to Brand Settings where you can upload your logo, set colors, and modify payment terms.'
        },
        {
          question: 'Can I schedule recurring invoices?',
          answer: 'Yes! Set up recurring invoices for weekly, monthly, or custom intervals.'
        }
      ]
    },
    {
      name: 'Security',
      questions: [
        {
          question: 'Is my financial data secure?',
          answer: 'We use bank-grade 256-bit encryption and are GDPR compliant. All data is encrypted at rest and in transit.'
        },
        {
          question: 'Where is my data stored?',
          answer: 'Data is stored in secure AWS data centers with daily backups and 99.9% uptime SLA.'
        }
      ]
    }
  ]

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50/50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
          >
            Frequently Asked Questions
          </motion.h1>
          <p className="text-xl text-gray-600 mb-8">
            Find answers to common questions about InvoiceFlow
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search questions..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-4 text-gray-400" />
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, index) => (
              <motion.div 
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {category.name}
                </h2>
                <Accordion type="multiple" className="space-y-4">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem 
                      key={faqIndex} 
                      value={`item-${index}-${faqIndex}`}
                      className="bg-white rounded-lg border border-gray-200"
                    >
                      <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <span className="text-left font-medium text-gray-900">
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4 pt-2 text-gray-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                No results found for "{searchQuery}"
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Support CTA */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">
            Still have questions?
          </h2>
          <p className="text-indigo-100 mb-8 text-xl">
            Our support team is here to help
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="secondary" size="lg">
              Contact Support
            </Button>
            <Button className="bg-white text-indigo-600 hover:bg-gray-100" size="lg">
              Schedule Call
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}