import sys
import os

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app

app = create_app()

# This is necessary for Vercel serverless deployment
from flask import request

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return {
        "message": "Welcome to Invoice Generator API. Use /api/invoices endpoints to access the functionality."
    }

# For Vercel, we need to export the Flask app instance
app = app