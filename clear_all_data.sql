-- =========================================================================
-- SCRIPT XOÁ SẠCH DỮ LIỆU (Giữ nguyên cấu trúc bảng)
-- Lưu ý: Lệnh này sẽ xoá toàn bộ data, không thể hoàn tác!
-- =========================================================================

-- Tạm thời tắt kiểm tra khoá ngoại (Foreign Key) để tránh lỗi ràng buộc khi xoá
SET FOREIGN_KEY_CHECKS = 0;

-- Làm rỗng toàn bộ các bảng dữ liệu
DELETE FROM `Attendances`;
DELETE FROM `Enrollments`;
DELETE FROM `Courses`;
DELETE FROM `Students`;
DELETE FROM `Faculties`;
DELETE FROM `Departments`;
DELETE FROM `Users`;

-- Bật lại kiểm tra khoá ngoại
SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================================
-- Sau khi chạy lệnh này, DB của bạn sẽ trống rỗng 100%.
-- Bạn có thể chạy lại file seed_more_data.sql (hoặc để DbInitializer tự chạy)
-- =========================================================================
