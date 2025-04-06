export default function PaymentStatusBadge({ status }) {
    const statusConfig = {
      paid: { color: 'bg-emerald-100 text-emerald-800', label: 'Paid' },
      pending: { color: 'bg-amber-100 text-amber-800', label: 'Pending' },
      overdue: { color: 'bg-rose-100 text-rose-800', label: 'Overdue' },
      default: { color: 'bg-gray-100 text-gray-800', label: 'Unknown' } // 👈 Default case
    };
  
    const { color, label } = statusConfig[status] || statusConfig.default; // 👈 Use default if status is invalid
  
    return (
      <span className={`${color} px-2.5 py-1 rounded-full text-xs font-medium`}>
        {label}
      </span>
    );
  }
  