using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Moq;
using SIMS.Api.Models;
using SIMS.Api.Repositories.Interfaces;
using SIMS.Api.Services;
using Xunit;

namespace SIMS.Tests.UnitTests;

/// <summary>
/// Unit Tests cho AuthService — Đảm bảo tính đúng đắn của logic Đăng nhập, Mã hóa mật khẩu và OTP.
/// Sử dụng AAA Pattern (Arrange - Act - Assert).
/// </summary>
public class AuthServiceTests
{
    private readonly Mock<IUserRepository> _userRepoMock = new();
    private readonly Mock<IStudentRepository> _studentRepoMock = new();
    private readonly Mock<IGradeRepository> _gradeRepoMock = new();
    private readonly IOptions<JwtSettings> _jwtOptions;

    public AuthServiceTests()
    {
        _jwtOptions = Options.Create(new JwtSettings
        {
            Secret = "SuperSecretKeyForJWTAuthTesting1234567890!",
            Issuer = "SIMS.Api",
            Audience = "SIMS.Client",
            ExpirationMinutes = 30
        });
    }

    [Fact]
    public async Task LoginAsync_ValidCredentials_ReturnsTokenAndProfile()
    {
        // Arrange
        var rawPassword = "Password123!";
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(rawPassword, workFactor: 11);

        var user = new User
        {
            Id = "usr-01",
            Email = "student@elevate.edu",
            PasswordHash = hashedPassword,
            Role = "Student",
            FullName = "Test Student",
            IsActive = true,
            IsLocked = false
        };

        _userRepoMock.Setup(r => r.GetByEmailAsync(user.Email)).ReturnsAsync(user);

        var service = new AuthService(_userRepoMock.Object, _studentRepoMock.Object, _gradeRepoMock.Object, _jwtOptions);

        // Act
        var result = await service.LoginAsync("student@elevate.edu", rawPassword);

        // Assert
        Assert.NotNull(result);
        Assert.NotNull(result.Token);
        Assert.Equal("student@elevate.edu", result.User.Email);
        Assert.Equal("Student", result.User.Role);
    }

    [Fact]
    public async Task LoginAsync_InvalidPassword_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword("CorrectPassword123!", workFactor: 11);

        var user = new User
        {
            Id = "usr-01",
            Email = "student@elevate.edu",
            PasswordHash = hashedPassword,
            Role = "Student",
            IsActive = true,
            IsLocked = false
        };

        _userRepoMock.Setup(r => r.GetByEmailAsync(user.Email)).ReturnsAsync(user);

        var service = new AuthService(_userRepoMock.Object, _studentRepoMock.Object, _gradeRepoMock.Object, _jwtOptions);

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(async () =>
        {
            await service.LoginAsync("student@elevate.edu", "WrongPassword!");
        });
    }

    [Fact]
    public async Task LoginAsync_LockedAccount_ThrowsUnauthorizedAccessException()
    {
        // Arrange
        var user = new User
        {
            Id = "usr-locked",
            Email = "locked@elevate.edu",
            PasswordHash = "hash",
            Role = "Student",
            IsActive = true,
            IsLocked = true
        };

        _userRepoMock.Setup(r => r.GetByEmailAsync(user.Email)).ReturnsAsync(user);

        var service = new AuthService(_userRepoMock.Object, _studentRepoMock.Object, _gradeRepoMock.Object, _jwtOptions);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<UnauthorizedAccessException>(async () =>
        {
            await service.LoginAsync("locked@elevate.edu", "any");
        });

        Assert.Contains("locked", ex.Message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task ForgotPasswordAsync_ValidEmail_Generates6DigitOtp()
    {
        // Arrange
        var user = new User
        {
            Id = "usr-01",
            Email = "forgot@elevate.edu",
            IsActive = true
        };

        _userRepoMock.Setup(r => r.GetByEmailAsync(user.Email)).ReturnsAsync(user);

        var service = new AuthService(_userRepoMock.Object, _studentRepoMock.Object, _gradeRepoMock.Object, _jwtOptions);

        // Act
        var otp = await service.ForgotPasswordAsync("forgot@elevate.edu");

        // Assert
        Assert.NotNull(otp);
        Assert.Equal(6, otp.Length);
        Assert.True(int.TryParse(otp, out _));
    }

    [Fact]
    public async Task ForgotPasswordAsync_NonExistentEmail_ReturnsNull()
    {
        // Arrange
        _userRepoMock.Setup(r => r.GetByEmailAsync("notfound@elevate.edu")).ReturnsAsync((User?)null);

        var service = new AuthService(_userRepoMock.Object, _studentRepoMock.Object, _gradeRepoMock.Object, _jwtOptions);

        // Act
        var otp = await service.ForgotPasswordAsync("notfound@elevate.edu");

        // Assert
        Assert.Null(otp);
    }

    [Fact]
    public async Task ResetPasswordAsync_ValidOtp_UpdatesPasswordHash()
    {
        // Arrange
        var email = "reset@elevate.edu";
        var user = new User
        {
            Id = "usr-01",
            Email = email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("OldPassword123!", workFactor: 11),
            IsActive = true
        };

        _userRepoMock.Setup(r => r.GetByEmailAsync(email)).ReturnsAsync(user);

        var service = new AuthService(_userRepoMock.Object, _studentRepoMock.Object, _gradeRepoMock.Object, _jwtOptions);

        // Act 1: Request OTP
        var otp = await service.ForgotPasswordAsync(email);
        Assert.NotNull(otp);

        // Act 2: Reset Password
        var success = await service.ResetPasswordAsync(email, otp, "NewPassword123!");

        // Assert
        Assert.True(success);
        _userRepoMock.Verify(r => r.UpdateAsync(It.Is<User>(u => u.Email == email)), Times.Once);
        Assert.True(BCrypt.Net.BCrypt.Verify("NewPassword123!", user.PasswordHash));
    }
}
