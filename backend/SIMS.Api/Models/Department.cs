namespace SIMS.Api.Models;

/// <summary>
/// Bảng Departments — Khoa/Viện đào tạo của trường.
/// Khớp với interface Department trong frontend/src/types.ts.
/// </summary>
public class Department
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string DepartmentCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? HeadFacultyId { get; set; } // FK → Faculty (optional)
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Faculty? HeadFaculty { get; set; }
    public ICollection<Faculty> Faculties { get; set; } = new List<Faculty>();
    public ICollection<Course> Courses { get; set; } = new List<Course>();
}
