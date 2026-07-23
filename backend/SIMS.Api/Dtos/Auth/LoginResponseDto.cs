namespace SIMS.Api.Dtos.Auth;

/// <summary>
/// Response sau khi đăng nhập thành công.
/// Khớp với UserProfile interface trong frontend/src/store/useAuthStore.ts.
/// </summary>
public record LoginResponseDto(
    string Token,
    UserProfileDto User
);

public record UserProfileDto(
    string Id,
    string Name,
    string Role,
    string Email,
    string AvatarUrl,
    string? Phone,
    decimal? Gpa,
    int? CreditsCompleted,
    int? TotalCreditsNeeded
);
