using System.ComponentModel.DataAnnotations;

namespace SIMS.Api.Dtos.Student;

/// <summary>
/// Request body khi tạo sinh viên mới (Admin tạo hoặc Sinh viên tự đăng ký).
/// Khớp với data object trong useAppStore.addStudent().
/// </summary>
public record CreateStudentDto(
    [Required][MaxLength(100)] string Name,
    [Required][EmailAddress][MaxLength(150)] string Email,
    [Required][MaxLength(100)] string Program,
    [MaxLength(20)] string? Phone,
    string? DateOfBirth,
    string? Address,
    string? Status,
    /// <summary>Mật khẩu plain text từ form đăng ký. Nếu null, dùng mật khẩu mặc định.</summary>
    [MinLength(6)] string? Password
);
