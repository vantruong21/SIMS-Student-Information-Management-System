using SIMS.Api.Dtos.Course;
using SIMS.Api.Dtos.Grade;
using SIMS.Api.Dtos.Student;
using SIMS.Api.Models;
using SIMS.Api.Repositories.Interfaces;
using SIMS.Api.Services.Interfaces;

namespace SIMS.Api.Services;

/// <summary>
/// StudentService — Business Logic cho quản lý Sinh viên.
/// SOLID — Single Responsibility: chỉ xử lý nghiệp vụ sinh viên.
/// SOLID — Dependency Inversion: phụ thuộc vào Interfaces, không phụ thuộc concrete class.
/// </summary>
public class StudentService : IStudentService
{
    private readonly IStudentRepository _studentRepo;
    private readonly IUserRepository _userRepo;
    private readonly IEnrollmentRepository _enrollmentRepo;
    private readonly IGradeRepository _gradeRepo;
    private readonly ICourseRepository _courseRepo;

    public StudentService(
        IStudentRepository studentRepo,
        IUserRepository userRepo,
        IEnrollmentRepository enrollmentRepo,
        IGradeRepository gradeRepo,
        ICourseRepository courseRepo)
    {
        _studentRepo = studentRepo;
        _userRepo = userRepo;
        _enrollmentRepo = enrollmentRepo;
        _gradeRepo = gradeRepo;
        _courseRepo = courseRepo;
    }

    public async Task<IEnumerable<StudentDto>> GetAllAsync()
    {
        var students = await _studentRepo.GetAllAsync();
        return students.Select(MapToDto);
    }

    public async Task<StudentDto?> GetByIdAsync(string id)
    {
        var student = await _studentRepo.GetByIdAsync(id);
        return student is null ? null : MapToDto(student);
    }

    public async Task<(bool Success, string[] Errors)> CreateAsync(CreateStudentDto dto)
    {
        if (await _studentRepo.EmailExistsAsync(dto.Email))
            return (false, ["A student with this email already exists"]);

        var studentId = $"STU-{Guid.NewGuid().ToString()[..8].ToUpper()}";
        var userId = Guid.NewGuid().ToString();

        var rawPassword = !string.IsNullOrWhiteSpace(dto.Password)
            ? dto.Password
            : "elevate2026";

        // Create User account
        var user = new User
        {
            Id = userId,
            FullName = dto.Name,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(rawPassword, workFactor: 11),
            Role = "Student",
            Phone = dto.Phone,
            IsActive = dto.Status is null || dto.Status == "Active"
        };
        await _userRepo.CreateAsync(user);


        // Create Student profile
        DateOnly? dob = null;
        if (!string.IsNullOrWhiteSpace(dto.DateOfBirth) && DateOnly.TryParse(dto.DateOfBirth, out var parsedDob))
            dob = parsedDob;

        var student = new Student
        {
            Id = studentId,
            UserId = userId,
            StudentCode = $"STU{DateTime.UtcNow.Year}{new Random().Next(1000, 9999)}",
            Program = dto.Program,
            Status = dto.Status ?? "Active",
            DateOfBirth = dob,
            Address = dto.Address
        };
        await _studentRepo.CreateAsync(student);

        return (true, []);
    }

    public async Task<bool> UpdateAsync(string id, UpdateStudentDto dto)
    {
        var student = await _studentRepo.GetByIdAsync(id);
        if (student is null) return false;

        if (dto.Program is not null) student.Program = dto.Program;
        if (dto.Status is not null) student.Status = dto.Status;

        // Sync name & email to User table
        if (dto.Name is not null) student.User.FullName = dto.Name;
        if (dto.Email is not null) student.User.Email = dto.Email;

        await _userRepo.UpdateAsync(student.User);
        await _studentRepo.UpdateAsync(student);
        return true;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var student = await _studentRepo.GetByIdAsync(id);
        if (student is null) return false;

        // Cascade: delete enrollments first, then student (User cascade deletes via EF)
        await _enrollmentRepo.DeleteByStudentIdAsync(id);
        return await _studentRepo.DeleteAsync(id);
    }

    public async Task<bool> UpdateStatusAsync(string id, string status)
    {
        var student = await _studentRepo.GetByIdAsync(id);
        if (student is null) return false;

        student.Status = status;
        student.User.IsActive = status == "Active";

        await _userRepo.UpdateAsync(student.User);
        await _studentRepo.UpdateAsync(student);
        return true;
    }

    public async Task<bool> ToggleLockAsync(string email)
    {
        var user = await _userRepo.GetByEmailAsync(email);
        if (user is null) return false;

        user.IsLocked = !user.IsLocked;
        if (!user.IsLocked) user.FailedLoginAttempts = 0;

        await _userRepo.UpdateAsync(user);
        return true;
    }

    public async Task<IEnumerable<CourseDto>> GetStudentCoursesAsync(string studentId)
    {
        var enrollments = await _enrollmentRepo.GetByStudentIdAsync(studentId);
        var result = new List<CourseDto>();
        foreach (var e in enrollments)
        {
            var course = await _courseRepo.GetByIdAsync(e.CourseId);
            if (course is not null)
                result.Add(MapCourseToDto(course));
        }
        return result;
    }

    public async Task<IEnumerable<GradeDto>> GetStudentGradesAsync(string studentId)
    {
        var grades = await _gradeRepo.GetByStudentIdAsync(studentId);
        return grades.Where(g => g.TotalGrade.HasValue).Select(g => new GradeDto(
            g.Id,
            g.StudentId,
            g.CourseId,
            GpaToLetterGrade(g.TotalGrade!.Value),
            g.TotalGrade!.Value,
            g.Remarks,
            g.UpdatedAt.ToString("o")
        ));
    }

    public async Task<decimal> GetStudentGpaAsync(string studentId) =>
        await _gradeRepo.CalculateStudentGpaAsync(studentId);

    // ── Mapping Helpers ──────────────────────────────────────────────────────

    private static StudentDto MapToDto(Student s) => new(
        s.Id,
        s.User.FullName,
        s.User.Email,
        s.Program,
        s.Status,
        s.User.AvatarUrl,
        s.Gpa,
        s.TotalCredits,
        null, // grade summary computed separately
        s.User.IsLocked,
        s.User.Phone
    );

    private static CourseDto MapCourseToDto(Course c) => new(
        c.Id,
        c.Code,
        c.Name,
        c.Instructor?.User.FullName ?? "Staff Academic",
        c.Schedule ?? string.Empty,
        c.Status,
        null,
        c.Credits,
        c.Capacity,
        c.Enrollments.Count
    );

    private static string GpaToLetterGrade(decimal gpa) => gpa switch
    {
        >= 3.7m => "A",
        >= 3.3m => "A-",
        >= 3.0m => "B+",
        >= 2.7m => "B",
        >= 2.3m => "B-",
        >= 2.0m => "C+",
        >= 1.7m => "C",
        >= 1.0m => "D",
        _ => "F"
    };
}
