from pymongo import MongoClient
import os
from dotenv import load_dotenv
import sys

load_dotenv()

def test_connection():
    try:
        # Get the connection string from environment variables
        mongo_uri = os.environ.get('MONGODB_URI')
        if not mongo_uri:
            print("ERROR: MONGODB_URI environment variable is not set")
            return False
            
        print(f"Testing connection to MongoDB with URI starting with: {mongo_uri[:20]}...")
        
        # Create a client and check the connection
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        
        # Force a connection to verify credentials
        client.admin.command('ping')
        
        print("Connection successful!")
        print(f"Available databases: {client.list_database_names()}")
        
        # Try to access the specific database
        db = client.invoice_generator
        print(f"Collections in invoice_generator: {db.list_collection_names()}")
        
        return True
    except Exception as e:
        print(f"ERROR: Failed to connect to MongoDB: {e}", file=sys.stderr)
        return False

if __name__ == "__main__":
    success = test_connection()
    if success:
        print("MongoDB connection test passed!")
    else:
        print("MongoDB connection test failed!")
        print("\nTroubleshooting tips:")
        print("1. Double-check your username and password")
        print("2. Ensure your IP address is whitelisted in MongoDB Atlas")
        print("3. Check that your MongoDB Atlas cluster is active")
        print("4. Try creating a new database user with a simple password")
