using SIMS.Api.Dtos.Course;
using SIMS.Api.Dtos.Department;
using SIMS.Api.Dtos.Enrollment;
using SIMS.Api.Dtos.Faculty;
using SIMS.Api.Dtos.Grade;
using SIMS.Api.Models;
using SIMS.Api.Repositories.Interfaces;
using SIMS.Api.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using SIMS.Api.Data;


namespace SIMS.Api.Services;

public class FacultyService : IFacultyService
{
    private readonly IFacultyRepository _facultyRepo;
    private readonly IUserRepository _userRepo;
    private readonly ICourseRepository _courseRepo;
    private readonly IDepartmentRepository _deptRepo;

    public FacultyService(
        IFacultyRepository facultyRepo,
        IUserRepository userRepo,
        ICourseRepository courseRepo,
        IDepartmentRepository deptRepo)
    {
        _facultyRepo = facultyRepo;
        _userRepo = userRepo;
        _courseRepo = courseRepo;
        _deptRepo = deptRepo;
    }


    public async Task<IEnumerable<FacultyDto>> GetAllAsync()
    {
        var faculties = await _facultyRepo.GetAllAsync();
        var result = new List<FacultyDto>();
        foreach (var f in faculties)
        {
            var courses = await _courseRepo.GetAllWithEnrollmentCountAsync();
            var coursesTaught = courses
                .Where(c => c.InstructorId == f.Id)
                .Select(c => c.Name)
                .ToArray();
            result.Add(MapToDto(f, coursesTaught));
        }
        return result;
    }

    public async Task<FacultyDto?> GetByIdAsync(string id)
    {
        var faculty = await _facultyRepo.GetByIdAsync(id);
        if (faculty is null) return null;
        var courses = await _courseRepo.GetAllWithEnrollmentCountAsync();
        var coursesTaught = courses.Where(c => c.InstructorId == faculty.Id).Select(c => c.Name).ToArray();
        return MapToDto(faculty, coursesTaught);
    }

    public async Task<(bool Success, string[] Errors)> CreateAsync(CreateFacultyDto dto)
    {
        var existingUser = await _userRepo.GetByEmailAsync(dto.Email);
        if (existingUser is not null)
            return (false, ["A user or faculty member with this email already exists"]);

        var userId = Guid.NewGuid().ToString();
        var user = new User
        {
            Id = userId,
            FullName = dto.Name,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("elevate2026", workFactor: 11),
            Role = "Faculty",
            Phone = dto.Phone,
            IsActive = false   // Mới tạo → Pending (Admin phải Approve)
        };
        await _userRepo.CreateAsync(user);


        string? deptId = null;
        if (!string.IsNullOrWhiteSpace(dto.Department) && dto.Department != "dept-default")
        {
            deptId = dto.Department;
        }
        else
        {
            deptId = await _deptRepo.GetFirstIdAsync();
        }

        var facultyId = $"FAC-{Guid.NewGuid().ToString()[..8].ToUpper()}";
        var faculty = new Faculty
        {
            Id = facultyId,
            UserId = userId,
            FacultyCode = facultyId,
            DepartmentId = deptId ?? "dept-1",
            Degree = "Master"
        };
        await _facultyRepo.CreateAsync(faculty);
        return (true, []);
    }


    public async Task<bool> UpdateAsync(string id, UpdateFacultyDto dto)
    {
        var faculty = await _facultyRepo.GetByIdAsync(id);
        if (faculty is null) return false;
        if (dto.Name is not null) faculty.User.FullName = dto.Name;
        if (dto.Email is not null) faculty.User.Email = dto.Email;
        if (dto.Phone is not null) faculty.User.Phone = dto.Phone;
        if (dto.IsActive.HasValue) faculty.User.IsActive = dto.IsActive.Value;
        await _userRepo.UpdateAsync(faculty.User);
        await _facultyRepo.UpdateAsync(faculty);
        return true;
    }

    public async Task<bool> DeleteAsync(string id) => await _facultyRepo.DeleteAsync(id);

