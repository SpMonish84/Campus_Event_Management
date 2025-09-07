import sqlite3
from pathlib import Path

# Database path
DB_PATH = Path(__file__).parent.parent / "database" / "event_management_db.db"

def check_and_create_feedback_table():
    """Check if Feedback table exists, create it if it doesn't"""
    try:
        conn = sqlite3.connect(str(DB_PATH))
        cursor = conn.cursor()
        
        # Check if Feedback table exists
        cursor.execute("""
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='Feedback'
        """)
        
        if not cursor.fetchone():
            print("Creating Feedback table...")
            cursor.execute("""
                CREATE TABLE Feedback (
                    feedback_id     INTEGER PRIMARY KEY AUTOINCREMENT,
                    registration_id INTEGER NOT NULL UNIQUE,
                    rating          INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
                    comments        TEXT,
                    submitted_at    TEXT NOT NULL DEFAULT (datetime('now')),
                    FOREIGN KEY (registration_id) 
                        REFERENCES Registrations(registration_id) 
                        ON DELETE RESTRICT
                )
            """)
            conn.commit()
            print("Feedback table created successfully!")
        else:
            print("Feedback table already exists.")
            
        # Verify the table structure
        cursor.execute("PRAGMA table_info(Feedback)")
        columns = cursor.fetchall()
        print("\nFeedback table structure:")
        print("-" * 50)
        for col in columns:
            print(f"{col[1]} ({col[2]}) {'NOT NULL' if col[3] else ''} {col[5] or ''}")
        
        conn.close()
        return True
        
    except sqlite3.Error as e:
        print(f"Database error: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False

if __name__ == "__main__":
    print(f"Checking database at: {DB_PATH}")
    if not DB_PATH.exists():
        print("Error: Database file not found!")
    else:
        check_and_create_feedback_table()
