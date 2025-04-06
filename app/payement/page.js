'use client'

import { useState, useEffect, useMemo } from 'react'
import { format } from 'date-fns'
import { Button } from '../components/ui/button/button'
import PaymentStatusBadge from '../components/PaymentStatusBadge'
import PaymentChart from '../components/PaymentChart'
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function PaymentTracker() {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('dueDate')
  const [searchQuery, setSearchQuery] = useState('')

  const { data, error, isLoading } = useSWR(
    `/api/invoices?filter=${filter}&sort=${sortBy}&search=${searchQuery}`,
    fetcher,
    { refreshInterval: 300000 }
  )

  const summary = useMemo(() => ({
    totalPending: data?.reduce((acc, inv) => acc + (inv.status === 'pending' ? inv.client.amount : 0), 0) || 0,
    totalOverdue: data?.filter(inv => inv.status === 'overdue').length || 0,
    avgPaymentTime: data?.filter(inv => inv.status === 'paid').length > 0 
      ? data.filter(inv => inv.status === 'paid')
          .reduce((acc, inv) => acc + (new Date(inv.paidAt) - new Date(inv.dueDate)) / (1000 * 3600 * 24), 0) 
          / data.filter(inv => inv.status === 'paid').length
      : 0
  }), [data]);

  const handleSendReminder = async (invoiceId) => {
    try {
      const response = await fetch('/apis/reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId })
      })
      alert('send')
      
      if (!response.ok) throw new Error('Failed to send reminder')
      
    } catch (err) {
      setError(err.message)
    } finally {
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Tracker</h1>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search invoices..."
            className="flex-1 p-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select className="p-2 border rounded-lg bg-white" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Invoices</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="paid">Paid</option>
          </select>
          <select className="p-2 border rounded-lg bg-white" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="dueDate">Sort by Due Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="client">Sort by Client</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-gray-500 text-sm mb-2">Pending Amount</h3>
            <div className="text-2xl font-bold text-amber-600">
  ₹{summary?.totalPending ? summary.totalPending.toLocaleString() : "0"}
</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-gray-500 text-sm mb-2">Overdue Invoices</h3>
            <div className="text-2xl font-bold text-rose-600">{summary.totalOverdue}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-gray-500 text-sm mb-2">Avg. Payment Delay</h3>
            <div className="text-2xl font-bold text-indigo-600">{summary.avgPaymentTime.toFixed(1)} days</div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <PaymentChart invoices={data || []} />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-gray-500">Loading payments...</div>
        ) : error ? (
          <div className="p-6 text-rose-600">Error loading payments: {error.message || 'Unknown error'}</div>
        ) : data?.length === 0 ? (
          <div className="p-6 text-gray-500">No invoices found</div>
        ) : (
          <div className="divide-y">
            {data?.map(invoice => (
              <div key={invoice._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <PaymentStatusBadge status={invoice.status} />
                      <div>
                        <h3 className="font-medium text-gray-900">{invoice.client.name}</h3>
                        <p className="text-sm text-gray-500">#{invoice.client.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 text-right sm:text-left">
                    <p className="font-medium text-gray-900">₹{invoice.client.amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Due {format(new Date(invoice.client.dueDate), 'MMM dd, yyyy')}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => window.open(`${process.env.NEXTAUTH_URL}/pay/${invoice._id}`, '_blank')}>
                      View
                    </Button>
                    {invoice.status !== 'paid' && (
                      <Button onClick={() => handleSendReminder(invoice._id)}>
                        Remind
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