    public async Task<bool> ToggleLockAsync(string email)
    {
        var user = await _userRepo.GetByEmailAsync(email);
        if (user is null) return false;
        user.IsLocked = !user.IsLocked;
        if (!user.IsLocked) user.FailedLoginAttempts = 0;
        await _userRepo.UpdateAsync(user);
        return true;
    }

    private static FacultyDto MapToDto(Faculty f, string[] coursesTaught)
    {
        var displayId = f.Id.StartsWith("FAC-") || f.Id.StartsWith("fac-")
            ? f.Id
            : $"FAC-{f.Id[..8].ToUpper()}";

        return new(
            displayId,
            f.User.FullName,
            f.User.Email,
            f.Department?.Name ?? string.Empty,
            f.Degree,
            coursesTaught,
            f.User.AvatarUrl,
            f.User.IsLocked ? "Locked" : f.User.IsActive ? "Active" : "Pending",
            f.User.IsLocked,
            f.User.Phone
        );
    }

}

public class CourseService : ICourseService
{
    private readonly ICourseRepository _courseRepo;
    private readonly IFacultyRepository _facultyRepo;
    private readonly IDepartmentRepository _deptRepo;

    public CourseService(ICourseRepository courseRepo, IFacultyRepository facultyRepo, IDepartmentRepository deptRepo)
    {
        _courseRepo = courseRepo;
        _facultyRepo = facultyRepo;
        _deptRepo = deptRepo;
    }

    public async Task<IEnumerable<CourseDto>> GetAllAsync()
    {
        var courses = await _courseRepo.GetAllWithEnrollmentCountAsync();
        return courses.Select(MapToDto);
    }

    public async Task<CourseDto?> GetByIdAsync(string id)
    {
        var course = await _courseRepo.GetByIdAsync(id);
        return course is null ? null : MapToDto(course);
    }

    public async Task<(bool Success, string[] Errors)> CreateAsync(CreateCourseDto dto)
    {
        if (await _courseRepo.CodeExistsAsync(dto.Code))
            return (false, ["A course with this code already exists"]);

        // Find faculty by name match
        var allFaculty = await _facultyRepo.GetAllAsync();
        var instructor = allFaculty.FirstOrDefault(f => f.User.FullName == dto.Instructor);

        // Lấy department ID đầu tiên trong DB thành fallback (thay vì hardcode 'dept-default' không tồn tại)
        string? deptId = null;
        if (!string.IsNullOrWhiteSpace(dto.Department) && dto.Department != "dept-default")
        {
            deptId = dto.Department;
        }
        else
        {
            // Lấy bất kỳ department nào tồn tại
            var firstDept = await _deptRepo.GetFirstIdAsync();
            deptId = firstDept;
        }

        var course = new Course
        {
            Id = Guid.NewGuid().ToString(),
            Code = dto.Code,
            Name = dto.Name,
            InstructorId = instructor?.Id,
            Schedule = dto.Schedule,
            Credits = dto.Credits,
            Capacity = dto.Capacity ?? 35,
            DepartmentId = deptId ?? "dept-1"  // fallback
        };
        await _courseRepo.CreateAsync(course);
        return (true, []);
    }

    public async Task<bool> UpdateAsync(string id, UpdateCourseDto dto)
    {
        var course = await _courseRepo.GetByIdAsync(id);
        if (course is null) return false;

        if (dto.Name is not null) course.Name = dto.Name;
        if (dto.Schedule is not null) course.Schedule = dto.Schedule;
        if (dto.Credits.HasValue) course.Credits = dto.Credits.Value;
        if (dto.Capacity.HasValue) course.Capacity = dto.Capacity.Value;

        if (dto.Instructor is not null)
        {
            var allFaculty = await _facultyRepo.GetAllAsync();
            var instructor = allFaculty.FirstOrDefault(f => f.User.FullName == dto.Instructor);
            course.InstructorId = instructor?.Id;
        }

        await _courseRepo.UpdateAsync(course);
        return true;
    }

    public async Task<bool> DeleteAsync(string id) => await _courseRepo.DeleteAsync(id);

