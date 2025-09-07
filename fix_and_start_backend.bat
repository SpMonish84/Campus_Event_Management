@echo off
echo Fixing and starting Event Management Backend...
echo.

REM Activate virtual environment
echo Activating virtual environment...
call D:\DEV\.venv\Scripts\activate.bat

REM Install required dependencies
echo Installing dependencies...
pip install fastapi==0.104.1 uvicorn[standard]==0.24.0 sqlalchemy==1.4.53 pydantic==2.5.0 python-multipart==0.0.6

REM Navigate to backend directory
cd /d D:\DEV\backend

REM Start the server
echo Starting FastAPI server on http://localhost:8000...
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

pause
