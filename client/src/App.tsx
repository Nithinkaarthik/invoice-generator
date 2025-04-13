import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import CreateInvoice from './pages/CreateInvoice';
import PreviewInvoice from './pages/PreviewInvoice';
import InvoiceDetails from './pages/InvoiceDetails';
import InvoiceHistoryPage from './pages/InvoiceHistoryPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Invoice Generator</h1>
          <nav>
            <ul>
              <li>
                <Link to="/create">Create Invoice</Link>
              </li>
              <li>
                <Link to="/history">Invoice History</Link>
              </li>
            </ul>
          </nav>
        </header>
        
        <main className="App-content">
          <Routes>
            <Route path="/create" element={<CreateInvoice />} />
            <Route path="/preview" element={<PreviewInvoice />} />
            <Route path="/invoice/:id" element={<InvoiceDetails />} />
            <Route path="/history" element={<InvoiceHistoryPage />} />
            <Route path="/" element={<Navigate to="/create" replace />} />
          </Routes>
        </main>
        
        <footer className="App-footer">
          <p>© {new Date().getFullYear()} Invoice Generator App</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
