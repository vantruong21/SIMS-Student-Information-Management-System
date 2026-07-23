using System.ComponentModel.DataAnnotations;

namespace SIMS.Api.Dtos.Student;

/// <summary>
/// Request body khi Admin tạo sinh viên mới.
/// Khớp với data object trong AppFacade.registerStudent().
/// </summary>
public record CreateStudentDto(
    [Required][MaxLength(100)] string Name,
    [Required][EmailAddress][MaxLength(150)] string Email,
    [Required][MaxLength(100)] string Program,
    [MaxLength(20)] string? Phone,
    string? DateOfBirth,
    string? Address,
    string? Status
);
