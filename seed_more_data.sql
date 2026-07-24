-- SCRIPT SINH DỮ LIỆU ĐỒNG BỘ VỚI SEMANTIC ID (stu-01, fac-01, crs-01...)
-- Mọi ID đều chuẩn hóa đồng bộ 100%. 
-- Lưu ý: Bạn cần Restart Backend (dotnet run) để DbInitializer tự động quét các password 'TEMP' và băm mã hoá nó.
-- Mật khẩu sau khi khởi động sẽ mặc định là: Password123!

SET FOREIGN_KEY_CHECKS = 0;

-- ==========================================================
-- 1. Departments (12 Khoa)
-- ==========================================================
INSERT INTO `Departments` (`Id`, `DepartmentCode`, `Name`, `Description`, `HeadFacultyId`, `CreatedAt`, `UpdatedAt`) VALUES
('dept-01', 'IT', 'Information Technology', 'Khoa Công nghệ thông tin', NULL, NOW(), NOW()),
('dept-02', 'BA', 'Business Administration', 'Khoa Quản trị kinh doanh', NULL, NOW(), NOW()),
('dept-03', 'ENG', 'English', 'Khoa Tiếng Anh', NULL, NOW(), NOW()),
('dept-04', 'MKT', 'Marketing', 'Khoa Marketing', NULL, NOW(), NOW()),
('dept-05', 'LAW', 'Law', 'Khoa Luật', NULL, NOW(), NOW()),
('dept-06', 'MED', 'Medicine', 'Khoa Y', NULL, NOW(), NOW()),
('dept-07', 'ARC', 'Architecture', 'Khoa Kiến trúc', NULL, NOW(), NOW()),
('dept-08', 'ART', 'Fine Arts', 'Khoa Mỹ thuật', NULL, NOW(), NOW()),
('dept-09', 'CHE', 'Chemistry', 'Khoa Hóa học', NULL, NOW(), NOW()),
('dept-10', 'PHY', 'Physics', 'Khoa Vật lý', NULL, NOW(), NOW()),
('dept-11', 'HIS', 'History', 'Khoa Lịch sử', NULL, NOW(), NOW()),
('dept-12', 'MAT', 'Mathematics', 'Khoa Toán học', NULL, NOW(), NOW());

