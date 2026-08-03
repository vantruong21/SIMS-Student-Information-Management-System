using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using BCrypt.Net;
using SIMS.Api.Dtos.Auth;
using SIMS.Api.Repositories.Interfaces;
using SIMS.Api.Services.Interfaces;

namespace SIMS.Api.Services;

/// <summary>
/// Cấu hình JWT từ appsettings.json.
/// </summary>
public class JwtSettings
{
    public string Secret { get; set; } = string.Empty;
    public string Issuer { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public int ExpirationMinutes { get; set; } = 30;
}

/// <summary>
/// AuthService — Xử lý nghiệp vụ Đăng nhập, tạo JWT Token và cập nhật Profile.
/// SOLID — Single Responsibility: chỉ xử lý xác thực người dùng.
/// SOLID — Dependency Inversion: phụ thuộc vào IUserRepository, IStudentRepository (Interfaces).
/// </summary>
public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepo;
    private readonly IStudentRepository _studentRepo;
    private readonly IGradeRepository _gradeRepo;
    private readonly JwtSettings _jwt;

    // In-memory OTP store: email -> (otp, expiredAt)
    // Đây là giải pháp Demo — không dùng cho production thực tế
    private static readonly Dictionary<string, (string Otp, DateTime ExpiredAt)> _otpStore = new();

    public AuthService(
        IUserRepository userRepo,
        IStudentRepository studentRepo,
        IGradeRepository gradeRepo,
        IOptions<JwtSettings> jwtOptions)
    {
        _userRepo = userRepo;
        _studentRepo = studentRepo;
        _gradeRepo = gradeRepo;
        _jwt = jwtOptions.Value;
    }

    public async Task<LoginResponseDto?> LoginAsync(string email, string password)
    {
        var user = await _userRepo.GetByEmailAsync(email);
        if (user is null || !user.IsActive) return null;

        // Check account lock (Allows admin to manually lock accounts)
        if (user.IsLocked)
            throw new UnauthorizedAccessException("Account is locked. Please contact administration.");

        // Verify BCrypt password
        if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        user.LastLoginAt = DateTime.UtcNow;
        await _userRepo.UpdateAsync(user);

        // Build profile enriched with student data if applicable
        decimal? gpa = null;
        int? creditsCompleted = null;
        const int totalCreditsNeeded = 140;

        if (user.Role == "Student")
        {
            var student = await _studentRepo.GetByUserIdAsync(user.Id);
            if (student is not null)
            {
                gpa = await _gradeRepo.CalculateStudentGpaAsync(student.Id);
                creditsCompleted = student.TotalCredits;
            }
        }

        var token = GenerateJwtToken(user.Id, user.Email, user.Role);

        var profile = new UserProfileDto(
            user.Id,
            user.FullName,
            user.Role,
            user.Email,
            user.AvatarUrl ?? string.Empty,
            user.Phone,
            gpa,
            creditsCompleted,
            user.Role == "Student" ? totalCreditsNeeded : null
        );

        return new LoginResponseDto(token, profile);
    }

    public async Task<bool> UpdateProfileAsync(string email, string? phone, string? newPassword, string? avatarUrl = null)
    {
        var user = await _userRepo.GetByEmailAsync(email);
        if (user is null) return false;

        if (phone is not null) user.Phone = phone;
        if (avatarUrl is not null) user.AvatarUrl = avatarUrl;
        if (!string.IsNullOrWhiteSpace(newPassword))
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword, workFactor: 11);

        await _userRepo.UpdateAsync(user);
        return true;
    }

    /// <summary>
    /// [DEMO MODE] Sinh OTP 6 số và trả thẳng về cho Frontend hiển thị.
    /// Trong production thực tế, OTP này sẽ được gửi qua Email (SMTP/Resend).
    /// </summary>
    public async Task<string?> ForgotPasswordAsync(string email)
    {
        var user = await _userRepo.GetByEmailAsync(email.Trim().ToLower());
        if (user is null || !user.IsActive) return null;

        // Generate 6-digit OTP
        var otp = new Random().Next(100_000, 999_999).ToString();
        _otpStore[email.Trim().ToLower()] = (otp, DateTime.UtcNow.AddMinutes(10));

        return otp; // Returned directly for Demo purposes
    }

    /// <summary>
    /// Xác thực OTP và cập nhật mật khẩu mới vào Database.
    /// </summary>
    public async Task<bool> ResetPasswordAsync(string email, string otp, string newPassword)
    {
        var key = email.Trim().ToLower();

        if (!_otpStore.TryGetValue(key, out var entry)) return false;
        if (entry.ExpiredAt < DateTime.UtcNow || entry.Otp != otp)
        {
            _otpStore.Remove(key);
            return false;
        }

        var user = await _userRepo.GetByEmailAsync(key);
        if (user is null) return false;

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword, workFactor: 11);
        await _userRepo.UpdateAsync(user);

        _otpStore.Remove(key); // OTP đã dùng xong, xóa khỏi store
        return true;
    }

    private string GenerateJwtToken(string userId, string email, string role)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId),
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim(ClaimTypes.Role, role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _jwt.Issuer,
            audience: _jwt.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwt.ExpirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
