using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Xunit;

namespace SIMS.Tests.IntegrationTests;

/// <summary>
/// Integration Tests cho Students & Courses Controllers — Kiểm thử phân quyền JWT và truy vấn danh sách.
/// </summary>
public class StudentsEndpointsIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public StudentsEndpointsIntegrationTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    private async Task<string> GetAdminTokenAsync()
    {
        var payload = new { email = "admin@elevate.edu", password = "Password123!" };
        var response = await _client.PostAsJsonAsync("/api/auth/login", payload);
        var body = await response.Content.ReadFromJsonAsync<LoginTestResponse>();
        return body?.Token ?? string.Empty;
    }

    [Fact]
    public async Task GetStudents_Unauthenticated_ReturnsUnauthorized()
    {
        // Act: Gọi API khi chưa đăng nhập (không có Bearer Token)
        var response = await _client.GetAsync("/api/students");

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetStudents_AuthenticatedAsAdmin_ReturnsOkAndList()
    {
        // Arrange: Lấy Token Admin
        var token = await GetAdminTokenAsync();
        var request = new HttpRequestMessage(HttpMethod.Get, "/api/students");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.SendAsync(request);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetCourses_AuthenticatedAsAdmin_ReturnsOkAndList()
    {
        // Arrange
        var token = await GetAdminTokenAsync();
        var request = new HttpRequestMessage(HttpMethod.Get, "/api/courses");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Act
        var response = await _client.SendAsync(request);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    private class LoginTestResponse
    {
        public string Token { get; set; } = string.Empty;
    }
}
