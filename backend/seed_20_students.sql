USE `sims_db`;

-- ====================================================================
-- SEED 20 ADDITIONAL STUDENTS (Tạo 20 sinh viên mẫu)
-- Tất cả sinh viên sử dụng mật khẩu đăng nhập mặc định: "Password123!"
-- ====================================================================

-- 1. Insert 20 Users for Students (Bao gồm các trường FailedLoginAttempts, IsLocked, CreatedAt, UpdatedAt)
INSERT INTO `Users` (`Id`, `Email`, `PasswordHash`, `FullName`, `Role`, `IsActive`, `Phone`, `FailedLoginAttempts`, `IsLocked`, `CreatedAt`, `UpdatedAt`) VALUES
('usr-stu-02', 'nguyen.van.a@elevate.edu', '$2a$11$q9F1w54xQJ.EwZgE3k5Ere9V2X8V.G8F5Z9w8Z5w8Z5w8Z5w8Z5w8', 'Nguyễn Văn An', 'Student', 1, '0901234567', 0, 0, NOW(), NOW()),
('usr-stu-03', 'tran.thi.bich@elevate.edu', '$2a$11$q9F1w54xQJ.EwZgE3k5Ere9V2X8V.G8F5Z9w8Z5w8Z5w8Z5w8Z5w8', 'Trần Thị Bích', 'Student', 1, '0912345678', 0, 0, NOW(), NOW()),
('usr-stu-04', 'le.hoang.cuong@elevate.edu', '$2a$11$q9F1w54xQJ.EwZgE3k5Ere9V2X8V.G8F5Z9w8Z5w8Z5w8Z5w8Z5w8', 'Lê Hoàng Cường', 'Student', 1, '0923456789', 0, 0, NOW(), NOW()),
('usr-stu-05', 'pham.minh.duc@elevate.edu', '$2a$11$q9F1w54xQJ.EwZgE3k5Ere9V2X8V.G8F5Z9w8Z5w8Z5w8Z5w8Z5w8', 'Phạm Minh Đức', 'Student', 1, '0934567890', 0, 0, NOW(), NOW()),
('usr-stu-06', 'hoang.thu.ha@elevate.edu', '$2a$11$q9F1w54xQJ.EwZgE3k5Ere9V2X8V.G8F5Z9w8Z5w8Z5w8Z5w8Z5w8', 'Hoàng Thu Hà', 'Student', 1, '0945678901', 0, 0, NOW(), NOW()),
('usr-stu-07', 'do.quang.hieu@elevate.edu', '$2a$11$q9F1w54xQJ.EwZgE3k5Ere9V2X8V.G8F5Z9w8Z5w8Z5w8Z5w8Z5w8', 'Đỗ Quang Hiếu', 'Student', 1, '0956789012', 0, 0, NOW(), NOW()),
('usr-stu-08', 'vu.mai.huong@elevate.edu', '$2a$11$q9F1w54xQJ.EwZgE3k5Ere9V2X8V.G8F5Z9w8Z5w8Z5w8Z5w8Z5w8', 'Vũ Mai Hương', 'Student', 1, '0967890123', 0, 0, NOW(), NOW()),
('usr-stu-09', 'bui.tuan.kiet@elevate.edu', '$2a$11$q9F1w54xQJ.EwZgE3k5Ere9V2X8V.G8F5Z9w8Z5w8Z5w8Z5w8Z5w8', 'Bùi Tuấn Kiệt', 'Student', 1, '0978901234', 0, 0, NOW(), NOW()),
('usr-stu-10', 'dinh.phuong.linh@elevate.edu', '$2a$11$q9F1w54xQJ.EwZgE3k5Ere9V2X8V.G8F5Z9w8Z5w8Z5w8Z5w8Z5w8', 'Đinh Phương Linh', 'Student', 1, '0989012345', 0, 0, NOW(), NOW()),
('usr-stu-11', 'ngo.van.long@elevate.edu', '$2a$11$q9F1w54xQJ.EwZgE3k5Ere9V2X8V.G8F5Z9w8Z5w8Z5w8Z5w8Z5w8', 'Ngô Văn Long', 'Student', 1, '0990123456', 0, 0, NOW(), NOW()),
('usr-stu-12', 'duong.khanh.nam@elevate.edu', '$2a$11$q9F1w54xQJ.EwZgE3k5Ere9V2X8V.G8F5Z9w8Z5w8Z5w8Z5w8Z5w8', 'Dương Khánh Nam', 'Student', 1, '0902345678', 0, 0, NOW(), NOW()),
('usr-stu-13', 'ly.kim.ngan@elevate.edu', '$2a$11$q9F1w54xQJ.EwZgE3k5Ere9V2X8V.G8F5Z9w8Z5w8Z5w8Z5w8Z5w8', 'Lý Kim Ngân', 'Student', 1, '0913456789', 0, 0, NOW(), NOW()),
('usr-stu-14', 'phan.hong.phuc@elevate.edu', '$2a$11$q9F1w54xQJ.EwZgE3k5Ere9V2X8V.G8F5Z9w8Z5w8Z5w8Z5w8Z5w8', 'Phan Hồng Phúc', 'Student', 1, '0924567890', 0, 0, NOW(), NOW()),
('usr-stu-15', 'trinh.bao.quang@elevate.edu', '$2a$11$q9F1w54xQJ.EwZgE3k5Ere9V2X8V.G8F5Z9w8Z5w8Z5w8Z5w8Z5w8', 'Trịnh Bảo Quang', 'Student', 1, '0935678901', 0, 0, NOW(), NOW()),
('usr-stu-16', 'nguyen.ngoc.quynh@elevate.edu', '$2a$11$q9F1w54xQJ.EwZgE3k5Ere9V2X8V.G8F5Z9w8Z5w8Z5w8Z5w8Z5w8', 'Nguyễn Ngọc Quỳnh', 'Student', 1, '0946789012', 0, 0, NOW(), NOW()),
('usr-stu-17', 'tran.dinh.son@elevate.edu', '$2a$11$q9F1w54xQJ.EwZgE3k5Ere9V2X8V.G8F5Z9w8Z5w8Z5w8Z5w8Z5w8', 'Trần Đình Sơn', 'Student', 1, '0957890123', 0, 0, NOW(), NOW()),
('usr-stu-18', 'le.phuong.thao@elevate.edu', '$2a$11$q9F1w54xQJ.EwZgE3k5Ere9V2X8V.G8F5Z9w8Z5w8Z5w8Z5w8Z5w8', 'Lê Phương Thảo', 'Student', 1, '0968901234', 0, 0, NOW(), NOW()),
('usr-stu-19', 'pham.minh.tri@elevate.edu', '$2a$11$q9F1w54xQJ.EwZgE3k5Ere9V2X8V.G8F5Z9w8Z5w8Z5w8Z5w8Z5w8', 'Phạm Minh Trí', 'Student', 1, '0979012345', 0, 0, NOW(), NOW()),
('usr-stu-20', 'hoang.ha.vy@elevate.edu', '$2a$11$q9F1w54xQJ.EwZgE3k5Ere9V2X8V.G8F5Z9w8Z5w8Z5w8Z5w8Z5w8', 'Hoàng Hà Vy', 'Student', 1, '0980123456', 0, 0, NOW(), NOW()),
('usr-stu-21', 'do.hoang.yen@elevate.edu', '$2a$11$q9F1w54xQJ.EwZgE3k5Ere9V2X8V.G8F5Z9w8Z5w8Z5w8Z5w8Z5w8', 'Đỗ Hoàng Yến', 'Student', 1, '0991234567', 0, 0, NOW(), NOW());

