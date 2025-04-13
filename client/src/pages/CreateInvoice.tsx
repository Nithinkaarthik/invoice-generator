import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InvoiceForm from '../components/InvoiceForm';
import { Invoice, invoiceApi } from '../services/api';

const CreateInvoice: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveInvoice = async (invoice: Invoice) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Log the invoice data to help with debugging
      console.log('Attempting to save invoice:', JSON.stringify(invoice, null, 2));
      
      const response = await invoiceApi.createInvoice(invoice);
      
      // Navigate to the invoice details page after successful creation
      navigate(`/invoice/${response.invoice_id}`);
    } catch (err: any) {
      // Enhanced error logging and display
      console.error('Error saving invoice:', err);
      
      // Show more specific error message to the user if available
      const errorMessage = err.message || 'An error occurred while saving the invoice. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-invoice-page">
      <h1>Create New Invoice</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {isLoading ? (
        <div className="loading">Saving invoice...</div>
      ) : (
        <InvoiceForm onSave={handleSaveInvoice} />
      )}
    </div>
  );
};

export default CreateInvoice;