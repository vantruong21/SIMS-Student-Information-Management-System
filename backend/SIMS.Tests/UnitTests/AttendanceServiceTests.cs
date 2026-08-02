using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Moq;
using SIMS.Api.Data;
using SIMS.Api.Dtos.Attendance;
using SIMS.Api.Models;
using SIMS.Api.Services;
using SIMS.Api.Services.Interfaces;
using Xunit;

namespace SIMS.Tests.UnitTests;

/// <summary>
/// Unit Tests cho AttendanceService — Kiểm thử logic chốt điểm danh, upsert dữ liệu và tính thống kê vắng mặt.
/// Sử dụng EF Core InMemoryDatabase để cô lập cơ sở dữ liệu.
/// </summary>
public class AttendanceServiceTests
{
    private readonly Mock<IIdGeneratorService> _idGenMock = new();

    private ApplicationDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task SaveAttendanceAsync_NewEntries_SavesRecordsWithIncrementalIds()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();
        var service = new AttendanceService(db, _idGenMock.Object);

        var dto = new SaveAttendanceDto(
            CourseId: "crs-01",
            FacultyId: "fac-01",
            Entries: new[]
            {
                new AttendanceEntryDto("stu-01", "Present"),
                new AttendanceEntryDto("stu-02", "Absent"),
                new AttendanceEntryDto("stu-03", "Late")
            }
        );

        // Act
        var success = await service.SaveAttendanceAsync(dto);

        // Assert
        Assert.True(success);
        var attendances = await db.Attendances.ToListAsync();
        Assert.Equal(3, attendances.Count);
        Assert.Contains(attendances, a => a.StudentId == "stu-01" && a.Status == "Present");
        Assert.Contains(attendances, a => a.StudentId == "stu-02" && a.Status == "Absent");
        Assert.Contains(attendances, a => a.StudentId == "stu-03" && a.Status == "Late");
    }

    [Fact]
    public async Task SaveAttendanceAsync_ExistingEntry_UpdatesStatus()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();

        // Seed initial attendance record today
        db.Attendances.Add(new Attendance
        {
            Id = "att-01",
            StudentId = "stu-01",
            CourseId = "crs-01",
            FacultyId = "fac-01",
            AttendedDate = DateTime.UtcNow,
            Status = "Present"
        });
        await db.SaveChangesAsync();

        var service = new AttendanceService(db, _idGenMock.Object);

        // Act: Update student 01 status to Absent
        var dto = new SaveAttendanceDto(
            CourseId: "crs-01",
            FacultyId: "fac-01",
            Entries: new[]
            {
                new AttendanceEntryDto("stu-01", "Absent")
            }
        );

        var success = await service.SaveAttendanceAsync(dto);

        // Assert
        Assert.True(success);
        var record = await db.Attendances.FirstOrDefaultAsync(a => a.StudentId == "stu-01");
        Assert.NotNull(record);
        Assert.Equal("Absent", record.Status);
    }

    [Fact]
    public async Task GetSummaryByStudentIdAsync_ReturnsCorrectAbsentCount()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();

        // Seed Course
        var course = new Course
        {
            Id = "crs-01",
            Code = "CS101",
            Name = "Intro to Programming",
            Credits = 3,
            Status = "In Progress"
        };
        db.Courses.Add(course);

        // Seed 3 attendances for student 1: 1 Present, 2 Absent
        db.Attendances.AddRange(
            new Attendance { Id = "att-01", StudentId = "stu-01", CourseId = "crs-01", Status = "Present", AttendedDate = DateTime.UtcNow.AddDays(-2) },
            new Attendance { Id = "att-02", StudentId = "stu-01", CourseId = "crs-01", Status = "Absent", AttendedDate = DateTime.UtcNow.AddDays(-1) },
            new Attendance { Id = "att-03", StudentId = "stu-01", CourseId = "crs-01", Status = "Absent", AttendedDate = DateTime.UtcNow }
        );
        await db.SaveChangesAsync();

        var service = new AttendanceService(db, _idGenMock.Object);

        // Act
        var summaries = (await service.GetSummaryByStudentIdAsync("stu-01")).ToList();

        // Assert
        Assert.Single(summaries);
        var summary = summaries.First();
        Assert.Equal("crs-01", summary.CourseId);
        Assert.Equal(2, summary.AbsentCount);
        Assert.Equal(1, summary.PresentCount);
        Assert.Equal(3, summary.TotalSessions);
    }
}
