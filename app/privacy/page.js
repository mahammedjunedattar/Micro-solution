export default function PrivacyPolicy() {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-6 italic">Last Updated: March 31, 2025</p>
  
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
          <p>To provide our invoice automation services, we collect:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Business Information:</strong> Your name, email, phone number</li>
            <li><strong>Client Details:</strong> Client names and phone numbers for payment reminders</li>
            <li><strong>Payment Data:</strong> Processed securely via Razorpay (we never store card details)</li>
          </ul>
        </section>
  
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. How We Use Your Data</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Generate and send invoices</li>
            <li>Automate payment reminders via WhatsApp/email</li>
            <li>Improve our services (analytics)</li>
          </ul>
        </section>
  
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. Data Security</h2>
          <p>We protect your data with:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>SSL encryption</li>
            <li>Regular security audits</li>
            <li>Role-based access controls</li>
          </ul>
        </section>
  
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Third-Party Services</h2>
          <p>
            We use Razorpay for payments. View their{" "}
            <a
              href="https://razorpay.com/privacy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              privacy policy
            </a>.
          </p>
        </section>
  
        <section>
          <h2 className="text-xl font-semibold mb-2">5. Your Rights</h2>
          <p>Contact us at <a href="mailto:your@email.com" className="text-blue-600 underline">your@email.com</a> to:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Request data deletion</li>
            <li>Export your data</li>
            <li>Opt-out of communications</li>
          </ul>
        </section>
      </div>
    );
  }
  