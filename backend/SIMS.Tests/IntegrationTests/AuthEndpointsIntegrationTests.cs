using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit;

namespace SIMS.Tests.IntegrationTests;

/// <summary>
/// Integration Tests cho AuthController — Kiểm thử API HTTP thực tế cho Login & Forgot Password.
/// </summary>
public class AuthEndpointsIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public AuthEndpointsIntegrationTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task PostLogin_ValidAdminCredentials_ReturnsOkAndToken()
    {
        // Arrange (Admin credential seeded by DbInitializer)
        var payload = new
        {
            email = "admin@elevate.edu",
            password = "Password123!"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", payload);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<LoginTestResponse>();
        Assert.NotNull(result);
        Assert.False(string.IsNullOrWhiteSpace(result.Token));
        Assert.Equal("admin@elevate.edu", result.User?.Email);
    }

    [Fact]
    public async Task PostLogin_InvalidPassword_ReturnsUnauthorized()
    {
        // Arrange
        var payload = new
        {
            email = "admin@elevate.edu",
            password = "WrongPassword!"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/login", payload);

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task PostForgotPassword_ValidEmail_ReturnsOkWithOtp()
    {
        // Arrange
        var payload = new
        {
            email = "admin@elevate.edu"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/forgot-password", payload);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<ForgotPasswordTestResponse>();
        Assert.NotNull(result);
        Assert.NotNull(result.Otp);
        Assert.Equal(6, result.Otp.Length);
    }

    [Fact]
    public async Task PostForgotPassword_NonExistentEmail_ReturnsNotFound()
    {
        // Arrange
        var payload = new
        {
            email = "nonexistent@elevate.edu"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/auth/forgot-password", payload);

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    private class LoginTestResponse
    {
        public string Token { get; set; } = string.Empty;
        public UserTestProfile? User { get; set; }
    }

    private class UserTestProfile
    {
        public string Email { get; set; } = string.Empty;
    }

    private class ForgotPasswordTestResponse
    {
        public string Message { get; set; } = string.Empty;
        public string Otp { get; set; } = string.Empty;
    }
}
