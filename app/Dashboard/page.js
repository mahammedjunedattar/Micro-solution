// app/dashboard/page.js
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart } from '@tremor/react'
import { Button } from '../components/ui/button/button'
import InvoiceWizard from '../components/ui/InvoiceWizard'
import { formatCurrency, formatDate, getStatusBadge } from '../utils/formmater'
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())
function MetricSkeleton() {
  return (
    <div className="bg-gray-200 animate-pulse p-6 rounded-xl shadow-sm border border-gray-300 h-24" />
  );
}

export default function Dashboard() {
  const [showWizard, setShowWizard] = useState(false)
  
  // API Data Fetching
  const { data: metricsData, error: metricsError } = useSWR(
    `${process.env.NEXTAUTH_URL}/apis/metrics`, 
    fetcher
  )

  const { data: invoicesData, error: invoicesError } = useSWR(
    `${process.env.NEXTAUTH_URL}/apis/invoices`, 
    fetcher
  )

  const { data: chartData, error: chartError } = useSWR(
    `${process.env.NEXTAUTH_URL}/apis/chart-data`, 
    fetcher
  )

  // Derived state
  const metrics = [
    { 
      name: 'Total Unpaid', 
      value: formatCurrency(metricsData?.total_unpaid || 0),
      change: '+12.5%' 
    },
    // ... other metrics
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Button onClick={() => setShowWizard(true)}>
          + New Invoice
        </Button>
      </div>
      {showWizard && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
          <div className="max-w-4xl mx-auto mt-12 bg-white rounded-lg p-6">
            <InvoiceWizard onClose={() => setShowWizard(false)} />
          </div>
        </div>
      )}


      {/* Error Handling */}
      {metricsError && (
        <div className="bg-rose-50 text-rose-700 p-4 rounded-lg mb-4">
          Failed to load metrics
        </div>
      )}

      {/* Loading States */}
      {!metricsData && !metricsError && (
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[1,2,3,4].map((i) => <MetricSkeleton key={i} />)}
        </div>
      )}

      {/* Real Data */}
      {metricsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            >
              <h3 className="text-gray-500 text-sm mb-2">{metric.name}</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {metric.value}
                </span>
                <span className="text-sm text-emerald-600">
                  {metric.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Recent Invoices with Real Data */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Recent Invoices</h2>
        <div className="space-y-4">
          {invoicesData?.map((invoice) => (
            <div key={invoice.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div>
                <p className="font-medium text-gray-900">{invoice.clientName}</p>
                <p className="text-sm text-gray-500">{invoice._id}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  {formatCurrency(invoice.amount)}
                </p>
                <span className={getStatusBadge(invoice.status)}>
                  {invoice.status}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  Due {formatDate(invoice.dueDate)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Chart Section */}
<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-8">
  <h2 className="text-lg font-semibold mb-4">Invoice Trends</h2>
  
  {chartError && (
    <div className="bg-rose-50 text-rose-700 p-4 rounded-lg">
      Failed to load chart data
    </div>
  )}

  {!chartData && !chartError && (
    <div className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
  )}

  {chartData && (
    <BarChart
      data={chartData}
      index="month"
      categories={["paid", "overdue"]}
      colors={["green", "red"]}
      yAxisWidth={60}
    />
  )}
</div>

    </div>
    
  )
}