#!/usr/bin/env python3
"""
Create the Event Management System database with sample data
"""
import sqlite3
from pathlib import Path
from datetime import datetime, timedelta

DATABASE_PATH = Path(__file__).parent.parent / "database" / "event_management_db.db"

def create_database():
    """Create database and add sample data"""
    try:
        # Ensure database directory exists
        DATABASE_PATH.parent.mkdir(exist_ok=True)
        
        # Remove existing database if it exists
        if DATABASE_PATH.exists():
            DATABASE_PATH.unlink()
        
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()
        
        print("🗄️ Creating Event Management System database...")
        
        # Create tables
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS Colleges (
                college_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name       TEXT NOT NULL,
                location   TEXT,
                status     TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive'))
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS EventTypes (
                type_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name    TEXT UNIQUE NOT NULL
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS Students (
                student_id INTEGER PRIMARY KEY AUTOINCREMENT,
                college_id INTEGER NOT NULL,
                name       TEXT NOT NULL,
                email      TEXT NOT NULL,
                department TEXT,
                year       TEXT,
                status     TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
                UNIQUE (college_id, email),
                FOREIGN KEY (college_id) REFERENCES Colleges(college_id) ON DELETE RESTRICT
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS Admins (
                admin_id   INTEGER PRIMARY KEY AUTOINCREMENT,
                college_id INTEGER NOT NULL,
                name       TEXT NOT NULL,
                email      TEXT NOT NULL,
                role       TEXT,
                status     TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
                UNIQUE (college_id, email),
                FOREIGN KEY (college_id) REFERENCES Colleges(college_id) ON DELETE RESTRICT
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS Events (
                event_id    INTEGER PRIMARY KEY AUTOINCREMENT,
                college_id  INTEGER NOT NULL,
                title       TEXT NOT NULL,
                description TEXT,
                type_id     INTEGER NOT NULL,
                venue       TEXT,
                start_time  TEXT NOT NULL,
                end_time    TEXT NOT NULL,
                capacity    INTEGER NOT NULL CHECK (capacity >= 0),
                created_by  INTEGER NOT NULL,
                semester    TEXT NOT NULL,
                status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','cancelled','completed')),
                FOREIGN KEY (college_id) REFERENCES Colleges(college_id) ON DELETE RESTRICT,
                FOREIGN KEY (type_id) REFERENCES EventTypes(type_id) ON DELETE RESTRICT,
                FOREIGN KEY (created_by) REFERENCES Admins(admin_id) ON DELETE RESTRICT
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS Registrations (
                registration_id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id      INTEGER NOT NULL,
                event_id        INTEGER NOT NULL,
                registration_date TEXT NOT NULL DEFAULT (datetime('now')),
                status          TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered','cancelled','confirmed')),
                UNIQUE (student_id, event_id),
                FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE RESTRICT,
                FOREIGN KEY (event_id)   REFERENCES Events(event_id)   ON DELETE RESTRICT
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS Attendance (
                attendance_id  INTEGER PRIMARY KEY AUTOINCREMENT,
                registration_id INTEGER NOT NULL UNIQUE,
                attended        INTEGER NOT NULL DEFAULT 0 CHECK (attended IN (0,1)),
                check_in_time   TEXT,
                FOREIGN KEY (registration_id) REFERENCES Registrations(registration_id) ON DELETE RESTRICT
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS Feedback (
                feedback_id     INTEGER PRIMARY KEY AUTOINCREMENT,
                registration_id INTEGER NOT NULL UNIQUE,
                rating          INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
                comment         TEXT,
                submitted_at    TEXT NOT NULL DEFAULT (datetime('now')),
                FOREIGN KEY (registration_id) REFERENCES Registrations(registration_id) ON DELETE RESTRICT
            )
        """)
        
        print("✅ Database tables created successfully!")
        
        # Add sample data
        print("📊 Adding sample data...")
        
        # Add sample colleges
        colleges_data = [
            (1, 'Tech College', 'Downtown Campus', 'active'),
            (2, 'Arts College', 'North Campus', 'active'),
            (3, 'Science College', 'South Campus', 'active')
        ]
        
        cursor.executemany("""
            INSERT INTO Colleges (college_id, name, location, status) 
            VALUES (?, ?, ?, ?)
        """, colleges_data)
        
        # Add sample event types
        event_types_data = [
            (1, 'Workshop'),
            (2, 'Seminar'),
            (3, 'Conference'),
            (4, 'Cultural Event')
        ]
        
        cursor.executemany("""
            INSERT INTO EventTypes (type_id, name) 
            VALUES (?, ?)
        """, event_types_data)
        
        # Add sample students
        students_data = [
            (1, 1, 'John Doe', 'john.doe@email.com', 'Computer Science', '3rd Year', 'active'),
            (2, 1, 'Jane Smith', 'jane.smith@email.com', 'Computer Science', '2nd Year', 'active'),
            (3, 2, 'Bob Johnson', 'bob.johnson@email.com', 'Fine Arts', '4th Year', 'active'),
            (4, 2, 'Alice Brown', 'alice.brown@email.com', 'Fine Arts', '1st Year', 'active'),
            (5, 3, 'Charlie Wilson', 'charlie.wilson@email.com', 'Physics', '3rd Year', 'active')
        ]
        
        cursor.executemany("""
            INSERT INTO Students (student_id, college_id, name, email, department, year, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, students_data)
        
        # Add sample admins
        admins_data = [
            (1, 1, 'Admin One', 'admin1@tech.edu', 'super_admin', 'active'),
            (2, 2, 'Admin Two', 'admin2@arts.edu', 'admin', 'active')
        ]
        
        cursor.executemany("""
            INSERT INTO Admins (admin_id, college_id, name, email, role, status) 
            VALUES (?, ?, ?, ?, ?, ?)
        """, admins_data)
        
        # Add sample events
        now = datetime.now()
        start_time = (now - timedelta(days=1)).strftime('%Y-%m-%d %H:%M:%S')
        end_time = (now - timedelta(hours=22)).strftime('%Y-%m-%d %H:%M:%S')
        
        events_data = [
            (1, 1, 'Python Workshop', 'Learn Python programming basics', 1, 'Room 101', start_time, end_time, 50, 1, 'Fall 2024', 'completed'),
            (2, 1, 'AI Seminar', 'Introduction to Artificial Intelligence', 2, 'Auditorium A', start_time, end_time, 100, 1, 'Fall 2024', 'completed'),
            (3, 2, 'Art Exhibition', 'Student art showcase', 4, 'Gallery Hall', start_time, end_time, 75, 2, 'Fall 2024', 'completed')
        ]
        
        cursor.executemany("""
            INSERT INTO Events (event_id, college_id, title, description, type_id, venue, start_time, end_time, capacity, created_by, semester, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, events_data)
        
        # Add sample registrations
        registrations_data = [
            (1, 1, 1, now.strftime('%Y-%m-%d %H:%M:%S'), 'confirmed'),
            (2, 2, 1, now.strftime('%Y-%m-%d %H:%M:%S'), 'confirmed'),
            (3, 1, 2, now.strftime('%Y-%m-%d %H:%M:%S'), 'confirmed'),
            (4, 3, 3, now.strftime('%Y-%m-%d %H:%M:%S'), 'confirmed'),
            (5, 4, 3, now.strftime('%Y-%m-%d %H:%M:%S'), 'confirmed')
        ]
        
        cursor.executemany("""
            INSERT INTO Registrations (registration_id, student_id, event_id, registration_date, status) 
            VALUES (?, ?, ?, ?, ?)
        """, registrations_data)
        
        # Add sample attendance records
        attendance_data = [
            (1, 1, 1, (now - timedelta(hours=23)).strftime('%Y-%m-%d %H:%M:%S')),
            (2, 2, 1, (now - timedelta(hours=23)).strftime('%Y-%m-%d %H:%M:%S')),
            (3, 3, 1, (now - timedelta(hours=23)).strftime('%Y-%m-%d %H:%M:%S')),
            (4, 4, 1, (now - timedelta(hours=23)).strftime('%Y-%m-%d %H:%M:%S')),
            (5, 5, 0, None)  # Not attended
        ]
        
        cursor.executemany("""
            INSERT INTO Attendance (attendance_id, registration_id, attended, check_in_time) 
            VALUES (?, ?, ?, ?)
        """, attendance_data)
        
        # Add sample feedback
        feedback_data = [
            (1, 1, 5, 'Excellent workshop! Learned a lot about Python.', (now - timedelta(hours=20)).strftime('%Y-%m-%d %H:%M:%S')),
            (2, 2, 4, 'Good content, but could use more hands-on examples.', (now - timedelta(hours=19)).strftime('%Y-%m-%d %H:%M:%S')),
            (3, 3, 5, 'Amazing AI seminar! Very informative.', (now - timedelta(hours=18)).strftime('%Y-%m-%d %H:%M:%S')),
            (4, 4, 4, 'Great art exhibition. Loved the creativity!', (now - timedelta(hours=17)).strftime('%Y-%m-%d %H:%M:%S'))
        ]
        
        cursor.executemany("""
            INSERT INTO Feedback (feedback_id, registration_id, rating, comment, submitted_at) 
            VALUES (?, ?, ?, ?, ?)
        """, feedback_data)
        
        conn.commit()
        conn.close()
        
        print("✅ Database created successfully with sample data!")
        print(f"📁 Database location: {DATABASE_PATH}")
        print("📊 Sample data added:")
        print("   - 3 Colleges")
        print("   - 4 Event Types")
        print("   - 5 Students")
        print("   - 2 Admins")
        print("   - 3 Events")
        print("   - 5 Registrations")
        print("   - 5 Attendance Records")
        print("   - 4 Feedback Records")
        
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    create_database()
