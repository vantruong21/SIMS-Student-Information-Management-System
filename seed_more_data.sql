-- =========================================================================
-- SCRIPT SINH THÊM DỮ LIỆU MẪU CHO SIMS (MySQL)
-- Các mật khẩu để là 'TEMP', khi chạy Backend, DbInitializer sẽ tự động
-- quét các mã băm < 50 ký tự và chuyển về mật khẩu mặc định "Password123!"
-- =========================================================================

-- 1. Sinh thêm Users (2 Giảng viên, 5 Sinh viên)
INSERT INTO `Users` (`Id`, `Email`, `PasswordHash`, `FullName`, `Role`, `AvatarUrl`, `IsActive`, `FailedLoginAttempts`, `IsLocked`, `CreatedAt`, `UpdatedAt`) VALUES 
('usr-f-101', 'smith@elevate.edu', 'TEMP', 'Dr. Alan Smith', 'Faculty', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256', 1, 0, 0, NOW(), NOW()),
('usr-f-102', 'jones@elevate.edu', 'TEMP', 'Prof. Sarah Jones', 'Faculty', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256', 1, 0, 0, NOW(), NOW()),
('usr-s-101', 'alice@elevate.edu', 'TEMP', 'Alice Wonderland', 'Student', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=256', 1, 0, 0, NOW(), NOW()),
('usr-s-102', 'bob@elevate.edu', 'TEMP', 'Bob Builder', 'Student', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256', 1, 0, 0, NOW(), NOW()),
('usr-s-103', 'charlie@elevate.edu', 'TEMP', 'Charlie Chaplin', 'Student', '', 1, 0, 0, NOW(), NOW()),
('usr-s-104', 'diana@elevate.edu', 'TEMP', 'Diana Prince', 'Student', '', 1, 0, 0, NOW(), NOW()),
('usr-s-105', 'evan@elevate.edu', 'TEMP', 'Evan Wright', 'Student', '', 1, 0, 0, NOW(), NOW());

-- 2. Sinh thêm Faculties (liên kết với Dept có sẵn trong DbInitializer là dept-1 (IT) và dept-2 (MKT))
INSERT INTO `Faculties` (`Id`, `UserId`, `FacultyCode`, `DepartmentId`, `Degree`, `CreatedAt`, `UpdatedAt`) VALUES 
('fac-101', 'usr-f-101', 'FAC2024101', 'dept-1', 'PhD in Computer Science', NOW(), NOW()),
('fac-102', 'usr-f-102', 'FAC2024102', 'dept-2', 'PhD in Economics', NOW(), NOW());

-- 3. Sinh thêm Students (liên kết với Users)
INSERT INTO `Students` (`Id`, `UserId`, `StudentCode`, `Program`, `Status`, `Gpa`, `TotalCredits`, `CreatedAt`, `UpdatedAt`) VALUES 
('stu-101', 'usr-s-101', 'STU2024101', 'Software Engineering', 'Active', 3.90, 60, NOW(), NOW()),
('stu-102', 'usr-s-102', 'STU2024102', 'Software Engineering', 'Active', 3.20, 45, NOW(), NOW()),
('stu-103', 'usr-s-103', 'STU2024103', 'Information Systems', 'Active', 2.80, 30, NOW(), NOW()),
('stu-104', 'usr-s-104', 'STU2024104', 'Marketing', 'Active', 3.65, 50, NOW(), NOW()),
('stu-105', 'usr-s-105', 'STU2024105', 'Business Admin', 'Active', 3.40, 40, NOW(), NOW());

-- 4. Sinh thêm Courses (Môn học)
INSERT INTO `Courses` (`Id`, `Code`, `Name`, `Description`, `Credits`, `Capacity`, `DepartmentId`, `InstructorId`, `Schedule`, `Status`, `CreatedAt`, `UpdatedAt`) VALUES 
('crs-101', 'CS201', 'Data Structures & Algorithms', 'Cấu trúc dữ liệu và giải thuật nâng cao', 4, 40, 'dept-1', 'fac-101', 'Mon/Wed 9:00 AM', 'In Progress', NOW(), NOW()),
('crs-102', 'CS202', 'Database Management Systems', 'Hệ quản trị CSDL quan hệ', 3, 40, 'dept-1', 'fac-101', 'Tue/Thu 1:00 PM', 'In Progress', NOW(), NOW()),
('crs-103', 'MKT101', 'Principles of Marketing', 'Nguyên lý Marketing căn bản', 3, 50, 'dept-2', 'fac-102', 'Friday 9:00 AM', 'In Progress', NOW(), NOW()),
('crs-104', 'MKT201', 'Digital Marketing', 'Marketing thời đại số', 3, 45, 'dept-2', 'fac-102', 'Mon/Wed 2:00 PM', 'In Progress', NOW(), NOW()),
('crs-105', 'SE301', 'Cloud Computing', 'Điện toán đám mây với AWS/Azure', 4, 30, 'dept-1', 'fac-101', 'Thursday 8:00 AM', 'In Progress', NOW(), NOW());

-- 5. Sinh thêm Enrollments (Ghi danh môn học)
-- Sinh viên IT học môn IT, sinh viên MKT học môn MKT
INSERT INTO `Enrollments` (`Id`, `StudentId`, `CourseId`, `EnrolledAt`, `Status`, `AssignmentScore`, `MidtermScore`, `FinalScore`, `TotalGrade`, `Remarks`, `CreatedAt`, `UpdatedAt`) VALUES 
(UUID(), 'stu-101', 'crs-101', NOW(), 'Enrolled', 90, 85, 88, 87.5, 'Good progress', NOW(), NOW()),
(UUID(), 'stu-101', 'crs-102', NOW(), 'Enrolled', 95, 92, 90, 92.0, 'Excellent', NOW(), NOW()),
(UUID(), 'stu-102', 'crs-101', NOW(), 'Enrolled', 70, 65, 75, 71.5, 'Needs improvement', NOW(), NOW()),
(UUID(), 'stu-103', 'crs-102', NOW(), 'Enrolled', 80, 75, 82, 79.5, '', NOW(), NOW()),
(UUID(), 'stu-104', 'crs-103', NOW(), 'Enrolled', 88, 85, 90, 88.0, '', NOW(), NOW()),
(UUID(), 'stu-104', 'crs-104', NOW(), 'Enrolled', 92, 88, 91, 90.5, '', NOW(), NOW()),
(UUID(), 'stu-105', 'crs-103', NOW(), 'Enrolled', 75, 78, 80, 78.5, '', NOW(), NOW());

-- 6. Sinh thêm Attendances (Dữ liệu điểm danh)
-- Sinh viên stu-101 điểm danh môn crs-101
INSERT INTO `Attendances` (`Id`, `StudentId`, `CourseId`, `FacultyId`, `AttendedDate`, `Status`, `Reason`, `CreatedAt`, `UpdatedAt`) VALUES 
(UUID(), 'stu-101', 'crs-101', 'fac-101', DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'Present', '', NOW(), NOW()),
(UUID(), 'stu-102', 'crs-101', 'fac-101', DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'Late', 'Traffic jam', NOW(), NOW()),
(UUID(), 'stu-101', 'crs-101', 'fac-101', CURDATE(), 'Present', '', NOW(), NOW()),
(UUID(), 'stu-102', 'crs-101', 'fac-101', CURDATE(), 'Absent', 'Sick leave', NOW(), NOW()),
(UUID(), 'stu-104', 'crs-103', 'fac-102', DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'Present', '', NOW(), NOW()),
(UUID(), 'stu-105', 'crs-103', 'fac-102', DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'Present', '', NOW(), NOW());

-- LƯU Ý KHI SỬ DỤNG: 
-- Chạy file này trong MySQL Workbench hoặc Command Line trên Database `sims_db`.
-- Ngay sau khi chạy xong, hãy khởi động lại Backend (.NET). 
-- Đoạn mã DbInitializer ở dòng 15 sẽ tự động phát hiện mật khẩu 'TEMP' và update thành hash của 'Password123!'
