export default function TermsOfService() {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-500 mb-6 italic">Effective: March 31, 2025</p>
  
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Acceptance</h2>
          <p>By using <strong>[Your SaaS Name]</strong>, you agree to these terms.</p>
        </section>
  
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. Payments</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>All payments processed via Razorpay</li>
            <li>We charge ₹[X]/month after free trial</li>
            <li>No refunds for partial months</li>
          </ul>
        </section>
  
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. Prohibited Uses</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Creating fake invoices</li>
            <li>Spamming clients via our system</li>
            <li>Reverse-engineering our software</li>
          </ul>
        </section>
  
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Termination</h2>
          <p>We may suspend accounts for:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Payment failures</li>
            <li>Suspicious activity</li>
            <li>Terms violations</li>
          </ul>
        </section>
  
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. Limitation of Liability</h2>
          <p>We are not responsible for:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Payment gateway outages</li>
            <li>Client disputes over invoices</li>
            <li>Indirect damages from service use</li>
          </ul>
        </section>
  
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">6. Governing Law</h2>
          <p>These terms are governed by Indian law (Jurisdiction: <strong>[Your City]</strong>).</p>
        </section>
  
        <section>
          <p className="mt-6">
            Contact: <a href="mailto:your@email.com" className="text-blue-600 underline">your@email.com</a> | <span>[Your Phone]</span>
          </p>
        </section>
      </div>
    )
  }
  