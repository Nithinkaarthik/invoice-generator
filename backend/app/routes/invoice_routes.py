from flask import Blueprint, request, jsonify
from app.models.invoice import Invoice
import json
import traceback
import sys
from bson.json_util import dumps

invoice_bp = Blueprint('invoices', __name__)

@invoice_bp.route('/', methods=['POST'])
def create_invoice():
    """Create a new invoice"""
    try:
        data = request.json
        print(f"Received invoice creation request for client: {data.get('client_name', 'unknown')}")
        
        # Validate required fields
        if not data.get('client_name'):
            return jsonify({"error": "Client name is required"}), 400
            
        if not data.get('items') or len(data.get('items', [])) == 0:
            return jsonify({"error": "At least one item is required"}), 400
            
        # Create Invoice object
        invoice = Invoice(
            client_name=data.get('client_name'),
            items=data.get('items', []),
            tax_percentage=data.get('tax_percentage', 0),
            discount=data.get('discount', 0)
        )
        
        # Save to database
        invoice_dict = invoice.to_dict()
        print("Saving invoice to database...")
        invoice_id = Invoice.save(invoice_dict)
        
        if not invoice_id:
            print("Failed to save invoice - database error", file=sys.stderr)
            return jsonify({"error": "Failed to save invoice - database error"}), 500
            
        print(f"Invoice created successfully with ID: {invoice_id}")
        # Use json.loads(dumps()) pattern to convert MongoDB objects to JSON-serializable format
        return json.loads(dumps({
            "message": "Invoice created successfully",
            "invoice_id": invoice_id,
            "invoice": invoice_dict
        })), 201
        
    except ValueError as ve:
        print(f"Validation error: {str(ve)}", file=sys.stderr)
        return jsonify({"error": str(ve)}), 400
        
    except Exception as e:
        print(f"Error creating invoice: {str(e)}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@invoice_bp.route('/', methods=['GET'])
def get_invoices():
    """Get all invoices or filter by client name"""
    try:
        client_name = request.args.get('client')
        
        if client_name:
            invoices = Invoice.find_by_client(client_name)
        else:
            invoices = Invoice.find_all()
            
        return json.loads(dumps(invoices)), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@invoice_bp.route('/<invoice_id>', methods=['GET'])
def get_invoice(invoice_id):
    """Get a specific invoice by ID"""
    try:
        invoice = Invoice.find_by_id(invoice_id)
        
        if not invoice:
            return jsonify({"error": "Invoice not found"}), 404
            
        return json.loads(dumps(invoice)), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@invoice_bp.route('/generate-pdf/<invoice_id>', methods=['GET'])
def generate_pdf(invoice_id):
    """Generate PDF for an invoice"""
    try:
        invoice = Invoice.find_by_id(invoice_id)
        
        if not invoice:
            return jsonify({"error": "Invoice not found"}), 404
        
        # In a real application, you would generate a PDF here
        # For now, we'll just return a success message
        return json.loads(dumps({
            "message": "PDF generation endpoint (implement with pdfkit)",
            "invoice": invoice
        })), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500