using Microsoft.AspNetCore.Mvc;
using SIMS.Api.Dtos.Auth;
using SIMS.Api.Services.Interfaces;

namespace SIMS.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    public AuthController(IAuthService authService) => _authService = authService;

    /// <summary>POST /api/auth/login — Đăng nhập, trả về JWT Token và UserProfile.</summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
    {
        try
        {
            var result = await _authService.LoginAsync(dto.Email, dto.Password);
            if (result is null) return Unauthorized(new { error = "Invalid email or password" });
            return Ok(result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(new { error = ex.Message });
        }
    }

    /// <summary>PUT /api/auth/profile — Cập nhật phone/password của user đang đăng nhập.</summary>
    [HttpPut("profile")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        var email = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value
                 ?? User.FindFirst("email")?.Value
                 ?? User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Email)?.Value;

        if (email is null) return Unauthorized(new { error = "User claim not found in token" });

        var success = await _authService.UpdateProfileAsync(email, dto.Phone, dto.Password);
        return success ? Ok(new { message = "Profile updated successfully" }) : NotFound();
    }

    /// <summary>POST /api/auth/forgot-password — [DEMO] Sinh OTP và trả về trong response (thay cho email).</summary>
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email))
            return BadRequest(new { error = "Email is required." });

        var otp = await _authService.ForgotPasswordAsync(dto.Email);
        if (otp is null)
            return NotFound(new { error = "No active account found with this email address." });

        // DEMO MODE: Trả OTP thẳng về response. Production sẽ gửi qua Email.
        return Ok(new { message = "OTP generated (Demo Mode)", otp });
    }

    /// <summary>POST /api/auth/reset-password — Xác thực OTP và đặt mật khẩu mới.</summary>
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Otp) || string.IsNullOrWhiteSpace(dto.NewPassword))
            return BadRequest(new { error = "Email, OTP, and new password are required." });

        if (dto.NewPassword.Length < 8)
            return BadRequest(new { error = "Password must be at least 8 characters long." });

        var success = await _authService.ResetPasswordAsync(dto.Email, dto.Otp, dto.NewPassword);
        return success
            ? Ok(new { message = "Password reset successfully. Please login with your new password." })
            : BadRequest(new { error = "Invalid or expired OTP. Please request a new one." });
    }
}

public record UpdateProfileDto(string? Phone, string? Password);
public record ForgotPasswordDto(string Email);
public record ResetPasswordDto(string Email, string Otp, string NewPassword);