-- 2. Insert 20 Student Profiles linked to Users (Bao gồm các trường CreatedAt, UpdatedAt)
INSERT INTO `Students` (`Id`, `UserId`, `StudentCode`, `Program`, `Status`, `GPA`, `TotalCredits`, `DateOfBirth`, `Address`, `CreatedAt`, `UpdatedAt`) VALUES
('stu-02', 'usr-stu-02', 'STU2024002', 'Software Engineering', 'Active', 3.65, 42, '2003-05-14', 'Hà Nội', NOW(), NOW()),
('stu-03', 'usr-stu-03', 'STU2024003', 'Software Engineering', 'Active', 3.90, 60, '2003-08-22', 'TP. Hồ Chí Minh', NOW(), NOW()),
('stu-04', 'usr-stu-04', 'STU2024004', 'Software Engineering', 'Active', 3.20, 38, '2002-11-10', 'Đà Nẵng', NOW(), NOW()),
('stu-05', 'usr-stu-05', 'STU2024005', 'Marketing', 'Active', 3.45, 45, '2003-01-30', 'Hải Phòng', NOW(), NOW()),
('stu-06', 'usr-stu-06', 'STU2024006', 'Marketing', 'Active', 3.75, 52, '2003-09-18', 'Cần Thơ', NOW(), NOW()),
('stu-07', 'usr-stu-07', 'STU2024007', 'Marketing', 'Pending', 3.10, 30, '2004-03-25', 'Hà Nội', NOW(), NOW()),
('stu-08', 'usr-stu-08', 'STU2024008', 'Digital Design', 'Active', 3.80, 48, '2003-12-05', 'Quảng Ninh', NOW(), NOW()),
('stu-09', 'usr-stu-09', 'STU2024009', 'Digital Design', 'Active', 3.55, 40, '2002-07-19', 'Nghệ An', NOW(), NOW()),
('stu-10', 'usr-stu-10', 'STU2024010', 'Digital Design', 'Active', 3.95, 65, '2003-04-12', 'Thừa Thiên Huế', NOW(), NOW()),
('stu-11', 'usr-stu-11', 'STU2024011', 'Business Administration', 'Active', 2.95, 28, '2004-06-08', 'Bình Dương', NOW(), NOW()),
('stu-12', 'usr-stu-12', 'STU2024012', 'Business Administration', 'Active', 3.35, 44, '2003-10-15', 'Đồng Nai', NOW(), NOW()),
('stu-13', 'usr-stu-13', 'STU2024013', 'Business Administration', 'Pending', 3.00, 25, '2004-02-01', 'Hà Nội', NOW(), NOW()),
('stu-14', 'usr-stu-14', 'STU2024014', 'Software Engineering', 'Active', 3.50, 42, '2003-11-28', 'Nam Định', NOW(), NOW()),
('stu-15', 'usr-stu-15', 'STU2024015', 'Software Engineering', 'Active', 3.88, 58, '2003-03-17', 'Thái Bình', NOW(), NOW()),
('stu-16', 'usr-stu-16', 'STU2024016', 'Software Engineering', 'Active', 3.60, 46, '2002-09-09', 'Thanh Hóa', NOW(), NOW()),
('stu-17', 'usr-stu-17', 'STU2024017', 'Marketing', 'Active', 3.25, 36, '2003-07-21', 'Vũng Tàu', NOW(), NOW()),
('stu-18', 'usr-stu-18', 'STU2024018', 'Marketing', 'Active', 3.70, 50, '2003-05-04', 'Khánh Hòa', NOW(), NOW()),
('stu-19', 'usr-stu-19', 'STU2024019', 'Digital Design', 'Active', 3.40, 39, '2002-08-11', 'Lâm Đồng', NOW(), NOW()),
('stu-20', 'usr-stu-20', 'STU2024020', 'Digital Design', 'Active', 3.82, 54, '2003-10-30', 'Hà Nội', NOW(), NOW()),
('stu-21', 'usr-stu-21', 'STU2024021', 'Business Administration', 'Active', 3.68, 48, '2003-01-15', 'TP. Hồ Chí Minh', NOW(), NOW());