    public async Task<bool> UpdateInstructorAsync(string id, string instructorName)
    {
        var course = await _courseRepo.GetByIdAsync(id);
        if (course is null) return false;
        var allFaculty = await _facultyRepo.GetAllAsync();
        var instructor = allFaculty.FirstOrDefault(f => f.User.FullName == instructorName);
        course.InstructorId = instructor?.Id;
        await _courseRepo.UpdateAsync(course);
        return true;
    }

    private static CourseDto MapToDto(Course c) => new(
        c.Id,
        c.Code,
        c.Name,
        c.Instructor?.User.FullName ?? "Staff Academic",
        c.Schedule ?? string.Empty,
        c.Status,
        null,
        c.Credits,
        c.Capacity,
        c.Enrollments.Count,
        c.Instructor?.User.Email
    );
}

public class DepartmentService : IDepartmentService
{
    private readonly IDepartmentRepository _deptRepo;
    private readonly IFacultyRepository _facultyRepo;

    public DepartmentService(IDepartmentRepository deptRepo, IFacultyRepository facultyRepo)
    {
        _deptRepo = deptRepo;
        _facultyRepo = facultyRepo;
    }

    public async Task<IEnumerable<DepartmentDto>> GetAllAsync()
    {
        var depts = await _deptRepo.GetAllAsync();
        return depts.Select(MapToDto);
    }

    public async Task<DepartmentDto?> GetByIdAsync(string id)
    {
        var dept = await _deptRepo.GetByIdAsync(id);
        return dept is null ? null : MapToDto(dept);
    }

    public async Task<(bool Success, string[] Errors)> CreateAsync(CreateDepartmentDto dto)
    {
        var allFaculty = await _facultyRepo.GetAllAsync();
        var headFaculty = allFaculty.FirstOrDefault(f => 
            f.User.FullName.Equals(dto.Head, StringComparison.OrdinalIgnoreCase) ||
            f.Id.Equals(dto.Head, StringComparison.OrdinalIgnoreCase));

        var dept = new Department
        {
            Id = Guid.NewGuid().ToString(),
            DepartmentCode = $"DEPT{new Random().Next(100, 999)}",
            Name = dto.Name,
            HeadFacultyId = headFaculty?.Id,
            Description = dto.Description
        };
        await _deptRepo.CreateAsync(dept);

        // Gán các giảng viên được chọn vào khoa này
        if (dto.FacultyIds != null && dto.FacultyIds.Length > 0)
        {
            foreach (var fac in allFaculty)
            {
                var displayId = fac.Id.StartsWith("FAC-") || fac.Id.StartsWith("fac-") ? fac.Id : $"FAC-{fac.Id[..8].ToUpper()}";
                if (dto.FacultyIds.Contains(fac.Id, StringComparer.OrdinalIgnoreCase) ||
                    dto.FacultyIds.Contains(displayId, StringComparer.OrdinalIgnoreCase) ||
                    dto.FacultyIds.Contains(fac.User.FullName, StringComparer.OrdinalIgnoreCase))
                {
                    fac.DepartmentId = dept.Id;
                    await _facultyRepo.UpdateAsync(fac);
                }
            }
        }

        return (true, []);
    }

