namespace SIMS.Api.Dtos.Faculty;

/// <summary>Request body cập nhật giảng viên. Khớp với updateFaculty() trong AppFacade.ts.</summary>
public record UpdateFacultyDto(
    string? Name,
    string? Email,
    string? Phone,
    bool? IsActive
);
