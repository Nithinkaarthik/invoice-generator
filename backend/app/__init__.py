from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configure application
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
    app.config['DEBUG'] = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    # Initialize extensions
    CORS(app)
    JWTManager(app)
    
    # Register blueprints
    from app.routes.invoice_routes import invoice_bp
    app.register_blueprint(invoice_bp, url_prefix='/api/invoices')
    
    return app