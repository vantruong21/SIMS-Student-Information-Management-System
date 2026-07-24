namespace SIMS.Api.Dtos.Course;

/// <summary>
/// Response DTO cho Khóa học.
/// Khớp 100% với interface Course trong frontend/src/types.ts.
/// </summary>
public record CourseDto(
    string Id,
    string Code,
    string Name,
    string Instructor,   // Tên giảng viên (string) — khớp với types.ts
    string Schedule,
    string Status,       // "In Progress" | "Midterms" | "Completed"
    decimal? GpaContribution,
    int Credits,
    int? Capacity,
    int? AssignedCount,   // Số sinh viên đã đăng ký — computed field
    string? InstructorEmail = null
);