    public async Task<bool> UpdateAsync(string id, UpdateDepartmentDto dto)
    {
        var dept = await _deptRepo.GetByIdAsync(id);
        if (dept is null) return false;
        if (dto.Name is not null) dept.Name = dto.Name;
        if (dto.Description is not null) dept.Description = dto.Description;

        var allFaculty = await _facultyRepo.GetAllAsync();
        if (dto.Head is not null)
        {
            var headFaculty = allFaculty.FirstOrDefault(f => 
                f.User.FullName.Equals(dto.Head, StringComparison.OrdinalIgnoreCase) ||
                f.Id.Equals(dto.Head, StringComparison.OrdinalIgnoreCase));
            dept.HeadFacultyId = headFaculty?.Id;
        }
        await _deptRepo.UpdateAsync(dept);

        // Lấy khoa fallback mặc định nếu gỡ giảng viên khỏi khoa này
        var defaultDeptId = await _deptRepo.GetFirstIdAsync() ?? "dept-1";

        // Đồng bộ 2 chiều các giảng viên thuộc khoa
        if (dto.FacultyIds != null)
        {
            foreach (var fac in allFaculty)
            {
                var displayId = fac.Id.StartsWith("FAC-") || fac.Id.StartsWith("fac-") ? fac.Id : $"FAC-{fac.Id[..8].ToUpper()}";
                var isMatched = dto.FacultyIds.Contains(fac.Id, StringComparer.OrdinalIgnoreCase) ||
                                dto.FacultyIds.Contains(displayId, StringComparer.OrdinalIgnoreCase) ||
                                dto.FacultyIds.Contains(fac.User.FullName, StringComparer.OrdinalIgnoreCase);

                if (isMatched)
                {
                    if (fac.DepartmentId != dept.Id)
                    {
                        fac.DepartmentId = dept.Id;
                        await _facultyRepo.UpdateAsync(fac);
                    }
                }
                else if (fac.DepartmentId == dept.Id)
                {
                    // Bị bỏ tích chọn khỏi khoa → gỡ về khoa mặc định
                    fac.DepartmentId = defaultDeptId;
                    await _facultyRepo.UpdateAsync(fac);
                }
            }
        }

        return true;
    }

    public async Task<bool> DeleteAsync(string id) => await _deptRepo.DeleteAsync(id);

    private static DepartmentDto MapToDto(Department d) => new(
        d.Id,
        d.Name,
        string.IsNullOrWhiteSpace(d.HeadFaculty?.User.FullName) ? "Staff Academic" : d.HeadFaculty!.User.FullName,
        d.Description ?? string.Empty,
        d.Faculties.Count
    );
}


public class EnrollmentService : IEnrollmentService
{
    private readonly IEnrollmentRepository _enrollmentRepo;
    private readonly IStudentRepository _studentRepo;
    private readonly ICourseRepository _courseRepo;
    private readonly ApplicationDbContext _db;

    public EnrollmentService(IEnrollmentRepository enrollmentRepo, IStudentRepository studentRepo, ICourseRepository courseRepo, ApplicationDbContext db)
    {
        _enrollmentRepo = enrollmentRepo;
        _studentRepo = studentRepo;
        _courseRepo = courseRepo;
        _db = db;
    }

    public async Task<IEnumerable<EnrollmentDto>> GetAllAsync()
    {
        var enrollments = await _enrollmentRepo.GetAllAsync();
        return enrollments.Select(e => new EnrollmentDto(
            e.Id, e.StudentId, e.CourseId, e.EnrolledAt.ToString("o"), e.Status,
            e.AssignmentScore, e.MidtermScore, e.FinalScore, e.TotalGrade
        ));
    }

    /// <summary>
    /// Lấy danh sách sinh viên đã đăng ký môn học, JOIN với bảng Students và Users để lấy tên đầy đủ.
    /// Đây là endpoint dành cho Faculty để hiển thị danh sách điểm danh.
    /// </summary>
    public async Task<IEnumerable<EnrolledStudentDto>> GetEnrolledStudentsAsync(string courseId)
    {
        var result = await (
            from e in _db.Enrollments
            join s in _db.Students on e.StudentId equals s.Id
            join u in _db.Users on s.UserId equals u.Id
            where e.CourseId == courseId && e.Status == "Enrolled"
            select new EnrolledStudentDto(
                s.Id,
                u.FullName,
                s.StudentCode,
                s.Program,
                e.Status
            )
        ).ToListAsync();

        return result;
    }

