namespace SIMS.Api.Models;

/// <summary>
/// Bảng Enrollments — Bảng trung gian Student ↔ Course (N-N).
/// Đồng thời lưu kết quả điểm số của sinh viên trong khóa học đó.
/// Khớp với Grade interface trong frontend/src/types.ts.
/// </summary>
public class Enrollment
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string StudentId { get; set; } = string.Empty; // FK → Students
    public string CourseId { get; set; } = string.Empty;  // FK → Courses
    public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Enrolled"; // "Enrolled" | "Completed" | "Dropped"

    // Grade scores (nullable until graded)
    public decimal? AssignmentScore { get; set; } // 0-100
    public decimal? MidtermScore { get; set; }    // 0-100
    public decimal? FinalScore { get; set; }       // 0-100
    public decimal? TotalGrade { get; set; }       // 0.0-4.0 (calculated)
    public string? Remarks { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Student Student { get; set; } = null!;
    public Course Course { get; set; } = null!;
}
