// app/features/page.js
'use client'

import { motion } from 'framer-motion'
import { Button } from '../components/ui/button/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { useState } from 'react'

export default function FeaturesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(0)
  const templates = ['default', 'modern', 'minimalist']

  // Sample invoice data
  const invoiceData = {
    number: 'INV-001',
    date: new Date().toLocaleDateString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    from: {
      name: 'Your Business Name',
      email: 'billing@yourbusiness.com',
      address: '123 Business Street\nCity, Country'
    },
    to: {
      name: 'Client Name',
      email: 'client@company.com',
      address: '456 Client Avenue\nCity, Country'
    },
    items: [
      { description: 'Web Development Services', quantity: 10, price: 75.0 },
      { description: 'Consultation Hours', quantity: 5, price: 120.0 }
    ]
  }

  const InvoicePreview = () => {
    const subtotal = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
    const tax = subtotal * 0.1
    const total = subtotal + tax

    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-indigo-600">INVOICE</h2>
            <p className="text-gray-600">#{invoiceData.number}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Date: {invoiceData.date}</p>
            <p className="text-gray-600">Due: {invoiceData.dueDate}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">From:</h3>
            <p className="text-gray-600 whitespace-pre-line">{invoiceData.from.address}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">To:</h3>
            <p className="text-gray-600 whitespace-pre-line">{invoiceData.to.address}</p>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Qty</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Price</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-3 text-gray-600">{item.description}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-gray-600">${item.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right text-gray-600">${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <div className="w-64">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Tax (10%):</span>
              <span className="text-gray-900">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-semibold text-gray-900">Total:</span>
              <span className="font-semibold text-indigo-600">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <Button variant="outline" className="border-indigo-600 text-indigo-600">
            Edit Invoice
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            Send to Client
          </Button>
        </div>
      </motion.div>
    )
  }

  // ... (keep existing features array and other sections)
  const features = [
    {
      icon: '📄',
      title: 'Auto-Invoicing',
      items: [
        'Customizable branded templates',
        'Bulk client imports via CSV',
        'Recurring invoice scheduling',
        'Client portal access'
      ]
    },
    {
      icon: '⏰',
      title: 'Smart Reminders',
      items: [
        '3/7/14-day reminder workflows',
        'Multi-channel delivery (Email/SMS)',
        'Custom message templates',
        'Snooze functionality'
      ]
    },
    {
      icon: '📊',
      title: 'Payment Tracking',
      items: [
        'Real-time payment status',
        'Visual cash flow dashboard',
        'Exportable financial reports',
        'Tax-ready summaries'
      ]
    }
  ]


  return (
    <div className="min-h-screen bg-white">
      {/* ... (keep existing Hero and Features Grid sections) */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50/50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
          >
            Automate Your Business Operations
            <span className="block text-indigo-600 mt-2">Focus on Growth, Not Admin Work</span>
          </motion.h1>
        </div>
      </section>
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-xl bg-white shadow-lg border border-gray-200"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl">{feature.icon}</span>
                <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
              </div>
              <ul className="space-y-4">
                {feature.items.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-600">
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-indigo-600 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>


      {/* Interactive Demo Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            See It in Action
          </h2>
          
          <Tabs defaultValue="invoicing" className="w-full">
            <TabsList className="grid grid-cols-3 max-w-xl mx-auto mb-12">
              <TabsTrigger value="invoicing">Invoicing</TabsTrigger>
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            </TabsList>
            
            <TabsContent value="invoicing">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <div className="mb-6 flex gap-4">
                  {templates.map((template, index) => (
                    <Button
                      key={template}
                      variant={selectedTemplate === index ? 'default' : 'outline'}
                      onClick={() => setSelectedTemplate(index)}
                    >
                      {template.charAt(0).toUpperCase() + template.slice(1)}
                    </Button>
                  ))}
                </div>
                <InvoicePreview />
              </div>
            </TabsContent>

            {/* ... (keep other TabsContent sections) */}
          </Tabs>
        </div>
      </section>

      {/* ... (keep existing Pricing CTA section) */}
    </div>
  )
}