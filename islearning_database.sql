-- ISLearning normalized MySQL/MariaDB database
-- XAMPP normally provides MariaDB on port 3306.
-- The legacy JSON columns in users are retained temporarily for safe migration
-- from older ISLearning versions. New application data uses normalized tables.

CREATE DATABASE IF NOT EXISTS islearning
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE islearning;

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    student_id VARCHAR(100) NULL,
    email VARCHAR(255) NULL,
    name VARCHAR(255) NOT NULL DEFAULT '',
    first_name VARCHAR(255) NOT NULL DEFAULT '',
    middle_name VARCHAR(255) NOT NULL DEFAULT '',
    last_name VARCHAR(255) NOT NULL DEFAULT '',
    course VARCHAR(255) NOT NULL DEFAULT '',
    is_setup_complete TINYINT(1) NOT NULL DEFAULT 0,
    password_hash VARCHAR(255) NULL,
    is_guest TINYINT(1) NOT NULL DEFAULT 0,

    -- Legacy fields kept only for migration/backward compatibility.
    materials LONGTEXT NOT NULL,
    reviewers LONGTEXT NOT NULL,
    quiz_history LONGTEXT NOT NULL,
    notifications LONGTEXT NOT NULL,
    settings LONGTEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_student_id (student_id),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS materials (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL DEFAULT 'General',
    topic VARCHAR(255) NOT NULL DEFAULT 'General Topic',
    week VARCHAR(50) NOT NULL DEFAULT 'Week 1',
    file_type VARCHAR(20) NOT NULL,
    mime_type VARCHAR(150) NULL,
    stored_filename VARCHAR(500) NOT NULL,
    file_path VARCHAR(1000) NOT NULL,
    file_size_bytes BIGINT UNSIGNED NOT NULL DEFAULT 0,
    uploaded_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    can_generate_ai TINYINT(1) NOT NULL DEFAULT 0,

    CONSTRAINT fk_material_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_material_user (user_id),
    INDEX idx_material_subject (user_id, subject),
    INDEX idx_material_uploaded (user_id, uploaded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS reviewers (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    material_id VARCHAR(100) NULL,
    title VARCHAR(255) NOT NULL,
    source_file VARCHAR(255) NOT NULL,
    generated_at DATETIME NOT NULL,
    subject VARCHAR(255) NOT NULL DEFAULT 'General',
    main_topics LONGTEXT NOT NULL,
    key_concepts LONGTEXT NOT NULL,
    important_terms LONGTEXT NOT NULL,
    summary LONGTEXT NOT NULL,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    is_bookmarked TINYINT(1) NOT NULL DEFAULT 0,
    detailed_content LONGTEXT NULL,

    CONSTRAINT fk_reviewer_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviewer_material
        FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE SET NULL,

    INDEX idx_reviewer_user (user_id),
    INDEX idx_reviewer_material (material_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS quizzes (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    material_id VARCHAR(100) NULL,
    reviewer_id VARCHAR(100) NULL,
    title VARCHAR(255) NOT NULL,
    source_type VARCHAR(30) NOT NULL DEFAULT 'material',
    source_title VARCHAR(255) NOT NULL,
    question_count INT NOT NULL DEFAULT 0,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'normal',
    created_at DATETIME NOT NULL,

    CONSTRAINT fk_quiz_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_quiz_material
        FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE SET NULL,
    CONSTRAINT fk_quiz_reviewer
        FOREIGN KEY (reviewer_id) REFERENCES reviewers(id) ON DELETE SET NULL,

    INDEX idx_quiz_user (user_id),
    INDEX idx_quiz_source (material_id, reviewer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS quiz_questions (
    id VARCHAR(100) PRIMARY KEY,
    quiz_id VARCHAR(100) NOT NULL,
    question_order INT NOT NULL,
    question_text LONGTEXT NOT NULL,
    question_type VARCHAR(30) NOT NULL,
    choices_json LONGTEXT NULL,
    correct_answer LONGTEXT NOT NULL,
    explanation LONGTEXT NULL,

    CONSTRAINT fk_question_quiz
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,

    INDEX idx_question_quiz (quiz_id, question_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    quiz_id VARCHAR(100) NULL,
    title VARCHAR(255) NOT NULL,
    source_type VARCHAR(30) NOT NULL DEFAULT 'material',
    source_title VARCHAR(255) NOT NULL,
    total_questions INT NOT NULL DEFAULT 0,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'normal',
    correct_answers INT NOT NULL DEFAULT 0,
    score DECIMAL(6,2) NOT NULL DEFAULT 0,
    time_spent INT NOT NULL DEFAULT 0,
    completed_at DATETIME NOT NULL,

    CONSTRAINT fk_attempt_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_attempt_quiz
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE SET NULL,

    INDEX idx_attempt_user (user_id, completed_at),
    INDEX idx_attempt_quiz (quiz_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS quiz_answers (
    id VARCHAR(100) PRIMARY KEY,
    attempt_id VARCHAR(100) NOT NULL,
    question_id VARCHAR(100) NULL,
    question_text LONGTEXT NOT NULL,
    selected_answer LONGTEXT NULL,
    correct_answer LONGTEXT NOT NULL,
    is_correct TINYINT(1) NOT NULL DEFAULT 0,

    CONSTRAINT fk_answer_attempt
        FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    CONSTRAINT fk_answer_question
        FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE SET NULL,

    INDEX idx_answer_attempt (attempt_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    message LONGTEXT NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'info',
    read_flag TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL,

    CONSTRAINT fk_notification_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

    INDEX idx_notification_user (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_settings (
    user_id VARCHAR(100) PRIMARY KEY,
    dark_mode TINYINT(1) NOT NULL DEFAULT 0,
    offline_mode TINYINT(1) NOT NULL DEFAULT 0,
    notifications_enabled TINYINT(1) NOT NULL DEFAULT 1,
    auto_save TINYINT(1) NOT NULL DEFAULT 1,
    offline_access TINYINT(1) NOT NULL DEFAULT 1,
    updated_at DATETIME NOT NULL,

    CONSTRAINT fk_settings_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ai_generations (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    material_id VARCHAR(100) NULL,
    reviewer_id VARCHAR(100) NULL,
    generation_type VARCHAR(30) NOT NULL,
    model VARCHAR(100) NULL,
    status VARCHAR(30) NOT NULL,
    created_at DATETIME NOT NULL,
    completed_at DATETIME NULL,
    error_message LONGTEXT NULL,

    CONSTRAINT fk_ai_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ai_material
        FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE SET NULL,
    CONSTRAINT fk_ai_reviewer
        FOREIGN KEY (reviewer_id) REFERENCES reviewers(id) ON DELETE SET NULL,

    INDEX idx_ai_user (user_id, created_at),
    INDEX idx_ai_material (material_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
