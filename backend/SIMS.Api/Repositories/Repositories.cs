using Microsoft.EntityFrameworkCore;
using SIMS.Api.Data;
using SIMS.Api.Models;
using SIMS.Api.Repositories.Interfaces;

namespace SIMS.Api.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _db;
    public UserRepository(ApplicationDbContext db) => _db = db;

    public async Task<User?> GetByIdAsync(string id) =>
        await _db.Users.FirstOrDefaultAsync(u => u.Id == id);

    public async Task<User?> GetByEmailAsync(string email) =>
        await _db.Users.FirstOrDefaultAsync(u => u.Email == email);

    public async Task<User> CreateAsync(User user)
    {
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        return user;
    }

    public async Task<User> UpdateAsync(User user)
    {
        user.UpdatedAt = DateTime.UtcNow;
        _db.Users.Update(user);
        await _db.SaveChangesAsync();
        return user;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var user = await GetByIdAsync(id);
        if (user is null) return false;
        _db.Users.Remove(user);
        await _db.SaveChangesAsync();
        return true;
    }
}

public class StudentRepository : IStudentRepository
{
    private readonly ApplicationDbContext _db;
    public StudentRepository(ApplicationDbContext db) => _db = db;

    public async Task<IEnumerable<Student>> GetAllAsync() =>
        await _db.Students.Include(s => s.User).ToListAsync();

    public async Task<Student?> GetByIdAsync(string id) =>
        await _db.Students.Include(s => s.User).FirstOrDefaultAsync(s => s.Id == id);

    public async Task<Student?> GetByUserIdAsync(string userId) =>
        await _db.Students.Include(s => s.User).FirstOrDefaultAsync(s => s.UserId == userId);

    public async Task<bool> EmailExistsAsync(string email) =>
        await _db.Users.AnyAsync(u => u.Email == email && u.Role == "Student");

    public async Task<Student> CreateAsync(Student student)
    {
        _db.Students.Add(student);
        await _db.SaveChangesAsync();
        return student;
    }

    public async Task<Student> UpdateAsync(Student student)
    {
        student.UpdatedAt = DateTime.UtcNow;
        _db.Students.Update(student);
        await _db.SaveChangesAsync();
        return student;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var student = await GetByIdAsync(id);
        if (student is null) return false;
        _db.Students.Remove(student);
        await _db.SaveChangesAsync();
        return true;
    }
}

public class FacultyRepository : IFacultyRepository
{
    private readonly ApplicationDbContext _db;
    public FacultyRepository(ApplicationDbContext db) => _db = db;

    public async Task<IEnumerable<Faculty>> GetAllAsync() =>
        await _db.Faculties.Include(f => f.User).Include(f => f.Department).ToListAsync();

    public async Task<Faculty?> GetByIdAsync(string id) =>
        await _db.Faculties.Include(f => f.User).Include(f => f.Department)
                           .FirstOrDefaultAsync(f => f.Id == id);

    public async Task<Faculty?> GetByUserIdAsync(string userId) =>
        await _db.Faculties.Include(f => f.User).Include(f => f.Department)
                           .FirstOrDefaultAsync(f => f.UserId == userId);

    public async Task<Faculty> CreateAsync(Faculty faculty)
    {
        _db.Faculties.Add(faculty);
        await _db.SaveChangesAsync();
        return faculty;
    }

    public async Task<Faculty> UpdateAsync(Faculty faculty)
    {
        faculty.UpdatedAt = DateTime.UtcNow;
        _db.Faculties.Update(faculty);
        await _db.SaveChangesAsync();
        return faculty;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var faculty = await GetByIdAsync(id);
        if (faculty is null) return false;
        _db.Faculties.Remove(faculty);
        await _db.SaveChangesAsync();
        return true;
    }
}

public class DepartmentRepository : IDepartmentRepository
{
    private readonly ApplicationDbContext _db;
    public DepartmentRepository(ApplicationDbContext db) => _db = db;

    public async Task<IEnumerable<Department>> GetAllAsync() =>
        await _db.Departments
            .Include(d => d.Faculties)
            .Include(d => d.HeadFaculty!)
                .ThenInclude(f => f.User)
            .ToListAsync();

    public async Task<Department?> GetByIdAsync(string id) =>
        await _db.Departments
            .Include(d => d.Faculties)
            .Include(d => d.HeadFaculty!)
                .ThenInclude(f => f.User)
            .FirstOrDefaultAsync(d => d.Id == id);

    public async Task<bool> CodeExistsAsync(string code) =>
        await _db.Departments.AnyAsync(d => d.DepartmentCode == code);

    public async Task<Department> CreateAsync(Department department)
    {
        _db.Departments.Add(department);
        await _db.SaveChangesAsync();
        return department;
    }

    public async Task<Department> UpdateAsync(Department department)
    {
        department.UpdatedAt = DateTime.UtcNow;
        _db.Departments.Update(department);
        await _db.SaveChangesAsync();
        return department;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var dept = await GetByIdAsync(id);
        if (dept is null) return false;
        _db.Departments.Remove(dept);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<string?> GetFirstIdAsync() =>
        await _db.Departments.Select(d => d.Id).FirstOrDefaultAsync();
}

public class CourseRepository : ICourseRepository
{
    private readonly ApplicationDbContext _db;
    public CourseRepository(ApplicationDbContext db) => _db = db;

