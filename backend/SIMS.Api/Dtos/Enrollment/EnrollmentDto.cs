using System.ComponentModel.DataAnnotations;

namespace SIMS.Api.Dtos.Enrollment;

/// <summary>
/// Response DTO cho Enrollment.
/// Khớp với dữ liệu getEnrollments() trong AppFacade.ts.
/// </summary>
public record EnrollmentDto(
    string Id,
    string StudentId,
    string CourseId,
    string EnrolledAt,
    string Status
);

/// <summary>
/// Request body gán sinh viên vào khóa học.
/// Khớp với enrollStudents(courseId, studentIds[]) trong AppFacade.ts.
/// </summary>
public record AssignStudentsDto(
    [Required] string CourseId,
    [Required] string[] StudentIds
);

/// <summary>Response trả về sau khi gán sinh viên.</summary>
public record AssignStudentsResultDto(
    bool Success,
    int Enrolled,
    string[] Errors
);
