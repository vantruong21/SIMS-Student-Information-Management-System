using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Moq;
using SIMS.Api.Dtos.Student;
using SIMS.Api.Models;
using SIMS.Api.Repositories.Interfaces;
using SIMS.Api.Services;
using SIMS.Api.Services.Interfaces;
using Xunit;

namespace SIMS.Tests.UnitTests;

/// <summary>
/// Unit Tests cho StudentService — Đảm bảo quản lý sinh viên, chuyển đổi khóa tài khoản và tạo hồ sơ.
/// </summary>
public class StudentServiceTests
{
    private readonly Mock<IStudentRepository> _studentRepoMock = new();
    private readonly Mock<IUserRepository> _userRepoMock = new();
    private readonly Mock<IEnrollmentRepository> _enrollmentRepoMock = new();
    private readonly Mock<IGradeRepository> _gradeRepoMock = new();
    private readonly Mock<ICourseRepository> _courseRepoMock = new();
    private readonly Mock<IIdGeneratorService> _idGenMock = new();

    [Fact]
    public async Task GetAllAsync_ReturnsMappedStudentDtos()
    {
        // Arrange
        var students = new List<Student>
        {
            new Student
            {
                Id = "stu-01",
                StudentCode = "STU001",
                Program = "Software Engineering",
                Status = "Active",
                Gpa = 3.8m,
                TotalCredits = 45,
                User = new User { FullName = "Alice Smith", Email = "alice@elevate.edu", IsLocked = false }
            }
        };

        _studentRepoMock.Setup(r => r.GetAllAsync()).ReturnsAsync(students);

        var service = new StudentService(
            _studentRepoMock.Object,
            _userRepoMock.Object,
            _enrollmentRepoMock.Object,
            _gradeRepoMock.Object,
            _courseRepoMock.Object,
            _idGenMock.Object
        );

        // Act
        var result = (await service.GetAllAsync()).ToList();

        // Assert
        Assert.Single(result);
        Assert.Equal("Alice Smith", result[0].Name);
        Assert.Equal("Software Engineering", result[0].Program);
    }

    [Fact]
    public async Task ToggleLockAsync_ExistingUser_TogglesLockState()
    {
        // Arrange
        var user = new User
        {
            Id = "usr-01",
            Email = "student@elevate.edu",
            IsLocked = false,
            FailedLoginAttempts = 3
        };

        _userRepoMock.Setup(r => r.GetByEmailAsync(user.Email)).ReturnsAsync(user);

        var service = new StudentService(
            _studentRepoMock.Object,
            _userRepoMock.Object,
            _enrollmentRepoMock.Object,
            _gradeRepoMock.Object,
            _courseRepoMock.Object,
            _idGenMock.Object
        );

        // Act
        var success = await service.ToggleLockAsync("student@elevate.edu");

        // Assert
        Assert.True(success);
        Assert.True(user.IsLocked);
        _userRepoMock.Verify(r => r.UpdateAsync(It.Is<User>(u => u.IsLocked == true)), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_ValidDto_CreatesUserAndStudent()
    {
        // Arrange
        var dto = new CreateStudentDto(
            Name: "Bob Buildel",
            Email: "bob@elevate.edu",
            Program: "Computer Science",
            Phone: "1234567890",
            DateOfBirth: "2000-01-01",
            Address: "123 Campus St",
            Status: "Active",
            Password: "Password123!"
        );

        _userRepoMock.Setup(r => r.GetByEmailAsync(dto.Email)).ReturnsAsync((User?)null);
        _idGenMock.Setup(g => g.GenerateNextIdAsync<User>("usr-s-")).ReturnsAsync("usr-s-99");
        _idGenMock.Setup(g => g.GenerateNextIdAsync<Student>("stu-")).ReturnsAsync("stu-99");

        var service = new StudentService(
            _studentRepoMock.Object,
            _userRepoMock.Object,
            _enrollmentRepoMock.Object,
            _gradeRepoMock.Object,
            _courseRepoMock.Object,
            _idGenMock.Object
        );

        // Act
        var (success, errors) = await service.CreateAsync(dto);

        // Assert
        Assert.True(success);
        Assert.Empty(errors);
        _userRepoMock.Verify(r => r.CreateAsync(It.Is<User>(u => u.Email == "bob@elevate.edu")), Times.Once);
        _studentRepoMock.Verify(r => r.CreateAsync(It.Is<Student>(s => s.UserId == "usr-s-99")), Times.Once);
    }
}
