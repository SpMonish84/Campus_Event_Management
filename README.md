# Campus Event Management System

A comprehensive event management system designed for educational institutions to manage campus events, student registrations, and administrative tasks.

### ✅ Completed Components
- **Database**: Robust SQLite database with comprehensive schema
- **Backend API**: Complete REST API with FastAPI
- **Core Features**:
  - Multi-tenant college management
  - Event management and registration
  - Attendance tracking
  - User authentication
  - Feedback system


## 🏗️ Architecture

### Backend (Python/FastAPI)
- **Framework**: FastAPI with Python 3.8+
- **Database**: SQLite with comprehensive schema
- **API**: RESTful endpoints with OpenAPI documentation
- **Key Features**:
  - Multi-tenant architecture
  - Event lifecycle management
  - Role-based access control
  - Data validation with Pydantic

### Frontend (React/TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS 3.0+
- **State Management**: React Context API
- **Routing**: React Router v6
- **Build Tool**: Vite

### Database Schema
- **Colleges**: Multi-tenant support with status tracking
- **Users**: Students, teachers, and administrators
- **Events**: Full event lifecycle management
- **Registrations**: Student enrollment tracking
- **Attendance**: Comprehensive attendance system
- **Feedback**: Event feedback and ratings

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- SQLite3

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/SpMonish84/Campus_Event_Management.git
cd Campus_Event_Management/backend

# Install dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn simple_main:app 
# or use the batch file on Windows
# .\start_backend.bat
```

### Frontend Setup
```bash
# From the project root
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Database
- The SQLite database is automatically created in the `database/` directory
- Sample data can be loaded using the `add_sample_data.py` script

## 📁 Project Structure
```
.
├── backend/                    # FastAPI backend
│   ├── src/                   # Source code
│   ├── start_server.py        # Server startup script
│   ├── requirements.txt       # Python dependencies
│   └── add_sample_data.py     # Database seeding script
│
├── frontend/                  # React frontend
│   ├── public/               # Static assets
│   └── src/                  # Source code
│       ├── components/       # Reusable UI components
│       ├── contexts/         # React contexts
│       ├── pages/            # Page components
│       └── services/         # API services
│
├── database/                  # Database files
│   ├── event_management.db   # SQLite database
│   └── fix_database.sql      # Database schema
│
├── .gitignore
└── README.md                 # This file
```

## 🔧 Features

### For Students
- 📅 Browse and register for events
- 📊 View personal event calendar
- ✅ Track attendance history
- 💬 Submit event feedback
- 👤 Manage personal profile

### For Teachers
- 🎯 Create and manage events
- 👥 Manage student registrations
- 📝 Take attendance
- 📈 View event analytics
- 📤 Export attendance reports

### For Administrators
- 🏫 Multi-college management
- 👥 User role management
- 📊 System analytics dashboard
- ⚙️ System configuration
- 🔄 Database maintenance tools

## 🗃️ Database Features

- **Multi-tenant Architecture**: Support for multiple colleges with data isolation
- **Data Integrity**: Comprehensive constraints and validations
- **Automation**: Triggers for maintaining data consistency
- **Performance**: Indexed queries for fast data retrieval
- **Backup & Recovery**: Easy backup and restore functionality

### Development Setup
1. Set up Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r backend/requirements.txt
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

**Repository**:(https://github.com/SpMonish84/Campus_Event_Management)
