namespace SIMS.Api.Dtos.Student;

/// <summary>
/// Response DTO cho Sinh viên.
/// Khớp 100% với interface Student trong frontend/src/types.ts.
/// </summary>
public record StudentDto(
    string Id,
    string Name,
    string Email,
    string Program,
    string Status,       // "Active" | "Pending" | "Suspended" | "Graduated"
    string? AvatarUrl,
    decimal? Gpa,
    int? TotalCredits,
    string? Grade,       // Letter grade summary e.g. "A", "B+"
    bool IsLocked,
    string? Phone
);
