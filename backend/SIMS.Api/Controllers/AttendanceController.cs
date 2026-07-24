using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SIMS.Api.Dtos.Attendance;
using SIMS.Api.Services.Interfaces;

namespace SIMS.Api.Controllers;

[ApiController]
[Route("api/attendance")]
[Authorize]
public class AttendanceController : ControllerBase
{
    private readonly IAttendanceService _service;
    public AttendanceController(IAttendanceService service) => _service = service;

    /// <summary>Faculty/Admin freeze attendance log → lưu vào DB</summary>
    [HttpPost("save")]
    [Authorize(Roles = "Admin,Faculty")]
    public async Task<IActionResult> Save([FromBody] SaveAttendanceDto dto)
    {
        await _service.SaveAttendanceAsync(dto);
        return Ok(new { message = "Attendance saved successfully" });
    }

    /// <summary>Student xem lịch sử điểm danh của chính mình</summary>
    [HttpGet("student/{studentId}")]
    [Authorize(Roles = "Admin,Faculty,Student")]
    public async Task<IActionResult> GetByStudent(string studentId)
    {
        var records = await _service.GetByStudentIdAsync(studentId);
        return Ok(records);
    }

    /// <summary>Student xem tóm tắt tỷ lệ điểm danh theo môn học</summary>
    [HttpGet("student/{studentId}/summary")]
    [Authorize(Roles = "Admin,Faculty,Student")]
    public async Task<IActionResult> GetStudentSummary(string studentId)
    {
        var summary = await _service.GetSummaryByStudentIdAsync(studentId);
        return Ok(summary);
    }

    /// <summary>Admin/Faculty xem điểm danh theo môn học</summary>
    [HttpGet("course/{courseId}")]
    [Authorize(Roles = "Admin,Faculty")]
    public async Task<IActionResult> GetByCourse(string courseId)
    {
        var records = await _service.GetByCourseIdAsync(courseId);
        return Ok(records);
    }
}
