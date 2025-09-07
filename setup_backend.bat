@echo off
setlocal enabledelayedexpansion

:: Set paths
set BACKEND_DIR=%~dp0backend
set DB_DIR=%~dp0database
set DB_FILE=event_management_db.db

:: Create database directory if it doesn't exist
if not exist "%DB_DIR%" (
    echo Creating database directory...
    mkdir "%DB_DIR%"
)

:: Check if SQLite is available
where sqlite3 >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo SQLite3 is not in your PATH. Please install SQLite and add it to your PATH.
    exit /b 1
)

:: Check if database exists, if not create it
if not exist "%DB_DIR%\%DB_FILE%" (
    echo Creating new database...
    sqlite3 "%DB_DIR%\%DB_FILE%" "VACUUM;"
    
    echo Applying database schema...
    sqlite3 "%DB_DIR%\%DB_FILE%" < "%DB_DIR%\fix_database.sql"
    
    if %ERRORLEVEL% equ 0 (
        echo Database created and schema applied successfully.
    ) else (
        echo Failed to apply database schema.
        exit /b 1
    )
else
    echo Database already exists at %DB_DIR%\%DB_FILE%
)

echo.
echo Starting backend server...
cd /d "%BACKEND_DIR%"
python -m uvicorn simple_main:app --host 0.0.0.0 --port 8000 --reload
