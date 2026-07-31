using Microsoft.EntityFrameworkCore;
using SIMS.Api.Data;
using SIMS.Api.Dtos.Attendance;
using SIMS.Api.Models;
using SIMS.Api.Services.Interfaces;

namespace SIMS.Api.Services;

public class AttendanceService : IAttendanceService
{
    private readonly ApplicationDbContext _db;
    private readonly IIdGeneratorService _idGen;

    public AttendanceService(ApplicationDbContext db, IIdGeneratorService idGen)
    {
        _db = db;
        _idGen = idGen;
    }

    public async Task<bool> SaveAttendanceAsync(SaveAttendanceDto dto)
    {
        var date = DateTime.UtcNow.Date;
        var nextDay = date.AddDays(1);

        // Fetch all existing attendance IDs to determine the max ID number before the loop
        var prefix = "att-";
        var ids = await _db.Attendances
            .Where(a => a.Id.StartsWith(prefix))
            .Select(a => a.Id)
            .ToListAsync();

        var maxNum = ids.Count == 0 ? 0 : ids
            .Select(id =>
            {
                var numStr = id.Substring(prefix.Length);
                return int.TryParse(numStr, out int num) ? num : 0;
            })
            .Max();

        foreach (var entry in dto.Entries)
        {
            // Upsert: nếu đã có record cùng student+course+date thì update, không thì insert
            var existing = await _db.Attendances.FirstOrDefaultAsync(a =>
                a.StudentId == entry.StudentId &&
                a.CourseId == dto.CourseId &&
                a.AttendedDate >= date &&
                a.AttendedDate < nextDay);

            if (existing is not null)
            {
                existing.Status = entry.Status;
                existing.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                maxNum++;
                _db.Attendances.Add(new Attendance
                {
                    Id = $"{prefix}{maxNum:D2}",
                    StudentId = entry.StudentId,
                    CourseId = dto.CourseId,
                    FacultyId = dto.FacultyId,
                    AttendedDate = DateTime.UtcNow,
                    Status = entry.Status
                });
            }
        }

        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<AttendanceRecordDto>> GetByStudentIdAsync(string studentId)
    {
        return await (
            from a in _db.Attendances
            join c in _db.Courses on a.CourseId equals c.Id
            where a.StudentId == studentId
            orderby a.AttendedDate descending
            select new AttendanceRecordDto(
                a.Id,
                a.StudentId,
                a.CourseId,
                c.Name,
                c.Code,
                a.Status,
                a.AttendedDate.ToString("yyyy-MM-dd"),
                a.Reason
            )
        ).ToListAsync();
    }

    public async Task<IEnumerable<AttendanceSummaryDto>> GetSummaryByStudentIdAsync(string studentId)
    {
        var records = await (
            from a in _db.Attendances
            join c in _db.Courses on a.CourseId equals c.Id
            where a.StudentId == studentId
            select new { a, c }
        ).ToListAsync();

        return records
            .GroupBy(x => new { x.c.Id, x.c.Name, x.c.Code })
            .Select(g => new AttendanceSummaryDto(
                g.Key.Id,
                g.Key.Name,
                g.Key.Code,
                g.Count(),
                g.Count(x => x.a.Status == "Present"),
                g.Count(x => x.a.Status == "Late"),
                g.Count(x => x.a.Status == "Absent")
            ));
    }

    public async Task<IEnumerable<AttendanceRecordDto>> GetByCourseIdAsync(string courseId)
    {
        return await (
            from a in _db.Attendances
            join c in _db.Courses on a.CourseId equals c.Id
            where a.CourseId == courseId
            orderby a.AttendedDate descending
            select new AttendanceRecordDto(
                a.Id,
                a.StudentId,
                a.CourseId,
                c.Name,
                c.Code,
                a.Status,
                a.AttendedDate.ToString("yyyy-MM-dd"),
                a.Reason
            )
        ).ToListAsync();
    }
}
