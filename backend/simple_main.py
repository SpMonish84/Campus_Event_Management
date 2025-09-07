#!/usr/bin/env python3
"""
Minimal FastAPI application for Event Management System.
"""
import sqlite3
from pathlib import Path
from typing import List, Dict, Any, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Database configuration
DATABASE_PATH = Path(__file__).parent.parent / "database" / "event_management_db.db"

# FastAPI app
app = FastAPI(
    title="Event Management System API",
    description="Minimal FastAPI backend for event management",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db_connection():
    """Get database connection with error handling."""
    if not DATABASE_PATH.exists():
        raise HTTPException(status_code=500, detail="Database file not found")
    
    conn = sqlite3.connect(str(DATABASE_PATH))
    conn.row_factory = sqlite3.Row  # Enable column access by name
    return conn


def row_to_dict(row) -> Optional[Dict[str, Any]]:
    """Convert SQLite row to dictionary."""
    return dict(row) if row else None


def rows_to_list(rows) -> List[Dict[str, Any]]:
    """Convert SQLite rows to list of dictionaries."""
    return [dict(row) for row in rows]

# Root endpoints
@app.get("/")
async def root():
    return {
        "message": "Event Management System API", 
        "database_path": str(DATABASE_PATH),
        "docs_url": "/docs",
        "health_url": "/health"
    }

@app.get("/health")
async def health_check():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT COUNT(*) as count FROM EventTypes")
        result = cursor.fetchone()
        conn.close()
        
        return {
            "status": "healthy", 
            "database_connected": True,
            "database_path": str(DATABASE_PATH),
            "event_types_count": result['count']
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database_connected": False,
            "error": str(e)
        }

# Event Types endpoints
@app.get("/event-types")
async def get_event_types():
    """Get all event types"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM EventTypes")
        event_types = rows_to_list(cursor.fetchall())
        conn.close()
        return event_types
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/event-types/{type_id}")
async def get_event_type(type_id: int):
    """Get event type by ID"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM EventTypes WHERE type_id = ?", (type_id,))
        event_type = row_to_dict(cursor.fetchone())
        conn.close()
        
        if not event_type:
            raise HTTPException(status_code=404, detail="Event type not found")
        
        return event_type
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Colleges endpoints
@app.get("/colleges")
async def get_colleges():
    """Get all colleges"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Colleges")
        colleges = rows_to_list(cursor.fetchall())
        conn.close()
        return colleges
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/colleges/{college_id}")
async def get_college(college_id: int):
    """Get college by ID"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Colleges WHERE college_id = ?", (college_id,))
        college = row_to_dict(cursor.fetchone())
        conn.close()
        
        if not college:
            raise HTTPException(status_code=404, detail="College not found")
        
        return college
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Students endpoints
@app.get("/students")
async def get_students():
    """Get all students"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Students")
        students = rows_to_list(cursor.fetchall())
        conn.close()
        return students
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/students/{student_id}")
async def get_student(student_id: int):
    """Get student by ID"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM Students WHERE student_id = ?", (student_id,))
        student = row_to_dict(cursor.fetchone())
        conn.close()
        
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        return student
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Events endpoints
@app.get("/events")
async def get_events():
    """Get all events"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT e.*, et.name as event_type_name, c.name as college_name
            FROM Events e
            LEFT JOIN EventTypes et ON e.type_id = et.type_id
            LEFT JOIN Colleges c ON e.college_id = c.college_id
        """)
        events = rows_to_list(cursor.fetchall())
        conn.close()
        return events
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/events/{event_id}")
async def get_event(event_id: int):
    """Get event by ID"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT e.*, et.name as event_type_name, c.name as college_name
            FROM Events e
            LEFT JOIN EventTypes et ON e.type_id = et.type_id
            LEFT JOIN Colleges c ON e.college_id = c.college_id
            WHERE e.event_id = ?
        """, (event_id,))
        event = row_to_dict(cursor.fetchone())
        conn.close()
        
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        return event
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Registrations endpoints
@app.get("/registrations")
async def get_registrations():
    """Get all registrations"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT r.*, s.name as student_name, e.title as event_title
            FROM Registrations r
            LEFT JOIN Students s ON r.student_id = s.student_id
            LEFT JOIN Events e ON r.event_id = e.event_id
        """)
        registrations = rows_to_list(cursor.fetchall())
        conn.close()
        return registrations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/registrations/{registration_id}")
