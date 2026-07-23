namespace SIMS.Api.Dtos.Student;

/// <summary>
/// Request body khi Admin cập nhật thông tin sinh viên.
/// Khớp với updateStudentProfile() trong AppFacade.ts.
/// </summary>
public record UpdateStudentDto(
    string? Name,
    string? Email,
    string? Program,
    string? Status
);
