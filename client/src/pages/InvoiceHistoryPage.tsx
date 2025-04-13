import React from 'react';
import InvoiceHistory from '../components/InvoiceHistory';

const InvoiceHistoryPage: React.FC = () => {
  return (
    <div className="invoice-history-page">
      <h1>Invoice History</h1>
      <InvoiceHistory />
    </div>
  );
};

export default InvoiceHistoryPage;