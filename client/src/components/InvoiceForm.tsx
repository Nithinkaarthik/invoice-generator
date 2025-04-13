import React, { useState, useEffect } from 'react';
import LineItem from './LineItem';
import { Invoice, LineItem as LineItemType } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface InvoiceFormProps {
  onSave: (invoice: Invoice) => void;
  initialInvoice?: Invoice;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onSave, initialInvoice }) => {
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice>({
    client_name: '',
    items: [{ name: '', quantity: 1, rate: 0, total: 0 }],
    tax_percentage: 0,
    discount: 0,
    subtotal: 0,
    tax_amount: 0,
    final_total: 0
  });

  useEffect(() => {
    if (initialInvoice) {
      setInvoice(initialInvoice);
    }
  }, [initialInvoice]);

  useEffect(() => {
    calculateTotals();
  }, [invoice.items, invoice.tax_percentage, invoice.discount]);

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvoice({ ...invoice, client_name: e.target.value });
  };

  const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvoice({ ...invoice, tax_percentage: parseFloat(e.target.value) || 0 });
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvoice({ ...invoice, discount: parseFloat(e.target.value) || 0 });
  };

  const updateLineItem = (index: number, updatedItem: LineItemType) => {
    const updatedItems = [...invoice.items];
    updatedItems[index] = updatedItem;
    setInvoice({ ...invoice, items: updatedItems });
  };

  const addLineItem = () => {
    setInvoice({
      ...invoice,
      items: [
        ...invoice.items,
        { name: '', quantity: 1, rate: 0, total: 0 }
      ]
    });
  };

  const deleteLineItem = (index: number) => {
    if (invoice.items.length > 1) {
      const updatedItems = invoice.items.filter((_, i) => i !== index);
      setInvoice({ ...invoice, items: updatedItems });
    }
  };

  const calculateTotals = () => {
    const subtotal = invoice.items.reduce((sum, item) => sum + (item.total || 0), 0);
    const discount = invoice.discount || 0;
    const taxAmount = (subtotal - discount) * (invoice.tax_percentage / 100);
    const finalTotal = (subtotal - discount) + taxAmount;

    setInvoice({
      ...invoice,
      subtotal,
      tax_amount: taxAmount,
      final_total: finalTotal
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(invoice);
  };

  const handlePreview = () => {
    // Store invoice data in sessionStorage
    sessionStorage.setItem('previewInvoice', JSON.stringify(invoice));
    navigate('/preview');
  };

  return (
    <div className="invoice-form">
      <h2>Create New Invoice</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group client-info">
          <label htmlFor="client_name">Client Name</label>
          <input
            type="text"
            id="client_name"
            value={invoice.client_name}
            onChange={handleClientChange}
            className="form-control"
            required
          />
        </div>
        
        <div className="line-items-container">
          <div className="line-items-header">
            <div className="header-item">Description</div>
            <div className="header-item">Qty</div>
            <div className="header-item">Rate</div>
            <div className="header-item">Total</div>
            <div className="header-item"></div>
          </div>
          
          {invoice.items.map((item, index) => (
            <LineItem
              key={index}
              item={item}
              index={index}
              onUpdate={updateLineItem}
              onDelete={deleteLineItem}
            />
          ))}
          
          <button 
            type="button" 
            className="add-line-btn" 
            onClick={addLineItem}
          >
            Add Line Item
          </button>
        </div>
        
        <div className="invoice-summary">
          <div className="summary-row">
            <label>Subtotal:</label>
            <span>${invoice.subtotal?.toFixed(2)}</span>
          </div>
          
          <div className="summary-row">
            <label htmlFor="discount">Discount:</label>
            <input
              type="number"
              id="discount"
              name="discount"
              value={invoice.discount}
              onChange={handleDiscountChange}
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="summary-row">
            <label htmlFor="tax_percentage">Tax (%):</label>
            <input
              type="number"
              id="tax_percentage"
              name="tax_percentage"
              value={invoice.tax_percentage}
              onChange={handleTaxChange}
              min="0"
              step="0.01"
            />
          </div>
          
          <div className="summary-row">
            <label>Tax Amount:</label>
            <span>${invoice.tax_amount?.toFixed(2)}</span>
          </div>
          
          <div className="summary-row total">
            <label>Total:</label>
            <span>${invoice.final_total?.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="preview-btn" onClick={handlePreview}>
            Preview Invoice
          </button>
          <button type="submit" className="save-btn">
            Save Invoice
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;