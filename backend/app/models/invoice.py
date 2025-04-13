import datetime
import sys
import traceback
from bson import ObjectId
from config.db import get_database

class Invoice:
    def __init__(self, client_name, items, tax_percentage=0, discount=0, invoice_number=None):
        self.client_name = client_name
        self.items = items  # List of dictionaries: [{name, quantity, rate, total}, ...]
        self.tax_percentage = tax_percentage
        self.discount = discount
        self.created_at = datetime.datetime.now()
        self.invoice_number = invoice_number or self._generate_invoice_number()
        self._calculate_totals()
        
    def _calculate_totals(self):
        """Calculate subtotal, tax amount, and final total"""
        self.subtotal = sum(item.get('total', 0) for item in self.items)
        self.discount_amount = self.discount
        self.tax_amount = (self.subtotal - self.discount_amount) * (self.tax_percentage / 100)
        self.final_total = (self.subtotal - self.discount_amount) + self.tax_amount
    
    def _generate_invoice_number(self):
        """Generate auto-incrementing invoice number"""
        db = get_database()
        if db is None:
            return "INV-001"  # Fallback if DB connection fails
            
        # Get the latest invoice number from database
        latest_invoice = db.invoices.find_one(
            sort=[("invoice_number", -1)]
        )
        
        if not latest_invoice:
            return "INV-001"
            
        # Extract the numeric part and increment
        try:
            latest_num = int(latest_invoice['invoice_number'].split('-')[1])
            new_num = latest_num + 1
            return f"INV-{new_num:03d}"
        except (IndexError, ValueError):
            return "INV-001"
            
    def to_dict(self):
        """Convert invoice object to dictionary"""
        return {
            "client_name": self.client_name,
            "items": self.items,
            "tax_percentage": self.tax_percentage,
            "discount": self.discount,
            "subtotal": self.subtotal,
            "tax_amount": self.tax_amount,
            "final_total": self.final_total,
            "invoice_number": self.invoice_number,
            "created_at": self.created_at.isoformat() if hasattr(self.created_at, 'isoformat') else self.created_at
        }
        
    @classmethod
    def from_dict(cls, data):
        """Create invoice object from dictionary"""
        invoice = cls(
            client_name=data.get('client_name'),
            items=data.get('items', []),
            tax_percentage=data.get('tax_percentage', 0),
            discount=data.get('discount', 0),
            invoice_number=data.get('invoice_number')
        )
        
        # Override automatically calculated fields if they exist in data
        if 'created_at' in data:
            invoice.created_at = data['created_at']
            
        return invoice
        
    @staticmethod
    def save(invoice_data):
        """Save invoice to database"""
        try:
            db = get_database()
            if db is None:
                print("ERROR: Failed to get database connection", file=sys.stderr)
                return None
                
            # Check for required fields
            if not invoice_data.get('client_name'):
                print("ERROR: Missing required field 'client_name'", file=sys.stderr)
                raise ValueError("Missing required field: client_name")
                
            if not invoice_data.get('items') or len(invoice_data.get('items', [])) == 0:
                print("ERROR: Invoice must have at least one item", file=sys.stderr)
                raise ValueError("Invoice must have at least one item")
            
            print(f"Attempting to save invoice for client: {invoice_data.get('client_name')}")
            
            # Ensure all numeric values are actually numbers and not strings
            if 'tax_percentage' in invoice_data and not isinstance(invoice_data['tax_percentage'], (int, float)):
                try:
                    invoice_data['tax_percentage'] = float(invoice_data['tax_percentage'])
                except ValueError:
                    invoice_data['tax_percentage'] = 0
                    
            if 'discount' in invoice_data and not isinstance(invoice_data['discount'], (int, float)):
                try:
                    invoice_data['discount'] = float(invoice_data['discount'])
                except ValueError:
                    invoice_data['discount'] = 0
                    
            if 'subtotal' in invoice_data and not isinstance(invoice_data['subtotal'], (int, float)):
                try:
                    invoice_data['subtotal'] = float(invoice_data['subtotal'])
                except ValueError:
                    invoice_data['subtotal'] = 0
                    
            if 'tax_amount' in invoice_data and not isinstance(invoice_data['tax_amount'], (int, float)):
                try:
                    invoice_data['tax_amount'] = float(invoice_data['tax_amount'])
                except ValueError:
                    invoice_data['tax_amount'] = 0
                    
            if 'final_total' in invoice_data and not isinstance(invoice_data['final_total'], (int, float)):
                try:
                    invoice_data['final_total'] = float(invoice_data['final_total'])
                except ValueError:
                    invoice_data['final_total'] = 0
                    
            # Ensure items have proper numeric values
            for item in invoice_data.get('items', []):
                if 'quantity' in item and not isinstance(item['quantity'], (int, float)):
                    try:
                        item['quantity'] = float(item['quantity'])
                    except ValueError:
                        item['quantity'] = 0
                        
                if 'rate' in item and not isinstance(item['rate'], (int, float)):
                    try:
                        item['rate'] = float(item['rate'])
                    except ValueError:
                        item['rate'] = 0
                        
                if 'total' in item and not isinstance(item['total'], (int, float)):
                    try:
                        item['total'] = float(item['total'])
                    except ValueError:
                        item['total'] = 0
            
            # Log the final data being sent to MongoDB
            print(f"Final invoice data to be saved: {invoice_data}")
            
            # Attempt to insert into MongoDB
            try:
                result = db.invoices.insert_one(invoice_data)
                print(f"Invoice saved successfully with ID: {result.inserted_id}")
                return str(result.inserted_id)
            except Exception as e:
                print(f"MongoDB insert_one error: {e}", file=sys.stderr)
                print("This may be due to schema validation or data type issues.", file=sys.stderr)
                return None
                
        except Exception as e:
            print(f"ERROR saving invoice: {e}", file=sys.stderr)
            print(traceback.format_exc(), file=sys.stderr)
            return None
        
    @staticmethod
    def find_all():
        """Get all invoices from database"""
        db = get_database()
        if db is None:
            return []
            
        invoices = list(db.invoices.find().sort("created_at", -1))
        # Convert ObjectId to string for JSON serialization
        for invoice in invoices:
            invoice['_id'] = str(invoice['_id'])
        return invoices
        
    @staticmethod
    def find_by_id(invoice_id):
        """Find invoice by ID"""
        try:
            print(f"Looking for invoice with ID: {invoice_id}")
            db = get_database()
            if db is None:
                print("ERROR: Failed to get database connection", file=sys.stderr)
                return None
                
            try:
                # Try to convert the ID to ObjectId
                obj_id = ObjectId(invoice_id)
                print(f"Converted to ObjectId: {obj_id}")
            except Exception as e:
                print(f"ERROR: Invalid ObjectId format: {e}", file=sys.stderr)
                print(f"Received ID: {invoice_id}, Type: {type(invoice_id)}", file=sys.stderr)
                return None
                
            # Try to find the document
            invoice = db.invoices.find_one({"_id": obj_id})
            if invoice:
                invoice['_id'] = str(invoice['_id'])
                print(f"Found invoice: {invoice['invoice_number']} for {invoice['client_name']}")
            else:
                print(f"No invoice found with ID: {invoice_id}", file=sys.stderr)
                
            return invoice
        except Exception as e:
            print(f"ERROR retrieving invoice: {e}", file=sys.stderr)
            print(traceback.format_exc(), file=sys.stderr)
            return None
            
    @staticmethod
    def find_by_client(client_name):
        """Find invoices by client name"""
        db = get_database()
        if db is None:
            return []
            
        invoices = list(db.invoices.find({"client_name": {"$regex": client_name, "$options": "i"}}).sort("created_at", -1))
        for invoice in invoices:
            invoice['_id'] = str(invoice['_id'])
        return invoices