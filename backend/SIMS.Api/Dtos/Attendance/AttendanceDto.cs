using System.ComponentModel.DataAnnotations;

namespace SIMS.Api.Dtos.Attendance;

/// <summary>Payload từ Faculty khi Freeze Attendance Log.</summary>
public record SaveAttendanceDto(
    [Required] string CourseId,
    [Required] string FacultyId,
    [Required] AttendanceEntryDto[] Entries
);

public record AttendanceEntryDto(
    [Required] string StudentId,
    [Required] string Status  // "Present" | "Late" | "Absent"
);

/// <summary>Response trả về cho Student/Admin.</summary>
public record AttendanceRecordDto(
    string Id,
    string StudentId,
    string CourseId,
    string CourseName,
    string CourseCode,
    string Status,
    string AttendedDate,
    string? Reason
);

/// <summary>Thống kê tỷ lệ chuyên cần theo môn học cho Student.</summary>
public record AttendanceSummaryDto(
    string CourseId,
    string CourseName,
    string CourseCode,
    int TotalSessions,
    int PresentCount,
    int LateCount,
    int AbsentCount
);
