from app import create_app
from config.db import get_database
import sys

# Test database connection at startup
print("Testing database connection...")
db = get_database()
if db is None:
    print("ERROR: Failed to connect to MongoDB. Check your connection string and network settings.", file=sys.stderr)
    print("The application will start, but database operations will fail.", file=sys.stderr)
else:
    print("MongoDB connection test successful!")

app = create_app()

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)