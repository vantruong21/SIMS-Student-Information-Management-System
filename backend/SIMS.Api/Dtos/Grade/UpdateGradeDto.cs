using System.ComponentModel.DataAnnotations;

namespace SIMS.Api.Dtos.Grade;

/// <summary>
/// Request body cập nhật điểm.
/// Khớp với updateGrade(studentId, courseId, type, value) trong AppFacade.ts.
/// type: "assignment" | "midterm" | "final"
/// </summary>
public record UpdateGradeDto(
    [Required] string StudentId,
    [Required] string CourseId,
    [Required][RegularExpression("assignment|midterm|final")] string Type,
    [Range(0, 100)] decimal Value
);

/// <summary>
/// Response DTO cho Grade.
/// Khớp với interface Grade trong frontend/src/types.ts.
/// </summary>
public record GradeDto(
    string Id,
    string StudentId,
    string CourseId,
    string Grade,        // Letter grade: "A", "B+", etc.
    decimal Score,       // TotalGrade 0.0-4.0
    string? Remarks,
    string UpdatedAt
);
