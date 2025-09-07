@echo off
echo Starting Event Management System Backend...
call .venv\Scripts\activate.bat
cd backend
pip install fastapi uvicorn pydantic python-multipart sqlalchemy email-validator
python main.py
pause
