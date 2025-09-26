-- Database schema for Namaa Charity Association App

CREATE DATABASE IF NOT EXISTS namaa_db;
USE namaa_db;

-- Users table for authentication
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'employee') DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Donors table
CREATE TABLE donors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    donation_type ENUM('تبرع شهري', 'تبرع سنوي', 'تبرع لمرة واحدة', 'تبرع لمشروع خاص') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    remaining_days INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table for employee tasks
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    assigned_to INT,
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- Messages table for SMS/WhatsApp logs
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT,
    message_type ENUM('sms', 'whatsapp') NOT NULL,
    message_content TEXT NOT NULL,
    status ENUM('sent', 'failed') DEFAULT 'sent',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES donors(id)
);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password, role) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Sample data
INSERT INTO donors (name, phone, donation_type, amount, start_date, end_date, notes) VALUES
('أحمد محمد', '0501234567', 'تبرع شهري', 500.00, '2024-01-01', '2024-12-31', 'متبرع منتظم'),
('فاطمة علي', '0509876543', 'تبرع لمرة واحدة', 1000.00, '2024-09-01', '2024-09-30', 'تبرع لمشروع تعليمي');
