# Invoice Generator Application

A full-featured invoice generator application with React frontend, Flask backend, and MongoDB Atlas integration.

## Features

- **Invoice Creation**: Create professional invoices with client information, line items, tax, and discount calculations
- **Dynamic Calculations**: Auto-calculate subtotals, tax amounts, and final totals
- **Invoice Preview**: View formatted invoices in a professional layout before saving
- **Invoice History**: Access and search saved invoices by client name or date
- **Export Options**: Print invoices or export as PDF
- **Auto-Incrementing Invoice Numbers**: Automatically generate sequential invoice numbers

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Flask (Python)
- **Database**: MongoDB Atlas
- **PDF Generation**: jsPDF and html2canvas
- **Styling**: Custom CSS

## Project Structure

- `/client` - React frontend application
- `/backend` - Flask backend API

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows: `venv\Scripts\activate`
   - On macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Update the MongoDB connection string in `.env` file with your own credentials:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. Run the backend server:
   ```
   python run.py
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Access the application at `http://localhost:3000`

## API Endpoints

- `GET /api/invoices/` - Get all invoices or filter by client name
- `GET /api/invoices/<id>` - Get a specific invoice by ID
- `POST /api/invoices/` - Create a new invoice
- `GET /api/invoices/generate-pdf/<id>` - Generate a PDF for a specific invoice

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request#   I n v o i c e _ G e n e r a t o r  
 #   I n v o i c e _ G e n e r a t o r  
 #   I n v o i c e  
 #   i n v o i c e - g e n e r a t o r  
 