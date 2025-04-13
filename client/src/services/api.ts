import axios from 'axios';

// Define API base URL that works in both development and production
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

// Define interfaces for our data
export interface LineItem {
  name: string;
  quantity: number;
  rate: number;
  total: number;
}

export interface Invoice {
  _id?: string;
  client_name: string;
  items: LineItem[];
  tax_percentage: number;
  discount: number;
  subtotal?: number;
  tax_amount?: number;
  final_total?: number;
  invoice_number?: string;
  created_at?: Date;
}

// Create API service class
export const invoiceApi = {
  // Get all invoices
  getInvoices: async (): Promise<Invoice[]> => {
    const response = await axios.get(`${API_URL}/invoices/`);
    return response.data;
  },

  // Get invoices by client name
  getInvoicesByClient: async (clientName: string): Promise<Invoice[]> => {
    const response = await axios.get(`${API_URL}/invoices/?client=${clientName}`);
    return response.data;
  },

  // Get a specific invoice by ID
  getInvoiceById: async (id: string): Promise<Invoice> => {
    const response = await axios.get(`${API_URL}/invoices/${id}`);
    return response.data;
  },

  // Create a new invoice
  createInvoice: async (invoice: Invoice): Promise<any> => {
    try {
      console.log('API: Sending invoice data to server:', JSON.stringify(invoice));
      const response = await axios.post(`${API_URL}/invoices/`, invoice);
      console.log('API: Server response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API Error details:', error);
      
      // Extract error message from response if available
      if (axios.isAxiosError(error) && error.response) {
        console.error('Server error response:', error.response.data);
        
        if (error.response.data && error.response.data.error) {
          throw new Error(error.response.data.error);
        }
      }
      
      // If we couldn't extract a specific error message, throw a generic one
      throw new Error('Failed to save invoice. Please check your connection and try again.');
    }
  },

  // Generate PDF for an invoice
  generatePdf: async (id: string): Promise<any> => {
    const response = await axios.get(`${API_URL}/invoices/generate-pdf/${id}`);
    return response.data;
  }
};