    public async Task<AssignStudentsResultDto> AssignStudentsAsync(AssignStudentsDto dto)
    {
        var course = await _courseRepo.GetByIdAsync(dto.CourseId);
        if (course is null) return new(false, 0, ["Course not found"]);

        var currentCount = await _enrollmentRepo.GetEnrolledCountAsync(dto.CourseId);
        var errors = new List<string>();
        int enrolled = 0;

        foreach (var studentId in dto.StudentIds)
        {
            if (await _enrollmentRepo.IsEnrolledAsync(studentId, dto.CourseId))
            {
                errors.Add($"Student {studentId} is already enrolled");
                continue;
            }

            if (currentCount + enrolled >= course.Capacity)
            {
                errors.Add($"Course has reached maximum capacity ({course.Capacity})");
                break;
            }

            var student = await _studentRepo.GetByIdAsync(studentId);
            if (student is null || student.Status != "Active")
            {
                errors.Add($"Student {studentId} is not eligible for enrollment");
                continue;
            }

            await _enrollmentRepo.CreateAsync(new Enrollment
            {
                Id = Guid.NewGuid().ToString(),
                StudentId = studentId,
                CourseId = dto.CourseId,
                Status = "Enrolled"
            });
            enrolled++;
        }

        return new(enrolled > 0, enrolled, errors.ToArray());
    }

    public async Task<bool> RemoveStudentAsync(string studentId, string courseId) =>
        await _enrollmentRepo.DeleteAsync(studentId, courseId);
}


public class GradeService : IGradeService
{
    private readonly IEnrollmentRepository _enrollmentRepo;
    private readonly IStudentRepository _studentRepo;

    public GradeService(IEnrollmentRepository enrollmentRepo, IStudentRepository studentRepo)
    {
        _enrollmentRepo = enrollmentRepo;
        _studentRepo = studentRepo;
    }

    public async Task<IEnumerable<GradeDto>> GetAllAsync()
    {
        var enrollments = await _enrollmentRepo.GetAllAsync();
        return enrollments.Where(e => e.TotalGrade.HasValue).Select(e => new GradeDto(
            e.Id, e.StudentId, e.CourseId,
            GpaToLetterGrade(e.TotalGrade!.Value),
            e.TotalGrade.Value, e.Remarks, e.UpdatedAt.ToString("o")
        ));
    }

    public async Task<bool> UpdateGradeAsync(UpdateGradeDto dto)
    {
        var enrollment = await _enrollmentRepo.GetByStudentAndCourseAsync(dto.StudentId, dto.CourseId);
        if (enrollment is null) return false;

        switch (dto.Type)
        {
            case "assignment": enrollment.AssignmentScore = dto.Value; break;
            case "midterm": enrollment.MidtermScore = dto.Value; break;
            case "final": enrollment.FinalScore = dto.Value; break;
        }

        // Recalculate TotalGrade (GPA points): weighted average → convert to 4.0 scale
        var scores = new[] { enrollment.AssignmentScore, enrollment.MidtermScore, enrollment.FinalScore }
                     .Where(s => s.HasValue).Select(s => s!.Value).ToArray();
        if (scores.Length > 0)
        {
            var avg = scores.Average();
            enrollment.TotalGrade = ScoreToGpa(avg);
        }

        await _enrollmentRepo.UpdateAsync(enrollment);

        // Recalculate student GPA
        var student = await _studentRepo.GetByIdAsync(dto.StudentId);
        if (student is not null)
        {
            var allEnrollments = await _enrollmentRepo.GetByStudentIdAsync(dto.StudentId);
            var completedWithGrades = allEnrollments.Where(e => e.TotalGrade.HasValue).ToList();
            // Update TotalCredits based on completed enrollments
            student.TotalCredits = completedWithGrades.Count * 3; // approximate
            await _studentRepo.UpdateAsync(student);
        }

        return true;
    }

    private static decimal ScoreToGpa(decimal score) => score switch
    {
        >= 93 => 4.0m,
        >= 90 => 3.7m,
        >= 87 => 3.3m,
        >= 83 => 3.0m,
        >= 80 => 2.7m,
        >= 77 => 2.3m,
        >= 73 => 2.0m,
        >= 70 => 1.7m,
        >= 60 => 1.0m,
        _ => 0.0m
    };

    private static string GpaToLetterGrade(decimal gpa) => gpa switch
    {
        >= 3.7m => "A",
        >= 3.3m => "A-",
        >= 3.0m => "B+",
        >= 2.7m => "B",
        >= 2.3m => "B-",
        >= 2.0m => "C+",
        >= 1.7m => "C",
        >= 1.0m => "D",
        _ => "F"
    };
}
