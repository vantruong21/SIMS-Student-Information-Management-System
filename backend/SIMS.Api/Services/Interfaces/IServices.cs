using SIMS.Api.Dtos.Auth;
using SIMS.Api.Dtos.Student;
using SIMS.Api.Dtos.Faculty;
using SIMS.Api.Dtos.Course;
using SIMS.Api.Dtos.Department;
using SIMS.Api.Dtos.Enrollment;
using SIMS.Api.Dtos.Grade;

namespace SIMS.Api.Services.Interfaces;

/// <summary>SOLID — Interface Segregation: mỗi service có Interface riêng biệt.</summary>

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(string email, string password);
    Task<bool> UpdateProfileAsync(string email, string? phone, string? newPassword);
}

public interface IStudentService
{
    Task<IEnumerable<StudentDto>> GetAllAsync();
    Task<StudentDto?> GetByIdAsync(string id);
    Task<(bool Success, string[] Errors)> CreateAsync(CreateStudentDto dto);
    Task<bool> UpdateAsync(string id, UpdateStudentDto dto);
    Task<bool> DeleteAsync(string id);
    Task<bool> UpdateStatusAsync(string id, string status);
    Task<bool> ToggleLockAsync(string email);
    Task<IEnumerable<CourseDto>> GetStudentCoursesAsync(string studentId);
    Task<IEnumerable<GradeDto>> GetStudentGradesAsync(string studentId);
    Task<decimal> GetStudentGpaAsync(string studentId);
}

public interface IFacultyService
{
    Task<IEnumerable<FacultyDto>> GetAllAsync();
    Task<FacultyDto?> GetByIdAsync(string id);
    Task<(bool Success, string[] Errors)> CreateAsync(CreateFacultyDto dto);
    Task<bool> UpdateAsync(string id, UpdateFacultyDto dto);
    Task<bool> DeleteAsync(string id);
    Task<bool> ToggleLockAsync(string email);
}

public interface ICourseService
{
    Task<IEnumerable<CourseDto>> GetAllAsync();
    Task<CourseDto?> GetByIdAsync(string id);
    Task<(bool Success, string[] Errors)> CreateAsync(CreateCourseDto dto);
    Task<bool> UpdateAsync(string id, UpdateCourseDto dto);
    Task<bool> DeleteAsync(string id);
    Task<bool> UpdateInstructorAsync(string id, string instructor);
}

public interface IDepartmentService
{
    Task<IEnumerable<DepartmentDto>> GetAllAsync();
    Task<DepartmentDto?> GetByIdAsync(string id);
    Task<(bool Success, string[] Errors)> CreateAsync(CreateDepartmentDto dto);
    Task<bool> UpdateAsync(string id, UpdateDepartmentDto dto);
    Task<bool> DeleteAsync(string id);
}

public interface IEnrollmentService
{
    Task<IEnumerable<EnrollmentDto>> GetAllAsync();
    Task<AssignStudentsResultDto> AssignStudentsAsync(AssignStudentsDto dto);
    Task<bool> RemoveStudentAsync(string studentId, string courseId);
}

public interface IGradeService
{
    Task<IEnumerable<GradeDto>> GetAllAsync();
    Task<bool> UpdateGradeAsync(UpdateGradeDto dto);
}