async def get_registration(registration_id: int):
    """Get registration by ID"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT r.*, s.name as student_name, e.title as event_title
            FROM Registrations r
            LEFT JOIN Students s ON r.student_id = s.student_id
            LEFT JOIN Events e ON r.event_id = e.event_id
            WHERE r.registration_id = ?
        """, (registration_id,))
        registration = row_to_dict(cursor.fetchone())
        conn.close()
        
        if not registration:
            raise HTTPException(status_code=404, detail="Registration not found")
        
        return registration
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Statistics endpoints
@app.get("/stats")
async def get_statistics():
    """Get system statistics"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        stats = {}
        
        # Count colleges
        cursor.execute("SELECT COUNT(*) as count FROM Colleges")
        stats['colleges'] = cursor.fetchone()['count']
        
        # Count students
        cursor.execute("SELECT COUNT(*) as count FROM Students")
        stats['students'] = cursor.fetchone()['count']
        
        # Count events
        cursor.execute("SELECT COUNT(*) as count FROM Events")
        stats['events'] = cursor.fetchone()['count']
        
        # Count registrations
        cursor.execute("SELECT COUNT(*) as count FROM Registrations")
        stats['registrations'] = cursor.fetchone()['count']
        
        # Count event types
        cursor.execute("SELECT COUNT(*) as count FROM EventTypes")
        stats['event_types'] = cursor.fetchone()['count']
        
        conn.close()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Attendance endpoints
@app.get("/attendance")
async def get_attendance():
    """Get all attendance records"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT a.attendance_id, a.registration_id, a.attended as status,
                   a.check_in_time, r.student_id, r.event_id,
                   s.name as student_name, e.title as event_title,
                   r.registration_time
            FROM Attendance a
            JOIN Registrations r ON a.registration_id = r.registration_id
            JOIN Students s ON r.student_id = s.student_id
            JOIN Events e ON r.event_id = e.event_id
            ORDER BY a.attendance_id DESC
        """)
        attendance = [row_to_dict(row) for row in cursor.fetchall()]
        conn.close()
        return {"data": attendance}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/attendance/{attendance_id}")
async def get_attendance_record(attendance_id: int):
    """Get a specific attendance record"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT r.registration_id, r.student_id, r.event_id, r.registration_date,
                   s.name as student_name, e.title as event_title,
                   CASE WHEN r.status = 'confirmed' THEN 1 ELSE 0 END as attended,
                   r.registration_date as check_in_time
            FROM Registrations r
            LEFT JOIN Students s ON r.student_id = s.student_id
            LEFT JOIN Events e ON r.event_id = e.event_id
            WHERE r.registration_id = ?
        """, (attendance_id,))
        attendance = row_to_dict(cursor.fetchone())
        conn.close()
        
        if not attendance:
            raise HTTPException(status_code=404, detail="Attendance record not found")
        
        return attendance
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Feedback endpoints
def check_database():
    """Check database connection and table structure"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if database is writable
        cursor.execute("PRAGMA quick_check")
        check_result = cursor.fetchone()
        print(f"Database check: {check_result[0]}")
        
        # Check if Feedback table exists and get its structure
        cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='Feedback'
        """)
        feedback_table = cursor.fetchone()
        
        if not feedback_table:
            print("Error: Feedback table does not exist")
            return False, "Feedback table does not exist"
            
        # Get Feedback table structure
        cursor.execute("PRAGMA table_info(Feedback)")
        columns = cursor.fetchall()
        print("\nFeedback table structure:")
        for col in columns:
            print(f"- {col[1]} ({col[2]}){' NOT NULL' if col[3] else ''} {col[5] or ''}")
        
        # Check if there's any data
        cursor.execute("SELECT COUNT(*) FROM Feedback")
        count = cursor.fetchone()[0]
        print(f"\nFound {count} feedback records")
        
        conn.close()
        return True, "Database check passed"
        
    except Exception as e:
        error_msg = f"Database check failed: {str(e)}"
        print(error_msg)
        return False, error_msg

@app.get("/feedback")
async def get_feedback():
    """Get all feedback records"""
    try:
        # First check the database
        db_ok, db_message = check_database()
        if not db_ok:
            raise HTTPException(status_code=500, detail=db_message)
            
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Simple query that matches the exact schema
        cursor.execute("""
            SELECT feedback_id, registration_id, rating, comments, submitted_at
            FROM Feedback
            ORDER BY submitted_at DESC
        """)
        
        # Get column names from cursor description
        columns = [column[0] for column in cursor.description]
        
        # Convert rows to list of dictionaries
        rows = cursor.fetchall()
        feedback = [dict(zip(columns, row)) for row in rows]
        
        print(f"Retrieved {len(feedback)} feedback records")
        conn.close()
        
        return {"data": feedback}
        
    except sqlite3.Error as e:
        error_msg = f"Database error: {str(e)}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        error_msg = f"Unexpected error: {str(e)}\n{traceback.format_exc()}"
        print(error_msg)
        raise HTTPException(status_code=500, detail=error_msg)

@app.get("/feedback/{feedback_id}")
async def get_feedback_record(feedback_id: int):
    """Get a specific feedback record"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # First, try to get the basic feedback record
        try:
            cursor.execute("""
                SELECT f.feedback_id, f.registration_id, f.rating, f.comments, 
                       f.submitted_at, r.student_id, r.event_id,
                       s.name as student_name, e.title as event_title
                FROM Feedback f
                JOIN Registrations r ON f.registration_id = r.registration_id
                JOIN Students s ON r.student_id = s.student_id
                LEFT JOIN Events e ON r.event_id = e.event_id
                WHERE f.feedback_id = ?
            """, (feedback_id,))
            
            row = cursor.fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Feedback not found")
                
            feedback = {
                'feedback_id': row[0],
                'registration_id': row[1],
                'rating': row[2],
                'comments': row[3],
                'submitted_at': row[4],
                'student_id': row[5],
                'event_id': row[6],
                'student_name': row[7],
                'event_title': row[8] if len(row) > 8 else None
            }
            
        except sqlite3.Error:
            # If the join fails, try a simpler query
            cursor.execute("""
                SELECT feedback_id, registration_id, rating, comments, submitted_at
                FROM Feedback
                WHERE feedback_id = ?
            """, (feedback_id,))
            
            row = cursor.fetchone()
            if not row:
                raise HTTPException(status_code=404, detail="Feedback not found")
                
            feedback = {
                'feedback_id': row[0],
                'registration_id': row[1],
                'rating': row[2],
                'comments': row[3],
                'submitted_at': row[4]
            }
        
        conn.close()
        return feedback
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in /feedback/{{feedback_id}}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print(f"🚀 Starting Event Management System API")
    print(f"📁 Database: {DATABASE_PATH}")
    print(f"🌐 API Docs: http://127.0.0.1:8000/docs")
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
