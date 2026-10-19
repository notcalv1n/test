-- ISLearning: RESET EXISTING DATA (DESTRUCTIVE)
-- Run this ONLY if you want to erase all existing ISLearning accounts,
-- uploaded-material metadata, reviewers, quizzes, quiz attempts, answers,
-- notifications, settings, and AI-generation history from the islearning database.
-- This keeps the database/tables themselves intact.

USE islearning;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE quiz_answers;
TRUNCATE TABLE quiz_attempts;
TRUNCATE TABLE quiz_questions;
TRUNCATE TABLE quizzes;
TRUNCATE TABLE reviewers;
TRUNCATE TABLE materials;
TRUNCATE TABLE notifications;
TRUNCATE TABLE user_settings;
TRUNCATE TABLE ai_generations;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;
