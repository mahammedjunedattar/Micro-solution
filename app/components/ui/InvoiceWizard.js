// components/InvoiceWizard.js
import { useDropzone } from 'react-dropzone';
import { useImmer } from 'use-immer';
import { Button } from './button/button';
import { parseCSV } from '@/app/utils/csvParser';
const BrandCustomizer = ({ settings, onChange }) => {
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="mb-8 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Brand Logo
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />
        {settings.logo && (
          <img src={settings.logo} alt="Brand Logo" className="mt-2 h-16" />
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Primary Color
        </label>
        <input
          type="color"
          value={settings.primaryColor}
          onChange={(e) => onChange({ primaryColor: e.target.value })}
          className="h-10 w-20 cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Terms
        </label>
        <select
          value={settings.paymentTerms}
          onChange={(e) => onChange({ paymentTerms: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option>Due 30 days after receipt</option>
          <option>Due on receipt</option>
          <option>Net 15</option>
          <option>Net 45</option>
        </select>
      </div>
    </div>
  );
};

const InvoicePreview = ({ client, brandSettings }) => {
  if (!client) return null;

  return (
    <div className="border rounded-lg p-6 mb-8" style={{ borderColor: brandSettings.primaryColor }}>
      <div className="flex justify-between items-start mb-6">
        {brandSettings.logo && (
          <img src={brandSettings.logo} alt="Company Logo" className="h-12" />
        )}
        <div>
          <h2 className="text-2xl font-bold" style={{ color: brandSettings.primaryColor }}>
            INVOICE
          </h2>
          <p className="text-gray-600">Date: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
          <p className="text-gray-600">{client.name}</p>
          <p className="text-gray-600">{client.email}</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Amount Due:</h3>
          <p className="text-2xl font-bold" style={{ color: brandSettings.primaryColor }}>
            ${client.amount.toFixed(2)}
          </p>
          <p className="text-gray-600">Due: {client.dueDate.toLocaleDateString()}</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <p className="text-gray-600">{brandSettings.paymentTerms}</p>
      </div>
    </div>
  );
};


export default function InvoiceWizard() {
  const [state, setState] = useImmer({
    step: 2,
    clients: [],
    brandSettings: {
      logo: null,
      primaryColor: '#4F46E5',
      paymentTerms: 'Due 30 days after receipt'
    }
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'text/csv': ['.csv'] },
    onDrop: files => handleCSVUpload(files[0])
  });

  const handleCSVUpload = async (file) => {
    if (!(file instanceof Blob)) {
        console.error('Uploaded file is not a valid CSV file.');
        return;
    }

    try {
        const csvData = await parseCSV(file);
        setState(draft => {
            draft.step = 2;
            draft.clients = csvData.map(client => ({
                ...client,
                amount: parseFloat(client.amount),
                dueDate: new Date(client.dueDate)
            }));
            draft.csvFile = file; // Store file for FormData
        });
    } catch (error) {
        console.error('Error parsing CSV:', error);
    }
};

const handleSendInvoices = async () => {
  try {
      const formData = new FormData();

      // Append necessary data
      formData.append('clients', JSON.stringify(state.clients));
      formData.append('brandSettings', JSON.stringify(state.brandSettings));

      // Ensure user data is added
      formData.append('user', JSON.stringify({
        _id: 'USER_ID', // Replace with dynamic value if available
        businessName: 'Your Business Name'  // Include other required fields
      }));

      const response = await fetch('/apis/invoice', {
          method: 'POST',
          body: formData, 
      });

      const result = await response.json();
      console.log('Invoice response:', result);
  } catch (error) {
      console.error('Error sending invoices:', error);
  }
};

  return (
    <div className="max-w-4xl mx-auto p-6">
      {state.step === 1 && (
        <div {...getRootProps()} className="border-2 border-dashed p-8 text-center">
          <input {...getInputProps()} />
          <p>Drag CSV file here or click to upload</p>
          <small>Required columns: name, email, amount, dueDate</small>
        </div>
      )}

      {state.step === 2 && (
        <div>
          <BrandCustomizer 
            settings={state.brandSettings}
            onChange={updates => setState(draft => {
              draft.brandSettings = { ...draft.brandSettings, ...updates }
            })}
          />
          
          <InvoicePreview 
            client={state.clients[0]} 
            brandSettings={state.brandSettings}
          />

          <div className="mt-8 flex gap-4">
            <Button onClick={() => setState(draft => { draft.step = 1 })}>
              Back
            </Button>
            <Button onClick={handleSendInvoices}>
              Send to {state.clients.length} Clients
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}