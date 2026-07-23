using System.ComponentModel.DataAnnotations;

namespace SIMS.Api.Dtos.Course;

/// <summary>Request body khi tạo khóa học mới. Khớp với createCourse() trong AppFacade.ts.</summary>
public record CreateCourseDto(
    [Required][MaxLength(20)] string Code,
    [Required][MaxLength(150)] string Name,
    [Required] string Instructor,
    [Required] string Schedule,
    [Range(1, 6)] int Credits,
    [Range(1, 500)] int? Capacity,
    string? Department
);

/// <summary>Request body khi cập nhật khóa học. Khớp với updateCourse() trong AppFacade.ts.</summary>
public record UpdateCourseDto(
    string? Name,
    string? Instructor,
    string? Schedule,
    [Range(1, 6)] int? Credits,
    [Range(1, 500)] int? Capacity,
    string? Department
);

/// <summary>Request body khi chỉ cập nhật giảng viên phụ trách. Khớp với updateCourseInstructor().</summary>
public record UpdateInstructorDto([Required] string Instructor);
