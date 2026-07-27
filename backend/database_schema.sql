-- ====================================================================
-- SYSTEM: Student Information Management System (SIMS)
-- DATABASE SCRIPT: MySQL Database Schema & Sample Data
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `sims_db` 
    DEFAULT CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE `sims_db`;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `Enrollments`;
DROP TABLE IF EXISTS `Courses`;
DROP TABLE IF EXISTS `Faculties`;
DROP TABLE IF EXISTS `Faculty`;
DROP TABLE IF EXISTS `Students`;
DROP TABLE IF EXISTS `Departments`;
DROP TABLE IF EXISTS `Users`;
SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================================
-- TABLE 1: Users
-- ====================================================================
CREATE TABLE `Users` (
    `Id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `Email` VARCHAR(150) NOT NULL UNIQUE,
    `PasswordHash` VARCHAR(255) NOT NULL,
    `FullName` VARCHAR(100) NOT NULL,
    `AvatarUrl` VARCHAR(500) NULL,
    `Phone` VARCHAR(20) NULL,
    `Role` ENUM('Admin', 'Faculty', 'Student') NOT NULL DEFAULT 'Student',
    `IsActive` TINYINT(1) NOT NULL DEFAULT 1,
    `LastLoginAt` DATETIME NULL,
    `FailedLoginAttempts` INT NOT NULL DEFAULT 0,
    `IsLocked` TINYINT(1) NOT NULL DEFAULT 0,
    `LockedUntil` DATETIME NULL,
    `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`Email`),
    INDEX `idx_users_role` (`Role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- TABLE 2: Departments
-- ====================================================================
CREATE TABLE `Departments` (
    `Id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `DepartmentCode` VARCHAR(20) NOT NULL UNIQUE,
    `Name` VARCHAR(100) NOT NULL,
    `HeadFacultyId` VARCHAR(36) NULL,
    `Description` TEXT NULL,
    `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- ====================================================================
-- TABLE 3: Faculties
-- ====================================================================
CREATE TABLE `Faculties` (
    `Id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `UserId` VARCHAR(36) NOT NULL UNIQUE,
    `FacultyCode` VARCHAR(30) NOT NULL UNIQUE,
    `DepartmentId` VARCHAR(36) NOT NULL,
    `Degree` VARCHAR(50) NOT NULL DEFAULT 'Master',
    `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`UserId`) REFERENCES `Users`(`Id`) ON DELETE CASCADE,
    FOREIGN KEY (`DepartmentId`) REFERENCES `Departments`(`Id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `Departments`
    ADD CONSTRAINT `fk_departments_head_faculty`
    FOREIGN KEY (`HeadFacultyId`) REFERENCES `Faculties`(`Id`) ON DELETE SET NULL;

-- ====================================================================
-- TABLE 4: Students
-- ====================================================================
CREATE TABLE `Students` (
    `Id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `UserId` VARCHAR(36) NOT NULL UNIQUE,
    `StudentCode` VARCHAR(30) NOT NULL UNIQUE,
    `Program` VARCHAR(100) NOT NULL,
    `Status` ENUM('Active', 'Pending', 'Suspended', 'Graduated') NOT NULL DEFAULT 'Active',
    `GPA` DECIMAL(3, 2) NOT NULL DEFAULT 0.00,
    `TotalCredits` INT NOT NULL DEFAULT 0,
    `DateOfBirth` DATE NULL,
    `Address` VARCHAR(255) NULL,
    `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`UserId`) REFERENCES `Users`(`Id`) ON DELETE CASCADE,
    INDEX `idx_students_program` (`Program`),
    INDEX `idx_students_status` (`Status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- TABLE 5: Courses
-- ====================================================================
CREATE TABLE `Courses` (
    `Id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `Code` VARCHAR(20) NOT NULL UNIQUE,
    `Name` VARCHAR(150) NOT NULL,
    `DepartmentId` VARCHAR(36) NOT NULL,
    `InstructorId` VARCHAR(36) NULL,
    `Schedule` VARCHAR(100) NULL,
    `Status` ENUM('Upcoming', 'InProgress', 'Completed') NOT NULL DEFAULT 'InProgress',
    `Credits` INT NOT NULL DEFAULT 3,
    `Capacity` INT NOT NULL DEFAULT 35,
    `Description` TEXT NULL,
    `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`DepartmentId`) REFERENCES `Departments`(`Id`) ON DELETE RESTRICT,
    FOREIGN KEY (`InstructorId`) REFERENCES `Faculties`(`Id`) ON DELETE SET NULL,
    INDEX `idx_courses_code` (`Code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- TABLE 6: Enrollments
-- ====================================================================
CREATE TABLE `Enrollments` (
    `Id` VARCHAR(36) NOT NULL PRIMARY KEY,
    `StudentId` VARCHAR(36) NOT NULL,
    `CourseId` VARCHAR(36) NOT NULL,
    `EnrolledAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `Status` ENUM('Enrolled', 'Completed', 'Dropped') NOT NULL DEFAULT 'Enrolled',
    `AssignmentScore` DECIMAL(5, 2) NULL,
    `MidtermScore` DECIMAL(5, 2) NULL,
    `FinalScore` DECIMAL(5, 2) NULL,
    `TotalGrade` DECIMAL(3, 2) NULL,
    `Remarks` VARCHAR(255) NULL,
    `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_student_course` (`StudentId`, `CourseId`),
    FOREIGN KEY (`StudentId`) REFERENCES `Students`(`Id`) ON DELETE CASCADE,
    FOREIGN KEY (`CourseId`) REFERENCES `Courses`(`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;