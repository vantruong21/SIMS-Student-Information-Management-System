using System.ComponentModel.DataAnnotations;

namespace SIMS.Api.Dtos.Faculty;

/// <summary>Request body khi Admin tạo giảng viên mới. Khớp với addFaculty() trong AppFacade.ts.</summary>
public record CreateFacultyDto(
    [Required][MaxLength(100)] string Name,
    [Required][EmailAddress][MaxLength(150)] string Email,
    [MaxLength(20)] string? Phone,
    string? Department
);
