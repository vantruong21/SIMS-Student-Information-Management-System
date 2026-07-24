using System.ComponentModel.DataAnnotations;

namespace SIMS.Api.Dtos.Department;

/// <summary>
/// Response DTO cho Khoa.
/// Khớp 100% với interface Department trong frontend/src/types.ts.
/// </summary>
public record DepartmentDto(
    string Id,
    string Name,
    string Head,         // Tên trưởng khoa — khớp với types.ts: head: string
    string Description,
    int FacultyCount
);

/// <summary>Request body tạo khoa mới. Khớp với createDepartment() trong AppFacade.ts.</summary>
public record CreateDepartmentDto(
    [Required][MaxLength(100)] string Name,
    [Required] string Head,
    string Description,
    int? FacultyCount,
    string[]? FacultyIds
);

/// <summary>Request body cập nhật khoa. Khớp với updateDepartment() trong AppFacade.ts.</summary>
public record UpdateDepartmentDto(
    string? Name,
    string? Head,
    string? Description,
    int? FacultyCount,
    string[]? FacultyIds
);

