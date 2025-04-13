import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Invoice } from '../services/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface InvoicePreviewProps {
  invoice: Invoice;
  onClose: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, onClose }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  
  // Function to handle printing the invoice
  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `Invoice-${invoice.invoice_number}`,
  });

  // Function to export invoice as PDF
  const exportToPDF = () => {
    if (!invoiceRef.current) return;
    
    html2canvas(invoiceRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Invoice-${invoice.invoice_number}.pdf`);
    });
  };

  // Format date for display
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  return (
    <div className="invoice-preview-container">
      <div className="controls">
        <button type="button" onClick={() => handlePrint()} className="print-btn">Print</button>
        <button onClick={exportToPDF} className="export-btn">Export PDF</button>
        <button onClick={onClose} className="close-btn">Close</button>
      </div>
      
      <div className="invoice-preview" ref={invoiceRef}>
        <div className="invoice-header">
          <div className="company-info">
            <h2>INVOICE</h2>
            <p>Your Company Name</p>
            <p>123 Business Street</p>
            <p>City, State ZIP</p>
            <p>Phone: (555) 555-5555</p>
          </div>
          
          <div className="invoice-info">
            <table>
              <tbody>
                <tr>
                  <td className="label">Invoice Number:</td>
                  <td>{invoice.invoice_number}</td>
                </tr>
                <tr>
                  <td className="label">Date:</td>
                  <td>{formatDate(invoice.created_at)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="client-section">
          <h3>Bill To:</h3>
          <p className="client-name">{invoice.client_name}</p>
        </div>
        
        <div className="items-table">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.rate.toFixed(2)}</td>
                  <td>${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="invoice-summary">
          <table>
            <tbody>
              <tr>
                <td className="label">Subtotal:</td>
                <td className="amount">${invoice.subtotal?.toFixed(2)}</td>
              </tr>
              {invoice.discount > 0 && (
                <tr>
                  <td className="label">Discount:</td>
                  <td className="amount">-${invoice.discount.toFixed(2)}</td>
                </tr>
              )}
              {invoice.tax_percentage > 0 && (
                <tr>
                  <td className="label">Tax ({invoice.tax_percentage}%):</td>
                  <td className="amount">${invoice.tax_amount?.toFixed(2)}</td>
                </tr>
              )}
              <tr className="total-row">
                <td className="label">Total:</td>
                <td className="amount">${invoice.final_total?.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="invoice-footer">
          <p>Thank you for your business!</p>
          <p>Payment is due within 30 days from the date of this invoice.</p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;