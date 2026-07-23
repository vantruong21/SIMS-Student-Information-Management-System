namespace SIMS.Api.Models;

/// <summary>
/// Bảng Students — Hồ sơ học tập của Sinh viên, quan hệ 1-1 với User.
/// Khớp với interface Student trong frontend/src/types.ts.
/// </summary>
public class Student
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string UserId { get; set; } = string.Empty; // FK 1-1 → Users
    public string StudentCode { get; set; } = string.Empty;
    public string Program { get; set; } = string.Empty; // "Software Engineering" | "Marketing" | etc.
    public string Status { get; set; } = "Active"; // "Active" | "Pending" | "Suspended" | "Graduated"
    public decimal Gpa { get; set; } = 0.00m;
    public int TotalCredits { get; set; } = 0;
    public DateOnly? DateOfBirth { get; set; }
    public string? Address { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public User User { get; set; } = null!;
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}
