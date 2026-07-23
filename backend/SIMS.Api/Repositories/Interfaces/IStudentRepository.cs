using SIMS.Api.Models;

namespace SIMS.Api.Repositories.Interfaces;

/// <summary>
/// SOLID - Interface Segregation: Interface riêng cho Student data access.
/// SOLID - Dependency Inversion: Service phụ thuộc vào Interface này, không phụ thuộc concrete class.
/// </summary>
public interface IStudentRepository
{
    Task<IEnumerable<Student>> GetAllAsync();
    Task<Student?> GetByIdAsync(string id);
    Task<Student?> GetByUserIdAsync(string userId);
    Task<bool> EmailExistsAsync(string email);
    Task<Student> CreateAsync(Student student);
    Task<Student> UpdateAsync(Student student);
    Task<bool> DeleteAsync(string id);
}
