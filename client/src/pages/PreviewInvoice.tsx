import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InvoicePreview from '../components/InvoicePreview';
import { Invoice } from '../services/api';

const PreviewInvoice: React.FC = () => {
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get invoice data from sessionStorage
    const storedInvoice = sessionStorage.getItem('previewInvoice');
    
    if (storedInvoice) {
      try {
        setInvoice(JSON.parse(storedInvoice));
      } catch (err) {
        console.error('Error parsing invoice data:', err);
        navigate('/create');
      }
    } else {
      // If no invoice data is found, redirect to create page
      navigate('/create');
    }
  }, [navigate]);

  const handleClose = () => {
    navigate('/create');
  };

  if (!invoice) {
    return <div className="loading">Loading invoice preview...</div>;
  }

  return (
    <div className="preview-page">
      <InvoicePreview invoice={invoice} onClose={handleClose} />
    </div>
  );
};

export default PreviewInvoice;