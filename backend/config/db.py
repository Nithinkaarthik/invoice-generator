import os
import sys
from pymongo import MongoClient
from pymongo.errors import OperationFailure, ServerSelectionTimeoutError
from dotenv import load_dotenv
import traceback

load_dotenv()

# MongoDB connection
def get_database():
    try:
        mongo_uri = os.environ.get('MONGODB_URI')
        if not mongo_uri:
            print("ERROR: MONGODB_URI environment variable is not set or empty", file=sys.stderr)
            return None
            
        print(f"Connecting to MongoDB with URI beginning with: {mongo_uri[:20]}...")
        client = MongoClient(mongo_uri, 
                            serverSelectionTimeoutMS=5000,
                            connectTimeoutMS=5000)
        
        # Test the connection
        client.admin.command('ping')
        print("MongoDB connection successful!")
        
        db = client.invoice_generator
        return db
    except OperationFailure as e:
        print(f"Authentication error: {e}", file=sys.stderr)
        print("\nPlease check your MongoDB username and password in the .env file.", file=sys.stderr)
        print("You may need to create a new database user in MongoDB Atlas.", file=sys.stderr)
        return None
    except ServerSelectionTimeoutError as e:
        print(f"Server selection timeout: {e}", file=sys.stderr)
        print("\nPlease check your network connection and ensure your IP is whitelisted in MongoDB Atlas.", file=sys.stderr)
        return None
    except Exception as e:
        print(f"ERROR connecting to MongoDB: {e}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        return None