'use client'
import { useState, useEffect } from 'react'
import { Loader2, MessageSquareText, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from './ui/button/button'

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [sendingId, setSendingId] = useState(null) // Tracks the specific invoice being sent
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('/apis/getinvoices')
        if (!response.ok) throw new Error('Failed to load invoices')
        
        const data = await response.json()
        if (!data || data.length === 0) {
          setError('No invoices found.')
          return
        }

        setInvoices(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchInvoices()
  }, [])

  const sendReminder = async (invoiceId) => {
    setSendingId(invoiceId)
    setError('')
    try {
      const response = await fetch('/apis/reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId })
      })
      
      if (!response.ok) throw new Error('Failed to send reminder')
      
      setInvoices((prevInvoices) =>
        prevInvoices.map(invoice =>
          invoice._id === invoiceId
            ? {
                ...invoice,
                reminders: [
                  ...invoice.reminders,
                  { channel: 'whatsapp', status: 'sent', sentAt: new Date() }
                ]
              }
            : invoice
        )
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setSendingId(null)
    }
  }
  console.log(invoices)


  if (loading) return <div className="text-center py-8"><Loader2 className="animate-spin" /></div>
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Outstanding Invoices</h1>
        <p className="text-gray-600">Send WhatsApp payment reminders to clients</p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3 text-left">Due Date</th>
              <th className="px-4 py-3 text-left">Reminders</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{invoice.client.name}</td>
                <td className="px-4 py-3 text-right">${invoice.amount.toFixed(2)}</td>
                <td className="px-4 py-3">
                  {new Date(invoice.dueDate).toLocaleDateString()}
                  {new Date(invoice.dueDate) < new Date() && (
                    <span className="ml-2 text-red-600">Overdue</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {invoice.reminders.map((reminder, index) => (
                      <span 
                        key={index}
                        className={`p-1 rounded ${
                          reminder.status === 'sent' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {reminder.status === 'sent' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button 
                    variant="outline" 
                    onClick={() => sendReminder(invoice._id)}
                    disabled={sendingId === invoice._id} // Show spinner only for the active invoice
                  >
                    {sendingId === invoice._id ? (
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    ) : (
                      <MessageSquareText className="mr-2 h-4 w-4" />
                    )}
                    {sendingId === invoice._id ? 'Sending...' : 'Send Reminder'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
