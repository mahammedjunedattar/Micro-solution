import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js'

// ✅ Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function PaymentChart({ invoices }) {
  const chartData = {
    labels: ['Paid', 'Pending', 'Overdue'],
    datasets: [{
      label: 'Payment Status Distribution',
      data: [
        invoices.filter(i => i.status === 'paid').length,
        invoices.filter(i => i.status === 'pending').length,
        invoices.filter(i => i.status === 'overdue').length
      ],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
    }]
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <Bar 
        data={chartData} 
        options={{ 
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true }
          }
        }} 
      />
    </div>
  )
}
