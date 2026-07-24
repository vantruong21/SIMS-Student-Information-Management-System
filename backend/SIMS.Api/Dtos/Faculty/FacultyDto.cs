namespace SIMS.Api.Dtos.Faculty;

/// <summary>
/// Response DTO cho Giảng viên.
/// Khớp 100% với interface Faculty trong frontend/src/types.ts.
/// </summary>
public record FacultyDto(
    string Id,
    string Name,
    string Email,
    string Department,       // Tên khoa (string), khớp với types.ts: department: string
    string Designation,      // Học vị: "Master" | "PhD" | "Professor"
    string[] CoursesTaught,  // Danh sách tên môn đang dạy
    string? AvatarUrl,
    string Status,           // "Active" | "Pending" | "Locked"
    bool IsLocked,
    string? Phone
);
