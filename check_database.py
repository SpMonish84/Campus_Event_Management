import sqlite3
import os

def check_database():
    db_path = "database/event_management.db"
    
    if not os.path.exists(db_path):
        print(f"Error: Database file not found at {db_path}")
        return
        
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Get list of tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        print("\n=== Database Tables ===")
        for table in tables:
            table_name = table[0]
            print(f"\nTable: {table_name}")
            print("-" * 50)
            
            # Get table info
            try:
                cursor.execute(f"PRAGMA table_info({table_name})")
                columns = cursor.fetchall()
                for col in columns:
                    print(f"{col[1]} ({col[2]}) {'NOT NULL' if col[3] else ''} {col[5] or ''}")
                    
                # Count rows
                cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
                count = cursor.fetchone()[0]
                print(f"\nTotal rows: {count}")
                
            except sqlite3.Error as e:
                print(f"Error reading table {table_name}: {e}")
        
        conn.close()
        
    except Exception as e:
        print(f"Error accessing database: {e}")

if __name__ == "__main__":
    check_database()
