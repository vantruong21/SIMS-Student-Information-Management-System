using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SIMS.Api.Dtos.Student;
using SIMS.Api.Services.Interfaces;

namespace SIMS.Api.Controllers;

[ApiController]
[Route("api/students")]
[Authorize]
public class StudentsController : ControllerBase
{
    private readonly IStudentService _service;
    public StudentsController(IStudentService service) => _service = service;

    /// <summary>GET /api/students — Lấy toàn bộ sinh viên (Admin only).</summary>
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    /// <summary>GET /api/students/{id} — Lấy chi tiết 1 sinh viên.</summary>
    [HttpGet("{id}")]
    [Authorize(Roles = "Admin,Student")]
    public async Task<IActionResult> GetById(string id)
    {
        var student = await _service.GetByIdAsync(id);
        return student is null ? NotFound() : Ok(student);
    }

    /// <summary>POST /api/students — Admin tạo sinh viên mới (Yêu cầu Admin role).</summary>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateStudentDto dto)
    {
        var (success, errors) = await _service.CreateAsync(dto);
        if (!success) return BadRequest(new { errors });
        return StatusCode(201, new { message = "Student created successfully" });
    }

    /// <summary>POST /api/students/register — Sinh viên tự đăng ký (Public, không cần Auth). Status luôn là Pending.</summary>
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] CreateStudentDto dto)
    {
        // Force status = Pending for public registration (Admin phải duyệt sau)
        var pendingDto = dto with { Status = "Pending" };
        var (success, errors) = await _service.CreateAsync(pendingDto);
        if (!success) return BadRequest(new { errors });
        return StatusCode(201, new { message = "Application submitted. Please wait for admin approval." });
    }

    /// <summary>PUT /api/students/{id} — Admin cập nhật thông tin sinh viên.</summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateStudentDto dto)
    {
        var success = await _service.UpdateAsync(id, dto);
        return success ? Ok(new { message = "Student updated" }) : NotFound();
    }

    /// <summary>DELETE /api/students/{id} — Admin xóa sinh viên.</summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(string id)
    {
        var success = await _service.DeleteAsync(id);
        return success ? Ok(new { message = "Student deleted" }) : NotFound();
    }

    /// <summary>PATCH /api/students/{id}/status — Cập nhật trạng thái Active/Pending/Suspended.</summary>
    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateStatusDto dto)
    {
        var success = await _service.UpdateStatusAsync(id, dto.Status);
        return success ? Ok(new { message = "Status updated" }) : NotFound();
    }

    /// <summary>PATCH /api/students/{id}/lock — Khóa/Mở khóa tài khoản sinh viên.</summary>
    [HttpPatch("{id}/lock")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ToggleLock([FromBody] ToggleLockDto dto)
    {
        var success = await _service.ToggleLockAsync(dto.Email);
        return success ? Ok(new { message = "Lock status toggled" }) : NotFound();
    }

    /// <summary>GET /api/students/{id}/courses — Lấy môn học của sinh viên.</summary>
    [HttpGet("{id}/courses")]
    [Authorize(Roles = "Admin,Student")]
    public async Task<IActionResult> GetCourses(string id) =>
        Ok(await _service.GetStudentCoursesAsync(id));

    /// <summary>GET /api/students/{id}/grades — Lấy bảng điểm của sinh viên.</summary>
    [HttpGet("{id}/grades")]
    [Authorize(Roles = "Admin,Student,Faculty")]
    public async Task<IActionResult> GetGrades(string id) =>
        Ok(await _service.GetStudentGradesAsync(id));

    /// <summary>GET /api/students/{id}/gpa — Tính GPA của sinh viên.</summary>
    [HttpGet("{id}/gpa")]
    [Authorize(Roles = "Admin,Student")]
    public async Task<IActionResult> GetGpa(string id) =>
        Ok(new { gpa = await _service.GetStudentGpaAsync(id) });
}

public record UpdateStatusDto(string Status);
public record ToggleLockDto(string Email);
