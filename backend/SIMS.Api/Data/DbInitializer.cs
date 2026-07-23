using SIMS.Api.Models;

namespace SIMS.Api.Data;

using Microsoft.EntityFrameworkCore;
using SIMS.Api.Models;

/// <summary>
/// DbInitializer — Nạp dữ liệu mẫu khởi tạo (Admin, Faculty, Student, Department, Course) vào MySQL khi chạy ứng dụng.
/// </summary>
public static class DbInitializer
{
    public static async Task SeedAsync(ApplicationDbContext db)
    {
        // 0. Sửa các PasswordHash giả lập từ SQL script và Unlock tài khoản
        if (db.Users.Any())
        {
            var validHash = BCrypt.Net.BCrypt.HashPassword("Password123!", workFactor: 11);
            var usersToFix = await db.Users.Where(u => u.PasswordHash.Length < 50 || u.FailedLoginAttempts > 0 || u.IsLocked).ToListAsync();
            foreach (var u in usersToFix)
            {
                if (u.PasswordHash.Length < 50) u.PasswordHash = validHash;
                u.FailedLoginAttempts = 0;
                u.IsLocked = false;
                u.LockedUntil = null;
            }
            if (usersToFix.Count > 0)
            {
                await db.SaveChangesAsync();
            }
        }

        // 1. Seed Users if empty
        if (!db.Users.Any())
        {
            var adminUser = new User
            {
                Id = "usr-admin-1",
                Email = "admin@elevate.edu",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!", workFactor: 11),
                FullName = "GS. Trần Hoàng",
                Role = "Admin",
                AvatarUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuDF1nW0r0b5Mhu1d-72_6JqL8uTQopKz518YIviupE6f5RREs2Mw9Mh0hoX2tTXh4mx1nIS_MrOdp53iAE3wNj1inO3NR_XLfUOQZfXbAX8Dl80n8tsroJRzLY2tFrQLbb5x5uJ5rkXkrBD7Pp-mvi5RZjHMb7H_J81eVXaz6s1KEXDRMgxkvs8uKB5SZbd4PhNGqnF_yZTC7N0DkP0mUKhKY2raZH9AvM-ZGaPN3fQCEUHjEpQYW2jlw",
                IsActive = true
            };

            var facultyUser = new User
            {
                Id = "usr-fac-1",
                Email = "feynman@elevate.edu",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!", workFactor: 11),
                FullName = "Richard Feynman",
                Role = "Faculty",
                AvatarUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256&h=256",
                IsActive = true
            };

            var studentUser = new User
            {
                Id = "usr-stu-1",
                Email = "scholar@elevate.edu",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!", workFactor: 11),
                FullName = "John Doe",
                Role = "Student",
                AvatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256&h=256",
                IsActive = true
            };

            db.Users.AddRange(adminUser, facultyUser, studentUser);
            await db.SaveChangesAsync();

            // 2. Seed Departments
            var deptIt = new Department
            {
                Id = "dept-1",
                DepartmentCode = "IT",
                Name = "Khoa Công nghệ Thông tin",
                Description = "Đào tạo kỹ sư phần mềm, khoa học máy tính và AI."
            };
            var deptMkt = new Department
            {
                Id = "dept-2",
                DepartmentCode = "MKT",
                Name = "Khoa Kinh tế Quản trị",
                Description = "Quản trị kinh doanh, Marketing và Tài chính."
            };
            var deptDes = new Department
            {
                Id = "dept-3",
                DepartmentCode = "DES",
                Name = "Khoa Thiết kế Đồ họa",
                Description = "Thiết kế UI/UX, Đồ họa 2D/3D và Truyền thông."
            };

            db.Departments.AddRange(deptIt, deptMkt, deptDes);
            await db.SaveChangesAsync();

            // 3. Seed Faculty profile
            var faculty = new Faculty
            {
                Id = "fac-1",
                UserId = facultyUser.Id,
                FacultyCode = "FAC2024001",
                DepartmentId = deptIt.Id,
                Degree = "Professor"
            };
            db.Faculties.Add(faculty);
            await db.SaveChangesAsync();

            deptIt.HeadFacultyId = faculty.Id;
            db.Departments.Update(deptIt);
            await db.SaveChangesAsync();

            // 4. Seed Student profile
            var student = new Student
            {
                Id = "stu-1",
                UserId = studentUser.Id,
                StudentCode = "STU2024001",
                Program = "Software Engineering",
                Status = "Active",
                Gpa = 3.85m,
                TotalCredits = 45
            };
            db.Students.Add(student);
            await db.SaveChangesAsync();

            // 5. Seed Courses
            var course1 = new Course
            {
                Id = "c-se101",
                Code = "SE101",
                Name = "Application Development",
                DepartmentId = deptIt.Id,
                InstructorId = faculty.Id,
                Schedule = "Mon/Wed 9:00 AM",
                Credits = 3,
                Capacity = 40,
                Status = "In Progress"
            };
            var course2 = new Course
            {
                Id = "c-se102",
                Code = "SE102",
                Name = "Applied Programming & Design Principles",
                DepartmentId = deptIt.Id,
                InstructorId = faculty.Id,
                Schedule = "Tue/Thu 1:00 PM",
                Credits = 4,
                Capacity = 35,
                Status = "In Progress"
            };

            db.Courses.AddRange(course1, course2);
            await db.SaveChangesAsync();

            // 6. Seed Enrollments & Grades
            var enr1 = new Enrollment
            {
                Id = "enr-1",
                StudentId = student.Id,
                CourseId = course1.Id,
                Status = "Enrolled",
                AssignmentScore = 90.00m,
                MidtermScore = 85.00m,
                FinalScore = 92.00m,
                TotalGrade = 3.80m
            };
            var enr2 = new Enrollment
            {
                Id = "enr-2",
                StudentId = student.Id,
                CourseId = course2.Id,
                Status = "Enrolled",
                AssignmentScore = 88.00m,
                MidtermScore = 90.00m,
                FinalScore = 86.00m,
                TotalGrade = 3.70m
            };

            db.Enrollments.AddRange(enr1, enr2);
            await db.SaveChangesAsync();
        }
    }
}
