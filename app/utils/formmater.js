export const formatCurrency = (value, currency = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }
  
  export const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-IN', options)
  }
  
  export const getStatusBadge = (status) => {
    const statusStyles = {
      paid: 'bg-emerald-100 text-emerald-800',
      pending: 'bg-amber-100 text-amber-800',
      overdue: 'bg-rose-100 text-rose-800'
    }
    return `${statusStyles[status]} px-2.5 py-1 rounded-full text-xs font-medium`
  }