namespace SIMS.Api.Models;

/// <summary>
/// Bảng Courses — Khóa học/học phần do trường cung cấp.
/// Khớp với interface Course trong frontend/src/types.ts.
/// </summary>
public class Course
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Code { get; set; } = string.Empty; // e.g. "SE101"
    public string Name { get; set; } = string.Empty;
    public string DepartmentId { get; set; } = string.Empty; // FK → Departments
    public string? InstructorId { get; set; } // FK → Faculty (nullable)
    public string? Schedule { get; set; } // e.g. "Mon/Wed 9:00 AM"
    public string Status { get; set; } = "In Progress"; // "In Progress" | "Midterms" | "Completed"
    public int Credits { get; set; } = 3;
    public int Capacity { get; set; } = 35;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Department Department { get; set; } = null!;
    public Faculty? Instructor { get; set; }
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}
