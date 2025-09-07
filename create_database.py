import sqlite3
import os
from datetime import datetime, timedelta

def create_database():
    # Create database directory if it doesn't exist
    os.makedirs("database", exist_ok=True)
    
    # Connect to SQLite database (creates it if it doesn't exist)
    conn = sqlite3.connect('database/event_management.db')
    cursor = conn.cursor()
    
    # Enable foreign key constraints
    cursor.execute("PRAGMA foreign_keys = ON;")
    
    # Drop existing tables if they exist
    cursor.executescript("""
        DROP TABLE IF EXISTS Feedback;
        DROP TABLE IF EXISTS Attendance;
        DROP TABLE IF EXISTS Registrations;
        DROP TABLE IF EXISTS Events;
        DROP TABLE IF EXISTS Students;
    """)
    
    # Create Students table
    cursor.execute("""
    CREATE TABLE Students (
        student_id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )""")
    
    # Create Events table
    cursor.execute("""
    CREATE TABLE Events (
        event_id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        event_date TIMESTAMP NOT NULL,
        capacity INTEGER DEFAULT 100,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )""")
    
    # Create Registrations table
    cursor.execute("""
    CREATE TABLE Registrations (
        registration_id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        event_id INTEGER NOT NULL,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'registered' CHECK(status IN ('registered', 'cancelled')),
        FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
        FOREIGN KEY (event_id) REFERENCES Events(event_id) ON DELETE CASCADE,
        UNIQUE(student_id, event_id)
    )""")
    
    # Create Feedback table
    cursor.execute("""
    CREATE TABLE Feedback (
        feedback_id INTEGER PRIMARY KEY AUTOINCREMENT,
        registration_id INTEGER NOT NULL UNIQUE,
        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
        comments TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (registration_id) REFERENCES Registrations(registration_id) ON DELETE CASCADE
    )""")
    
    # Create Attendance table
    cursor.execute("""
    CREATE TABLE Attendance (
        attendance_id INTEGER PRIMARY KEY AUTOINCREMENT,
        registration_id INTEGER NOT NULL UNIQUE,
        attended BOOLEAN NOT NULL DEFAULT 0,
        check_in_time TIMESTAMP,
        FOREIGN KEY (registration_id) REFERENCES Registrations(registration_id) ON DELETE CASCADE
    )""")
    
    # Insert sample data
    # Sample Students
    students = [
        ('John Doe', 'john@example.com'),
        ('Jane Smith', 'jane@example.com'),
        ('Alice Johnson', 'alice@example.com')
    ]
    cursor.executemany("INSERT INTO Students (name, email) VALUES (?, ?)", students)
    
    # Sample Events
    now = datetime.now()
    events = [
        ('Tech Conference 2023', 'Annual technology conference', now + timedelta(days=30), 200),
        ('Workshop: Web Development', 'Hands-on web development workshop', now + timedelta(days=15), 30),
        ('Networking Mixer', 'Networking event for professionals', now + timedelta(days=7), 100)
    ]
    cursor.executemany("""
        INSERT INTO Events (title, description, event_date, capacity)
        VALUES (?, ?, ?, ?)
    """, events)
    
    # Sample Registrations
    registrations = [
        (1, 1, 'registered'),
        (2, 1, 'registered'),
        (2, 2, 'registered'),
        (3, 3, 'registered')
    ]
    cursor.executemany("""
        INSERT INTO Registrations (student_id, event_id, status)
        VALUES (?, ?, ?)
    """, registrations)
    
    # Sample Feedback
    feedback = [
        (1, 5, 'Great event, learned a lot!'),
        (3, 4, 'Good workshop, but could be more advanced')
    ]
    cursor.executemany("""
        INSERT INTO Feedback (registration_id, rating, comments)
        VALUES (?, ?, ?)
    """, feedback)
    
    # Sample Attendance
    attendance = [
        (1, 1, '2023-01-01 10:00:00'),
        (3, 1, '2023-01-01 10:15:00')
    ]
    cursor.executemany("""
        INSERT INTO Attendance (registration_id, attended, check_in_time)
        VALUES (?, 1, ?)
    """, attendance)
    
    # Commit changes and close connection
    conn.commit()
    conn.close()
    
    print("Database created successfully with sample data!")
    print("Location: database/event_management.db")

if __name__ == "__main__":
    create_database()
