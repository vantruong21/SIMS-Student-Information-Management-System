using System.Text.RegularExpressions;

namespace SIMS.Api.Utils;

/// <summary>
/// PasswordPolicy — Kiểm tra độ mạnh mật khẩu theo tiêu chuẩn bảo mật.
/// Yêu cầu: ≥8 ký tự, có chữ hoa, chữ thường, ký tự đặc biệt.
/// </summary>
public static class PasswordPolicy
{
    private static readonly Regex HasUppercase    = new(@"[A-Z]", RegexOptions.Compiled);
    private static readonly Regex HasLowercase    = new(@"[a-z]", RegexOptions.Compiled);
    private static readonly Regex HasSpecialChar  = new(@"[^a-zA-Z0-9\s]", RegexOptions.Compiled);

    /// <summary>
    /// Validate mật khẩu. Trả về danh sách lỗi (empty nếu hợp lệ).
    /// </summary>
    public static string[] Validate(string? password)
    {
        if (string.IsNullOrWhiteSpace(password))
            return ["Password is required."];

        var errors = new List<string>();

        if (password.Length < 8)
            errors.Add("Password must be at least 8 characters long.");
        if (!HasUppercase.IsMatch(password))
            errors.Add("Password must contain at least one uppercase letter (A-Z).");
        if (!HasLowercase.IsMatch(password))
            errors.Add("Password must contain at least one lowercase letter (a-z).");
        if (!HasSpecialChar.IsMatch(password))
            errors.Add("Password must contain at least one special character (e.g. @, $, !, %, *, ?, &, #).");

        return errors.ToArray();
    }

    /// <summary>
    /// Trả về true nếu mật khẩu hợp lệ.
    /// </summary>
    public static bool IsValid(string? password) => Validate(password).Length == 0;
}