-- ==========================================================
-- 2. Users (1 Admin, 12 Giảng viên, 15 Sinh viên)
-- ==========================================================
INSERT INTO `Users` (`Id`, `Email`, `PasswordHash`, `FullName`, `Role`, `AvatarUrl`, `IsActive`, `FailedLoginAttempts`, `IsLocked`, `CreatedAt`, `UpdatedAt`) VALUES
-- 1 Admin
('usr-a-01', 'admin@elevate.edu', 'TEMP', 'System Admin', 'Admin', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=256', 1, 0, 0, NOW(), NOW()),

-- 12 Faculty
('usr-f-01', 'faculty1@elevate.edu', 'TEMP', 'Dr. Alan Smith', 'Faculty', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256', 1, 0, 0, NOW(), NOW()),
('usr-f-02', 'faculty2@elevate.edu', 'TEMP', 'Dr. Sarah Jones', 'Faculty', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256', 1, 0, 0, NOW(), NOW()),
('usr-f-03', 'faculty3@elevate.edu', 'TEMP', 'Prof. John Doe', 'Faculty', '', 1, 0, 0, NOW(), NOW()),
('usr-f-04', 'faculty4@elevate.edu', 'TEMP', 'Dr. Emily Clark', 'Faculty', '', 1, 0, 0, NOW(), NOW()),
('usr-f-05', 'faculty5@elevate.edu', 'TEMP', 'Dr. Michael Brown', 'Faculty', '', 1, 0, 0, NOW(), NOW()),
('usr-f-06', 'faculty6@elevate.edu', 'TEMP', 'Prof. Jessica Davis', 'Faculty', '', 1, 0, 0, NOW(), NOW()),
('usr-f-07', 'faculty7@elevate.edu', 'TEMP', 'Dr. William Garcia', 'Faculty', '', 1, 0, 0, NOW(), NOW()),
('usr-f-08', 'faculty8@elevate.edu', 'TEMP', 'Prof. Linda Martinez', 'Faculty', '', 1, 0, 0, NOW(), NOW()),
('usr-f-09', 'faculty9@elevate.edu', 'TEMP', 'Dr. Richard Rodriguez', 'Faculty', '', 1, 0, 0, NOW(), NOW()),
('usr-f-10', 'faculty10@elevate.edu', 'TEMP', 'Prof. Barbara Hernandez', 'Faculty', '', 1, 0, 0, NOW(), NOW()),
('usr-f-11', 'faculty11@elevate.edu', 'TEMP', 'Dr. Thomas Moore', 'Faculty', '', 1, 0, 0, NOW(), NOW()),
('usr-f-12', 'faculty12@elevate.edu', 'TEMP', 'Prof. Susan Martin', 'Faculty', '', 1, 0, 0, NOW(), NOW()),

-- 15 Students
('usr-s-01', 'student1@elevate.edu', 'TEMP', 'Alice Wonderland', 'Student', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=256', 1, 0, 0, NOW(), NOW()),
('usr-s-02', 'student2@elevate.edu', 'TEMP', 'Bob Builder', 'Student', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256', 1, 0, 0, NOW(), NOW()),
('usr-s-03', 'student3@elevate.edu', 'TEMP', 'Charlie Chaplin', 'Student', '', 1, 0, 0, NOW(), NOW()),
('usr-s-04', 'student4@elevate.edu', 'TEMP', 'Diana Prince', 'Student', '', 1, 0, 0, NOW(), NOW()),
('usr-s-05', 'student5@elevate.edu', 'TEMP', 'Evan Wright', 'Student', '', 1, 0, 0, NOW(), NOW()),
('usr-s-06', 'student6@elevate.edu', 'TEMP', 'Fiona Gallagher', 'Student', '', 1, 0, 0, NOW(), NOW()),
('usr-s-07', 'student7@elevate.edu', 'TEMP', 'George Weasley', 'Student', '', 1, 0, 0, NOW(), NOW()),
('usr-s-08', 'student8@elevate.edu', 'TEMP', 'Hannah Abbott', 'Student', '', 1, 0, 0, NOW(), NOW()),
('usr-s-09', 'student9@elevate.edu', 'TEMP', 'Ian Somerhalder', 'Student', '', 1, 0, 0, NOW(), NOW()),
('usr-s-10', 'student10@elevate.edu', 'TEMP', 'Jane Austen', 'Student', '', 1, 0, 0, NOW(), NOW()),
('usr-s-11', 'student11@elevate.edu', 'TEMP', 'Kevin Hart', 'Student', '', 1, 0, 0, NOW(), NOW()),
('usr-s-12', 'student12@elevate.edu', 'TEMP', 'Laura Croft', 'Student', '', 1, 0, 0, NOW(), NOW()),
('usr-s-13', 'student13@elevate.edu', 'TEMP', 'Mike Ross', 'Student', '', 1, 0, 0, NOW(), NOW()),
('usr-s-14', 'student14@elevate.edu', 'TEMP', 'Nancy Drew', 'Student', '', 1, 0, 0, NOW(), NOW()),
('usr-s-15', 'student15@elevate.edu', 'TEMP', 'Oliver Twist', 'Student', '', 1, 0, 0, NOW(), NOW());

-- ==========================================================
-- 3. Faculties (12 Giảng viên)
-- ==========================================================
INSERT INTO `Faculties` (`Id`, `UserId`, `FacultyCode`, `DepartmentId`, `Degree`, `CreatedAt`, `UpdatedAt`) VALUES
('fac-01', 'usr-f-01', 'FAC001', 'dept-01', 'PhD in IT', NOW(), NOW()),
('fac-02', 'usr-f-02', 'FAC002', 'dept-02', 'PhD in BA', NOW(), NOW()),
('fac-03', 'usr-f-03', 'FAC003', 'dept-03', 'PhD in English', NOW(), NOW()),
('fac-04', 'usr-f-04', 'FAC004', 'dept-04', 'PhD in Marketing', NOW(), NOW()),
('fac-05', 'usr-f-05', 'FAC005', 'dept-05', 'PhD in Law', NOW(), NOW()),
('fac-06', 'usr-f-06', 'FAC006', 'dept-06', 'PhD in Medicine', NOW(), NOW()),
('fac-07', 'usr-f-07', 'FAC007', 'dept-07', 'PhD in Architecture', NOW(), NOW()),
('fac-08', 'usr-f-08', 'FAC008', 'dept-08', 'PhD in Fine Arts', NOW(), NOW()),
('fac-09', 'usr-f-09', 'FAC009', 'dept-09', 'PhD in Chemistry', NOW(), NOW()),
('fac-10', 'usr-f-10', 'FAC010', 'dept-10', 'PhD in Physics', NOW(), NOW()),
('fac-11', 'usr-f-11', 'FAC011', 'dept-11', 'PhD in History', NOW(), NOW()),
('fac-12', 'usr-f-12', 'FAC012', 'dept-12', 'PhD in Mathematics', NOW(), NOW());

-- ==========================================================
-- 4. Students (15 Sinh viên)
-- ==========================================================
INSERT INTO `Students` (`Id`, `UserId`, `StudentCode`, `Program`, `Status`, `Gpa`, `TotalCredits`, `CreatedAt`, `UpdatedAt`) VALUES
('stu-01', 'usr-s-01', 'STU001', 'IT', 'Active', 3.9, 60, NOW(), NOW()),
('stu-02', 'usr-s-02', 'STU002', 'IT', 'Active', 3.5, 45, NOW(), NOW()),
('stu-03', 'usr-s-03', 'STU003', 'BA', 'Active', 3.2, 30, NOW(), NOW()),
('stu-04', 'usr-s-04', 'STU004', 'BA', 'Active', 3.8, 50, NOW(), NOW()),
('stu-05', 'usr-s-05', 'STU005', 'ENG', 'Active', 3.4, 40, NOW(), NOW()),
('stu-06', 'usr-s-06', 'STU006', 'ENG', 'Active', 3.1, 20, NOW(), NOW()),
('stu-07', 'usr-s-07', 'STU007', 'MKT', 'Active', 3.7, 55, NOW(), NOW()),
('stu-08', 'usr-s-08', 'STU008', 'MKT', 'Active', 3.6, 45, NOW(), NOW()),
('stu-09', 'usr-s-09', 'STU009', 'LAW', 'Active', 3.3, 35, NOW(), NOW()),
('stu-10', 'usr-s-10', 'STU010', 'LAW', 'Active', 3.9, 60, NOW(), NOW()),
('stu-11', 'usr-s-11', 'STU011', 'MED', 'Active', 3.5, 70, NOW(), NOW()),
('stu-12', 'usr-s-12', 'STU012', 'MED', 'Active', 3.2, 50, NOW(), NOW()),
('stu-13', 'usr-s-13', 'STU013', 'ARC', 'Active', 3.8, 40, NOW(), NOW()),
('stu-14', 'usr-s-14', 'STU014', 'ART', 'Active', 3.4, 30, NOW(), NOW()),
('stu-15', 'usr-s-15', 'STU015', 'CHE', 'Active', 3.6, 50, NOW(), NOW());

-- ==========================================================
-- 5. Courses (15 Khóa học)
-- ==========================================================
INSERT INTO `Courses` (`Id`, `Code`, `Name`, `Description`, `Credits`, `Capacity`, `DepartmentId`, `InstructorId`, `Schedule`, `Status`, `CreatedAt`, `UpdatedAt`) VALUES
('crs-01', 'CS101', 'Intro to Programming', 'Nhập môn lập trình', 3, 40, 'dept-01', 'fac-01', 'Mon/Wed 9:00 AM', 'In Progress', NOW(), NOW()),
('crs-02', 'CS102', 'Data Structures', 'Cấu trúc dữ liệu', 4, 40, 'dept-01', 'fac-01', 'Tue/Thu 1:00 PM', 'In Progress', NOW(), NOW()),
('crs-03', 'BA101', 'Intro to Business', 'Nhập môn kinh doanh', 3, 50, 'dept-02', 'fac-02', 'Fri 9:00 AM', 'In Progress', NOW(), NOW()),
('crs-04', 'BA102', 'Management', 'Quản trị học', 3, 50, 'dept-02', 'fac-02', 'Mon/Wed 1:00 PM', 'In Progress', NOW(), NOW()),
('crs-05', 'ENG101', 'English 1', 'Tiếng Anh 1', 2, 30, 'dept-03', 'fac-03', 'Tue/Thu 9:00 AM', 'In Progress', NOW(), NOW()),
('crs-06', 'ENG102', 'English 2', 'Tiếng Anh 2', 2, 30, 'dept-03', 'fac-03', 'Fri 1:00 PM', 'In Progress', NOW(), NOW()),
('crs-07', 'MKT101', 'Marketing Principles', 'Nguyên lý Marketing', 3, 45, 'dept-04', 'fac-04', 'Mon/Wed 10:00 AM', 'In Progress', NOW(), NOW()),
('crs-08', 'MKT102', 'Digital Marketing', 'Marketing số', 3, 45, 'dept-04', 'fac-04', 'Tue/Thu 2:00 PM', 'In Progress', NOW(), NOW()),
('crs-09', 'LAW101', 'Intro to Law', 'Nhập môn Pháp luật', 2, 60, 'dept-05', 'fac-05', 'Fri 10:00 AM', 'In Progress', NOW(), NOW()),
('crs-10', 'LAW102', 'Business Law', 'Luật kinh tế', 3, 60, 'dept-05', 'fac-05', 'Mon/Wed 2:00 PM', 'In Progress', NOW(), NOW()),
('crs-11', 'MED101', 'Anatomy', 'Giải phẫu học', 4, 30, 'dept-06', 'fac-06', 'Tue/Thu 10:00 AM', 'In Progress', NOW(), NOW()),
('crs-12', 'MED102', 'Physiology', 'Sinh lý học', 4, 30, 'dept-06', 'fac-06', 'Fri 2:00 PM', 'In Progress', NOW(), NOW()),
('crs-13', 'ARC101', 'Drawing 1', 'Vẽ kiến trúc 1', 3, 25, 'dept-07', 'fac-07', 'Mon/Wed 8:00 AM', 'In Progress', NOW(), NOW()),
('crs-14', 'ART101', 'Painting 1', 'Hội họa 1', 3, 20, 'dept-08', 'fac-08', 'Tue/Thu 8:00 AM', 'In Progress', NOW(), NOW()),
('crs-15', 'CHE101', 'General Chemistry', 'Hóa đại cương', 3, 50, 'dept-09', 'fac-09', 'Fri 8:00 AM', 'In Progress', NOW(), NOW());

-- ==========================================================
-- 6. Enrollments (15 Đăng ký - mỗi sinh viên 1 môn)
-- ==========================================================
INSERT INTO `Enrollments` (`Id`, `StudentId`, `CourseId`, `EnrolledAt`, `Status`, `AssignmentScore`, `MidtermScore`, `FinalScore`, `TotalGrade`, `CreatedAt`, `UpdatedAt`) VALUES
('enr-01', 'stu-01', 'crs-01', NOW(), 'Enrolled', 8.5, 7.5, 8.0, 8.0, NOW(), NOW()),
('enr-02', 'stu-02', 'crs-02', NOW(), 'Enrolled', 9.0, 8.5, 9.0, 8.8, NOW(), NOW()),
('enr-03', 'stu-03', 'crs-03', NOW(), 'Enrolled', 7.5, 7.0, 7.5, 7.3, NOW(), NOW()),
('enr-04', 'stu-04', 'crs-04', NOW(), 'Enrolled', 8.0, 8.0, 8.5, 8.2, NOW(), NOW()),
('enr-05', 'stu-05', 'crs-05', NOW(), 'Enrolled', 9.5, 9.0, 9.5, 9.3, NOW(), NOW()),
('enr-06', 'stu-06', 'crs-06', NOW(), 'Enrolled', 6.5, 7.0, 6.5, 6.7, NOW(), NOW()),
('enr-07', 'stu-07', 'crs-07', NOW(), 'Enrolled', 8.5, 8.0, 8.5, 8.3, NOW(), NOW()),
('enr-08', 'stu-08', 'crs-08', NOW(), 'Enrolled', 7.0, 7.5, 7.0, 7.2, NOW(), NOW()),
('enr-09', 'stu-09', 'crs-09', NOW(), 'Enrolled', 9.0, 9.5, 9.0, 9.2, NOW(), NOW()),
('enr-10', 'stu-10', 'crs-10', NOW(), 'Enrolled', 8.0, 8.5, 8.0, 8.2, NOW(), NOW()),
('enr-11', 'stu-11', 'crs-11', NOW(), 'Enrolled', 7.5, 8.0, 7.5, 7.7, NOW(), NOW()),
('enr-12', 'stu-12', 'crs-12', NOW(), 'Enrolled', 8.5, 9.0, 8.5, 8.7, NOW(), NOW()),
('enr-13', 'stu-13', 'crs-13', NOW(), 'Enrolled', 9.0, 8.5, 9.0, 8.8, NOW(), NOW()),
('enr-14', 'stu-14', 'crs-14', NOW(), 'Enrolled', 7.0, 6.5, 7.0, 6.8, NOW(), NOW()),
('enr-15', 'stu-15', 'crs-15', NOW(), 'Enrolled', 8.0, 7.5, 8.0, 7.8, NOW(), NOW());

-- ==========================================================
-- 7. Attendances (15 Điểm danh)
-- ==========================================================
INSERT INTO `Attendances` (`Id`, `StudentId`, `CourseId`, `FacultyId`, `AttendedDate`, `Status`, `Reason`, `CreatedAt`, `UpdatedAt`) VALUES
('att-01', 'stu-01', 'crs-01', 'fac-01', NOW(), 'Present', 'Good', NOW(), NOW()),
('att-02', 'stu-02', 'crs-02', 'fac-01', NOW(), 'Present', '', NOW(), NOW()),
('att-03', 'stu-03', 'crs-03', 'fac-02', NOW(), 'Present', '', NOW(), NOW()),
('att-04', 'stu-04', 'crs-04', 'fac-02', NOW(), 'Absent', 'Sick', NOW(), NOW()),
('att-05', 'stu-05', 'crs-05', 'fac-03', NOW(), 'Present', '', NOW(), NOW()),
('att-06', 'stu-06', 'crs-06', 'fac-03', NOW(), 'Present', '', NOW(), NOW()),
('att-07', 'stu-07', 'crs-07', 'fac-04', NOW(), 'Late', 'Traffic', NOW(), NOW()),
('att-08', 'stu-08', 'crs-08', 'fac-04', NOW(), 'Present', '', NOW(), NOW()),
('att-09', 'stu-09', 'crs-09', 'fac-05', NOW(), 'Present', '', NOW(), NOW()),
('att-10', 'stu-10', 'crs-10', 'fac-05', NOW(), 'Present', '', NOW(), NOW()),
('att-11', 'stu-11', 'crs-11', 'fac-06', NOW(), 'Present', '', NOW(), NOW()),
('att-12', 'stu-12', 'crs-12', 'fac-06', NOW(), 'Absent', '', NOW(), NOW()),
('att-13', 'stu-13', 'crs-13', 'fac-07', NOW(), 'Present', '', NOW(), NOW()),
('att-14', 'stu-14', 'crs-14', 'fac-08', NOW(), 'Present', '', NOW(), NOW()),
('att-15', 'stu-15', 'crs-15', 'fac-09', NOW(), 'Present', '', NOW(), NOW());

SET FOREIGN_KEY_CHECKS = 1;
