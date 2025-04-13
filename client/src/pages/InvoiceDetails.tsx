import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InvoicePreview from '../components/InvoicePreview';
import { Invoice, invoiceApi } from '../services/api';

const InvoiceDetails: React.FC = () => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchInvoice(id);
    }
  }, [id]);

  const fetchInvoice = async (invoiceId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await invoiceApi.getInvoiceById(invoiceId);
      setInvoice(data);
    } catch (err) {
      console.error('Error fetching invoice:', err);
      setError('Failed to load invoice. It may have been deleted or there was a server error.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/history');
  };

  if (isLoading) {
    return <div className="loading">Loading invoice...</div>;
  }

  if (error || !invoice) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error || 'Invoice not found'}</p>
        <button onClick={() => navigate('/history')} className="back-btn">
          Back to Invoice History
        </button>
      </div>
    );
  }

  return (
    <div className="invoice-details-page">
      <InvoicePreview invoice={invoice} onClose={handleClose} />
    </div>
  );
};

export default InvoiceDetails;