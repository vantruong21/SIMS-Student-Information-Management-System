using SIMS.Api.Models;

namespace SIMS.Api.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(string id);
    Task<User?> GetByEmailAsync(string email);
    Task<User> CreateAsync(User user);
    Task<User> UpdateAsync(User user);
    Task<bool> DeleteAsync(string id);
}

public interface IFacultyRepository
{
    Task<IEnumerable<Faculty>> GetAllAsync();
    Task<Faculty?> GetByIdAsync(string id);
    Task<Faculty?> GetByUserIdAsync(string userId);
    Task<Faculty> CreateAsync(Faculty faculty);
    Task<Faculty> UpdateAsync(Faculty faculty);
    Task<bool> DeleteAsync(string id);
}

public interface IDepartmentRepository
{
    Task<IEnumerable<Department>> GetAllAsync();
    Task<Department?> GetByIdAsync(string id);
    Task<bool> CodeExistsAsync(string code);
    Task<string?> GetFirstIdAsync();
    Task<Department> CreateAsync(Department department);
    Task<Department> UpdateAsync(Department department);
    Task<bool> DeleteAsync(string id);
}

public interface ICourseRepository
{
    Task<IEnumerable<Course>> GetAllWithEnrollmentCountAsync();
    Task<Course?> GetByIdAsync(string id);
    Task<bool> CodeExistsAsync(string code);
    Task<Course> CreateAsync(Course course);
    Task<Course> UpdateAsync(Course course);
    Task<bool> DeleteAsync(string id);
}

public interface IEnrollmentRepository
{
    Task<IEnumerable<Enrollment>> GetAllAsync();
    Task<IEnumerable<Enrollment>> GetByStudentIdAsync(string studentId);
    Task<IEnumerable<Enrollment>> GetByCourseIdAsync(string courseId);
    Task<Enrollment?> GetByStudentAndCourseAsync(string studentId, string courseId);
    Task<int> GetEnrolledCountAsync(string courseId);
    Task<bool> IsEnrolledAsync(string studentId, string courseId);
    Task<Enrollment> CreateAsync(Enrollment enrollment);
    Task<Enrollment> UpdateAsync(Enrollment enrollment);
    Task<bool> DeleteAsync(string studentId, string courseId);
    Task DeleteByStudentIdAsync(string studentId);
    Task DeleteByCourseIdAsync(string courseId);
}

public interface IGradeRepository
{
    Task<IEnumerable<Enrollment>> GetAllGradesAsync();
    Task<IEnumerable<Enrollment>> GetByStudentIdAsync(string studentId);
    Task<decimal> CalculateStudentGpaAsync(string studentId);
}
