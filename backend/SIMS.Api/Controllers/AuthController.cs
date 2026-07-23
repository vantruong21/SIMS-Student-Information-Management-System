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
}

public record UpdateProfileDto(string? Phone, string? Password);
