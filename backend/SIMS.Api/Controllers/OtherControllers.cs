using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SIMS.Api.Dtos.Faculty;
using SIMS.Api.Dtos.Course;
using SIMS.Api.Dtos.Department;
using SIMS.Api.Dtos.Enrollment;
using SIMS.Api.Dtos.Grade;
using SIMS.Api.Services.Interfaces;

namespace SIMS.Api.Controllers;

[ApiController]
[Route("api/faculty")]
[Authorize]
public class FacultyController : ControllerBase
{
    private readonly IFacultyService _service;
    public FacultyController(IFacultyService service) => _service = service;

    [HttpGet] [Authorize(Roles = "Admin,Faculty")]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpGet("{id}")] [Authorize(Roles = "Admin,Faculty")]
    public async Task<IActionResult> GetById(string id)
    {
        var f = await _service.GetByIdAsync(id);
        return f is null ? NotFound() : Ok(f);
    }

    [HttpPost] [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateFacultyDto dto)
    {
        var (success, errors) = await _service.CreateAsync(dto);
        return success ? StatusCode(201, new { message = "Faculty created" }) : BadRequest(new { errors });
    }

    [HttpPut("{id}")] [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateFacultyDto dto)
        => await _service.UpdateAsync(id, dto) ? Ok(new { message = "Faculty updated" }) : NotFound();

    [HttpDelete("{id}")] [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(string id)
        => await _service.DeleteAsync(id) ? Ok(new { message = "Faculty deleted" }) : NotFound();

    [HttpPatch("{id}/lock")] [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ToggleLock([FromBody] ToggleLockFacultyDto dto)
        => await _service.ToggleLockAsync(dto.Email) ? Ok(new { message = "Lock toggled" }) : NotFound();
}

public record ToggleLockFacultyDto(string Email);

// ────────────────────────────────────────────────────────────────────────────

[ApiController]
[Route("api/courses")]
[Authorize]
public class CoursesController : ControllerBase
{
    private readonly ICourseService _service;
    private readonly IEnrollmentService _enrollmentService;

    public CoursesController(ICourseService service, IEnrollmentService enrollmentService)
    {
        _service = service;
        _enrollmentService = enrollmentService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var c = await _service.GetByIdAsync(id);
        return c is null ? NotFound() : Ok(c);
    }

    /// <summary>
    /// Lấy danh sách sinh viên đang đăng ký một môn học.
    /// Faculty & Admin được phép truy cập để hỗ trợ điểm danh.
    /// </summary>
    [HttpGet("{courseId}/students")]
    [Authorize(Roles = "Admin,Faculty")]
    public async Task<IActionResult> GetEnrolledStudents(string courseId)
    {
        var students = await _enrollmentService.GetEnrolledStudentsAsync(courseId);
        return Ok(students);
    }

    [HttpPost] [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] CreateCourseDto dto)
    {
        var (success, errors) = await _service.CreateAsync(dto);
        return success ? StatusCode(201, new { message = "Course created" }) : BadRequest(new { errors });
    }


    [HttpPut("{id}")] [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateCourseDto dto)
        => await _service.UpdateAsync(id, dto) ? Ok(new { message = "Course updated" }) : NotFound();

    [HttpDelete("{id}")] [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(string id)
        => await _service.DeleteAsync(id) ? Ok(new { message = "Course deleted" }) : NotFound();

    [HttpPatch("{id}/instructor")] [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateInstructor(string id, [FromBody] UpdateInstructorDto dto)
        => await _service.UpdateInstructorAsync(id, dto.Instructor) ? Ok(new { message = "Instructor updated" }) : NotFound();
}

// ────────────────────────────────────────────────────────────────────────────

[ApiController]
[Route("api/departments")]
[Authorize]
public class DepartmentsController : ControllerBase
{
    private readonly IDepartmentService _service;
    public DepartmentsController(IDepartmentService service) => _service = service;

    [HttpGet] [Authorize(Roles = "Admin,Faculty,Student")]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var d = await _service.GetByIdAsync(id);
        return d is null ? NotFound() : Ok(d);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateDepartmentDto dto)
    {
        var (success, errors) = await _service.CreateAsync(dto);
        return success ? StatusCode(201, new { message = "Department created" }) : BadRequest(new { errors });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateDepartmentDto dto)
        => await _service.UpdateAsync(id, dto) ? Ok(new { message = "Department updated" }) : NotFound();

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
        => await _service.DeleteAsync(id) ? Ok(new { message = "Department deleted" }) : NotFound();
}

// ────────────────────────────────────────────────────────────────────────────

[ApiController]
[Route("api/enrollments")]
[Authorize]
public class EnrollmentsController : ControllerBase
{
    private readonly IEnrollmentService _service;
    public EnrollmentsController(IEnrollmentService service) => _service = service;

    [HttpGet] [Authorize(Roles = "Admin,Faculty")]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpPost("assign")] [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Assign([FromBody] AssignStudentsDto dto)
        => Ok(await _service.AssignStudentsAsync(dto));

    [HttpDelete("{studentId}/{courseId}")] [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Remove(string studentId, string courseId)
        => await _service.RemoveStudentAsync(studentId, courseId) ? Ok(new { message = "Enrollment removed" }) : NotFound();
}

// ────────────────────────────────────────────────────────────────────────────

[ApiController]
[Route("api/grades")]
[Authorize]
public class GradesController : ControllerBase
{
    private readonly IGradeService _service;
    public GradesController(IGradeService service) => _service = service;

    [HttpGet] [Authorize(Roles = "Admin,Faculty")]
    public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

    [HttpPut] [Authorize(Roles = "Admin,Faculty")]
    public async Task<IActionResult> UpdateGrade([FromBody] UpdateGradeDto dto)
        => await _service.UpdateGradeAsync(dto) ? Ok(new { message = "Grade updated" }) : NotFound();
}
