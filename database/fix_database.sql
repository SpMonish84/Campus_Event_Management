-- Drop existing tables in the correct order to avoid foreign key constraint violations
PRAGMA foreign_keys = OFF;

-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS AuditLogs;
DROP TABLE IF EXISTS Feedback;
DROP TABLE IF EXISTS Attendance;
DROP TABLE IF EXISTS Registrations;
DROP TABLE IF EXISTS Events;
DROP TABLE IF EXISTS EventTypes;
DROP TABLE IF EXISTS Students;
DROP TABLE IF EXISTS Admins;
DROP TABLE IF EXISTS Colleges;

-- Recreate tables with proper constraints and fixes

-- Colleges table
CREATE TABLE IF NOT EXISTS Colleges (
    college_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    location   TEXT,
    status     TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- EventTypes table
CREATE TABLE IF NOT EXISTS EventTypes (
    type_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name    TEXT UNIQUE NOT NULL
);

-- Insert default event types
INSERT OR IGNORE INTO EventTypes (name) VALUES 
('Workshop'), 
('Hackathon'), 
('Fest'), 
('Seminar'), 
('Talk'), 
('Other');

-- Admins table
CREATE TABLE IF NOT EXISTS Admins (
    admin_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    college_id INTEGER NOT NULL,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role       TEXT DEFAULT 'admin',
    status     TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
    last_login TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    UNIQUE (college_id, email),
    FOREIGN KEY (college_id) REFERENCES Colleges(college_id) ON DELETE RESTRICT
);

-- Students table
CREATE TABLE IF NOT EXISTS Students (
    student_id  INTEGER PRIMARY KEY AUTOINCREMENT,
    college_id  INTEGER NOT NULL,
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    student_id_number TEXT,
    department  TEXT,
    year        TEXT,
    status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
    created_at  TEXT DEFAULT (datetime('now')),
    updated_at  TEXT DEFAULT (datetime('now')),
    UNIQUE (college_id, email),
    UNIQUE (college_id, student_id_number),
    FOREIGN KEY (college_id) REFERENCES Colleges(college_id) ON DELETE RESTRICT
);

-- Events table
CREATE TABLE IF NOT EXISTS Events (
    event_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    college_id   INTEGER NOT NULL,
    title        TEXT NOT NULL,
    description  TEXT,
    type_id      INTEGER NOT NULL,
    venue        TEXT,
    start_time   TEXT NOT NULL,
    end_time     TEXT NOT NULL,
    capacity     INTEGER NOT NULL CHECK (capacity >= 0),
    created_by   INTEGER NOT NULL,
    semester     TEXT NOT NULL,
    status       TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
    created_at   TEXT DEFAULT (datetime('now')),
    updated_at   TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (college_id) REFERENCES Colleges(college_id) ON DELETE RESTRICT,
    FOREIGN KEY (created_by) REFERENCES Admins(admin_id) ON DELETE RESTRICT,
    FOREIGN KEY (type_id) REFERENCES EventTypes(type_id),
    CHECK (julianday(end_time) > julianday(start_time)),
    CHECK (
        (status = 'upcoming' AND julianday('now') < julianday(start_time)) OR
        (status = 'ongoing' AND julianday('now') BETWEEN julianday(start_time) AND julianday(end_time)) OR
        (status = 'completed' AND julianday('now') > julianday(end_time)) OR
        (status = 'cancelled')
    )
);

-- Registrations table
CREATE TABLE IF NOT EXISTS Registrations (
    registration_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id        INTEGER NOT NULL,
    event_id          INTEGER NOT NULL,
    registration_time TEXT NOT NULL DEFAULT (datetime('now')),
    status            TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered','cancelled','attended')),
    UNIQUE (student_id, event_id),
    FOREIGN KEY (student_id) REFERENCES Students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id)   REFERENCES Events(event_id) ON DELETE CASCADE
);

-- Attendance table
CREATE TABLE IF NOT EXISTS Attendance (
    attendance_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    registration_id INTEGER NOT NULL UNIQUE,
    attended        INTEGER NOT NULL DEFAULT 0 CHECK (attended IN (0,1)),
    check_in_time   TEXT,
    check_out_time  TEXT,
    notes           TEXT,
    FOREIGN KEY (registration_id) REFERENCES Registrations(registration_id) ON DELETE CASCADE
);

-- Feedback table
CREATE TABLE IF NOT EXISTS Feedback (
    feedback_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    registration_id INTEGER NOT NULL UNIQUE,
    rating          INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comments        TEXT,
    submitted_at    TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (registration_id) REFERENCES Registrations(registration_id) ON DELETE CASCADE
);

-- AuditLogs table
CREATE TABLE IF NOT EXISTS AuditLogs (
    log_id      INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_id    INTEGER,
    action      TEXT NOT NULL,
    table_name  TEXT NOT NULL,
    record_id   INTEGER,
    old_data    TEXT,
    new_data    TEXT,
    ip_address  TEXT,
    user_agent  TEXT,
    created_at  TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (admin_id) REFERENCES Admins(admin_id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_college ON Events(college_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON Events(type_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON Events(status);
CREATE INDEX IF NOT EXISTS idx_events_dates ON Events(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_students_college ON Students(college_id);
CREATE INDEX IF NOT EXISTS idx_students_email ON Students(email);
CREATE INDEX IF NOT EXISTS idx_registrations_student ON Registrations(student_id);
CREATE INDEX IF NOT EXISTS idx_registrations_event ON Registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_attendance_registration ON Attendance(registration_id);
CREATE INDEX IF NOT EXISTS idx_feedback_registration ON Feedback(registration_id);

-- Triggers for automatic status updates
CREATE TRIGGER IF NOT EXISTS trg_event_status_update
AFTER UPDATE OF start_time, end_time, status ON Events
FOR EACH ROW
WHEN NEW.status != 'cancelled' AND (
    OLD.start_time != NEW.start_time OR 
    OLD.end_time != NEW.end_time OR
    OLD.status != NEW.status
)
BEGIN
    UPDATE Events 
    SET status = CASE
        WHEN status = 'cancelled' THEN 'cancelled'
        WHEN julianday('now') < julianday(start_time) THEN 'upcoming'
        WHEN julianday('now') BETWEEN julianday(start_time) AND julianday(end_time) THEN 'ongoing'
        ELSE 'completed'
    END,
    updated_at = datetime('now')
    WHERE event_id = NEW.event_id;
END;

-- Trigger to update registration status when attendance is marked
CREATE TRIGGER IF NOT EXISTS trg_attendance_update
AFTER UPDATE OF attended ON Attendance
FOR EACH ROW
WHEN NEW.attended = 1 AND OLD.attended = 0
BEGIN
    UPDATE Registrations 
    SET status = 'attended'
    WHERE registration_id = NEW.registration_id;
END;

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Insert sample data for testing
-- Note: Run these only for a fresh database
-- INSERT INTO Colleges (name, location) VALUES ('Sample College', 'Sample Location');
-- INSERT INTO Admins (college_id, name, email, password_hash) 
-- VALUES (1, 'Admin User', 'admin@example.com', 'hashed_password_here');
