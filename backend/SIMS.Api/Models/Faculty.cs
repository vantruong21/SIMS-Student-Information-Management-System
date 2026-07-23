namespace SIMS.Api.Models;

/// <summary>
/// Bảng Faculty — Hồ sơ công tác của Giảng viên, quan hệ 1-1 với User.
/// Khớp với interface Faculty trong frontend/src/types.ts.
/// </summary>
public class Faculty
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string UserId { get; set; } = string.Empty; // FK 1-1 → Users
    public string FacultyCode { get; set; } = string.Empty;
    public string DepartmentId { get; set; } = string.Empty; // FK → Departments
    public string Degree { get; set; } = "Master"; // "Master" | "PhD" | "Professor"
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public User User { get; set; } = null!;
    public Department Department { get; set; } = null!;
    public ICollection<Course> Courses { get; set; } = new List<Course>();
}