    public async Task<IEnumerable<Course>> GetAllWithEnrollmentCountAsync() =>
        await _db.Courses
                 .Include(c => c.Instructor).ThenInclude(f => f!.User)
                 .Include(c => c.Enrollments)
                 .ToListAsync();

    public async Task<Course?> GetByIdAsync(string id) =>
        await _db.Courses.Include(c => c.Instructor).ThenInclude(f => f!.User)
                         .Include(c => c.Enrollments)
                         .FirstOrDefaultAsync(c => c.Id == id);

    public async Task<bool> CodeExistsAsync(string code) =>
        await _db.Courses.AnyAsync(c => c.Code == code);

    public async Task<Course> CreateAsync(Course course)
    {
        _db.Courses.Add(course);
        await _db.SaveChangesAsync();
        return course;
    }

    public async Task<Course> UpdateAsync(Course course)
    {
        course.UpdatedAt = DateTime.UtcNow;
        _db.Courses.Update(course);
        await _db.SaveChangesAsync();
        return course;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var course = await GetByIdAsync(id);
        if (course is null) return false;
        _db.Courses.Remove(course);
        await _db.SaveChangesAsync();
        return true;
    }
}

public class EnrollmentRepository : IEnrollmentRepository
{
    private readonly ApplicationDbContext _db;
    public EnrollmentRepository(ApplicationDbContext db) => _db = db;

    public async Task<IEnumerable<Enrollment>> GetAllAsync() =>
        await _db.Enrollments.ToListAsync();

    public async Task<IEnumerable<Enrollment>> GetByStudentIdAsync(string studentId) =>
        await _db.Enrollments.Where(e => e.StudentId == studentId).ToListAsync();

    public async Task<IEnumerable<Enrollment>> GetByCourseIdAsync(string courseId) =>
        await _db.Enrollments.Where(e => e.CourseId == courseId).ToListAsync();

    public async Task<Enrollment?> GetByStudentAndCourseAsync(string studentId, string courseId) =>
        await _db.Enrollments.FirstOrDefaultAsync(e => e.StudentId == studentId && e.CourseId == courseId);

    public async Task<int> GetEnrolledCountAsync(string courseId) =>
        await _db.Enrollments.CountAsync(e => e.CourseId == courseId && e.Status == "Enrolled");

    public async Task<bool> IsEnrolledAsync(string studentId, string courseId) =>
        await _db.Enrollments.AnyAsync(e => e.StudentId == studentId && e.CourseId == courseId);

    public async Task<Enrollment> CreateAsync(Enrollment enrollment)
    {
        _db.Enrollments.Add(enrollment);
        await _db.SaveChangesAsync();
        return enrollment;
    }

    public async Task<Enrollment> UpdateAsync(Enrollment enrollment)
    {
        enrollment.UpdatedAt = DateTime.UtcNow;
        _db.Enrollments.Update(enrollment);
        await _db.SaveChangesAsync();
        return enrollment;
    }

    public async Task<bool> DeleteAsync(string studentId, string courseId)
    {
        var enrollment = await GetByStudentAndCourseAsync(studentId, courseId);
        if (enrollment is null) return false;
        _db.Enrollments.Remove(enrollment);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task DeleteByStudentIdAsync(string studentId)
    {
        var enrollments = await GetByStudentIdAsync(studentId);
        _db.Enrollments.RemoveRange(enrollments);
        await _db.SaveChangesAsync();
    }

    public async Task DeleteByCourseIdAsync(string courseId)
    {
        var enrollments = await GetByCourseIdAsync(courseId);
        _db.Enrollments.RemoveRange(enrollments);
        await _db.SaveChangesAsync();
    }
}

public class GradeRepository : IGradeRepository
{
    private readonly ApplicationDbContext _db;
    public GradeRepository(ApplicationDbContext db) => _db = db;

    public async Task<IEnumerable<Enrollment>> GetAllGradesAsync() =>
        await _db.Enrollments.Where(e => e.TotalGrade.HasValue).ToListAsync();

    public async Task<IEnumerable<Enrollment>> GetByStudentIdAsync(string studentId) =>
        await _db.Enrollments.Where(e => e.StudentId == studentId).ToListAsync();

    public async Task<decimal> CalculateStudentGpaAsync(string studentId)
    {
        var enrollments = await _db.Enrollments
            .Where(e => e.StudentId == studentId && e.TotalGrade.HasValue)
            .Include(e => e.Course)
            .ToListAsync();

        if (!enrollments.Any()) return 0m;

        var totalPoints = enrollments.Sum(e => e.TotalGrade!.Value * e.Course.Credits);
        var totalCredits = enrollments.Sum(e => e.Course.Credits);
        return totalCredits > 0 ? Math.Round(totalPoints / totalCredits, 2) : 0m;
    }
}
