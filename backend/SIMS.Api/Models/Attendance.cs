namespace SIMS.Api.Models;

/// <summary>
/// Bảng Attendances — Lưu trạng thái điểm danh từng buổi học của Sinh viên.
/// Được tạo khi Faculty bấm "Freeze Attendance Log".
/// </summary>
public class Attendance
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string StudentId { get; set; } = string.Empty;   // FK → Students
    public string CourseId { get; set; } = string.Empty;    // FK → Courses
    public string FacultyId { get; set; } = string.Empty;   // FK → Faculty (người điểm danh)
    public DateTime AttendedDate { get; set; } = DateTime.UtcNow;
    public string Status { get; set; } = "Present"; // "Present" | "Late" | "Absent"
    public string? Reason { get; set; }              // Lý do vắng (nếu Absent)
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Student Student { get; set; } = null!;
    public Course Course { get; set; } = null!;
}
