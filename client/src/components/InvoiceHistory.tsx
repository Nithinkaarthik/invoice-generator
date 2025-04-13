import React, { useState, useEffect } from 'react';
import { Invoice, invoiceApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

const InvoiceHistory: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'client_name' | 'created_at'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load invoices on component mount
  useEffect(() => {
    fetchInvoices();
  }, []);

  // Filter and sort invoices when dependencies change
  useEffect(() => {
    filterAndSortInvoices();
  }, [searchTerm, sortField, sortDirection, invoices]);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const fetchedInvoices = await invoiceApi.getInvoices();
      setInvoices(fetchedInvoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortInvoices = () => {
    // First filter by search term
    let filtered = [...invoices];
    
    if (searchTerm) {
      filtered = filtered.filter(invoice => 
        invoice.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Then sort by the selected field and direction
    filtered.sort((a, b) => {
      if (sortField === 'client_name') {
        const nameA = a.client_name.toLowerCase();
        const nameB = b.client_name.toLowerCase();
        
        if (sortDirection === 'asc') {
          return nameA > nameB ? 1 : -1;
        } else {
          return nameA < nameB ? 1 : -1;
        }
      } else {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        
        if (sortDirection === 'asc') {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      }
    });
    
    setFilteredInvoices(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (field: 'client_name' | 'created_at') => {
    if (field === sortField) {
      // Toggle sort direction if clicking on the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending direction
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const viewInvoice = (id: string | undefined) => {
    if (id) {
      navigate(`/invoice/${id}`);
    }
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString();
  };

  return (
    <div className="invoice-history">
      <h2>Invoice History</h2>
      
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search by client name or invoice number..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      
      {isLoading ? (
        <div className="loading">Loading invoices...</div>
      ) : filteredInvoices.length === 0 ? (
        <div className="no-invoices">No invoices found.</div>
      ) : (
        <div className="invoice-table">
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th 
                  className={sortField === 'client_name' ? `sorted ${sortDirection}` : ''}
                  onClick={() => handleSortChange('client_name')}
                >
                  Client Name
                  {sortField === 'client_name' && (
                    <span className="sort-icon">
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </th>
                <th 
                  className={sortField === 'created_at' ? `sorted ${sortDirection}` : ''}
                  onClick={() => handleSortChange('created_at')}
                >
                  Date
                  {sortField === 'created_at' && (
                    <span className="sort-icon">
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td>{invoice.invoice_number}</td>
                  <td>{invoice.client_name}</td>
                  <td>{formatDate(invoice.created_at)}</td>
                  <td>${invoice.final_total?.toFixed(2)}</td>
                  <td>
                    <button 
                      className="view-btn"
                      onClick={() => viewInvoice(invoice._id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InvoiceHistory;