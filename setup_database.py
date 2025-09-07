import sqlite3
from pathlib import Path

def setup_database():
    """Create a new database with all required tables"""
    # Database path
    db_path = Path("database/event_management.db")
    
    # Create database directory if it doesn't exist
    db_path.parent.mkdir(exist_ok=True)
    
    # Remove existing database if it exists
    if db_path.exists():
        db_path.unlink()
    
    try:
        # Connect to the database (this will create it)
        conn = sqlite3.connect(str(db_path))
        cursor = conn.cursor()
        
        # Enable foreign key constraints
        cursor.execute("PRAGMA foreign_keys = ON;")
        
        # Create tables
        print("Creating tables...")
        
        # Students table
        cursor.execute("""
        CREATE TABLE Students (
            student_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )""")
        
        # Events table
        cursor.execute("""
        CREATE TABLE Events (
            event_id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            event_date TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )""")
        
        # Registrations table
        cursor.execute("""
        CREATE TABLE Registrations (
            registration_id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            event_id INTEGER NOT NULL,
            registered_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
            FOREIGN KEY (event_id) REFERENCES Events(event_id) ON DELETE CASCADE,
            UNIQUE(student_id, event_id)
        )""")
        
        # Feedback table
        cursor.execute("""
        CREATE TABLE Feedback (
            feedback_id INTEGER PRIMARY KEY AUTOINCREMENT,
            registration_id INTEGER NOT NULL,
            rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
            comments TEXT,
            submitted_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (registration_id) REFERENCES Registrations(registration_id) ON DELETE CASCADE,
            UNIQUE(registration_id)
        )""")
        
        # Add some sample data
        print("Adding sample data...")
        
        # Add sample students
        students = [
            ("John Doe", "john@example.com"),
            ("Jane Smith", "jane@example.com")
        ]
        cursor.executemany("INSERT INTO Students (name, email) VALUES (?, ?)", students)
        
        # Add sample events
        events = [
            ("Tech Conference 2023", "Annual technology conference", "2023-12-15 09:00:00"),
            ("Workshop: Web Development", "Hands-on web dev workshop", "2023-11-20 14:00:00")
        ]
        cursor.executemany("""
            INSERT INTO Events (title, description, event_date) 
            VALUES (?, ?, ?)
        """, events)
        
        # Add sample registrations
        registrations = [
            (1, 1),  # John registered for Tech Conference
            (2, 1),  # Jane registered for Tech Conference
            (2, 2)   # Jane registered for Web Dev Workshop
        ]
        cursor.executemany("""
            INSERT INTO Registrations (student_id, event_id)
            VALUES (?, ?)
        """, registrations)
        
        # Add sample feedback
        feedback = [
            (1, 5, "Great conference, learned a lot!"),
            (3, 4, "Good workshop, but could be more advanced")
        ]
        cursor.executemany("""
            INSERT INTO Feedback (registration_id, rating, comments)
            VALUES (?, ?, ?)
        """, feedback)
        
        # Commit changes and close connection
        conn.commit()
        conn.close()
        
        print(f"\nDatabase created successfully at: {db_path}")
        print("\nSample data added:")
        print("- 2 students")
        print("- 2 events")
        print("- 3 registrations")
        print("- 2 feedback entries")
        
    except Exception as e:
        print(f"Error setting up database: {e}")
        if 'conn' in locals():
            conn.rollback()
            conn.close()

if __name__ == "__main__":
    setup_database()
