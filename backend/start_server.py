#!/usr/bin/env python3
"""
Start the Event Management System backend server
"""
import subprocess
import sys
import os
from pathlib import Path

def start_server():
    """Start the FastAPI server"""
    try:
        # Change to backend directory
        backend_dir = Path(__file__).parent
        os.chdir(backend_dir)
        
        print("🚀 Starting Event Management System API...")
        print(f"📁 Backend Directory: {backend_dir}")
        print(f"🌐 Server will be available at: http://127.0.0.1:8000")
        print(f"📚 API Documentation: http://127.0.0.1:8000/docs")
        print("-" * 50)
        
        # Start uvicorn server
        cmd = [
            sys.executable, "-m", "uvicorn", 
            "simple_main:app", 
            "--host", "127.0.0.1", 
            "--port", "8000", 
            "--reload"
        ]
        
        subprocess.run(cmd, check=True)
        
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(start_server())
