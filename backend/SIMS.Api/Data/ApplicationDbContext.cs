using Microsoft.EntityFrameworkCore;
using SIMS.Api.Models;

namespace SIMS.Api.Data;

/// <summary>
/// ApplicationDbContext — EF Core DbContext kết nối MySQL.
/// Cấu hình tất cả Entity mappings, constraints và relationships.
/// SOLID: Single Responsibility — chỉ chịu trách nhiệm về Database Context.
/// </summary>
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<Faculty> Faculties => Set<Faculty>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ── Users ──────────────────────────────────────────────────────────
        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(u => u.Id);
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.Role).HasMaxLength(20).IsRequired();
            e.Property(u => u.Email).HasMaxLength(150).IsRequired();
            e.Property(u => u.PasswordHash).HasMaxLength(255).IsRequired();
            e.Property(u => u.FullName).HasMaxLength(100).IsRequired();
        });

        // ── Students ───────────────────────────────────────────────────────
        modelBuilder.Entity<Student>(e =>
        {
            e.HasKey(s => s.Id);
            e.HasIndex(s => s.StudentCode).IsUnique();
            e.Property(s => s.Gpa).HasPrecision(3, 2);
            e.Property(s => s.Status).HasMaxLength(20).IsRequired();
            e.Property(s => s.Program).HasMaxLength(100).IsRequired();

            // 1-to-1: Student ↔ User
            e.HasOne(s => s.User)
             .WithOne(u => u.Student)
             .HasForeignKey<Student>(s => s.UserId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // ── Departments ────────────────────────────────────────────────────
        modelBuilder.Entity<Department>(e =>
        {
            e.HasKey(d => d.Id);
            e.HasIndex(d => d.DepartmentCode).IsUnique();
            e.Property(d => d.Name).HasMaxLength(100).IsRequired();
        });

        // ── Faculty ────────────────────────────────────────────────────────
        modelBuilder.Entity<Faculty>(e =>
        {
            e.HasKey(f => f.Id);
            e.HasIndex(f => f.FacultyCode).IsUnique();
            e.Property(f => f.Degree).HasMaxLength(50);

            // 1-to-1: Faculty ↔ User
            e.HasOne(f => f.User)
             .WithOne(u => u.Faculty)
             .HasForeignKey<Faculty>(f => f.UserId)
             .OnDelete(DeleteBehavior.Cascade);

            // N-to-1: Faculty → Department
            e.HasOne(f => f.Department)
             .WithMany(d => d.Faculties)
             .HasForeignKey(f => f.DepartmentId)
             .OnDelete(DeleteBehavior.Restrict);
        });

        // Department head is optional FK → Faculty (no cascade to avoid cycle)
        modelBuilder.Entity<Department>()
            .HasOne(d => d.HeadFaculty)
            .WithMany()
            .HasForeignKey(d => d.HeadFacultyId)
            .OnDelete(DeleteBehavior.SetNull)
            .IsRequired(false);

        // ── Courses ────────────────────────────────────────────────────────
        modelBuilder.Entity<Course>(e =>
        {
            e.HasKey(c => c.Id);
            e.HasIndex(c => c.Code).IsUnique();
            e.Property(c => c.Status).HasMaxLength(20);

            // N-to-1: Course → Department
            e.HasOne(c => c.Department)
             .WithMany(d => d.Courses)
             .HasForeignKey(c => c.DepartmentId)
             .OnDelete(DeleteBehavior.Restrict);

            // N-to-1: Course → Faculty (nullable instructor)
            e.HasOne(c => c.Instructor)
             .WithMany(f => f.Courses)
             .HasForeignKey(c => c.InstructorId)
             .OnDelete(DeleteBehavior.SetNull)
             .IsRequired(false);
        });

        // ── Enrollments ────────────────────────────────────────────────────
        modelBuilder.Entity<Enrollment>(e =>
        {
            e.HasKey(en => en.Id);
            e.HasIndex(en => new { en.StudentId, en.CourseId }).IsUnique(); // Mỗi SV chỉ đăng ký 1 lần/môn
            e.Property(en => en.AssignmentScore).HasPrecision(5, 2);
            e.Property(en => en.MidtermScore).HasPrecision(5, 2);
            e.Property(en => en.FinalScore).HasPrecision(5, 2);
            e.Property(en => en.TotalGrade).HasPrecision(3, 2);

            // N-to-1: Enrollment → Student
            e.HasOne(en => en.Student)
             .WithMany(s => s.Enrollments)
             .HasForeignKey(en => en.StudentId)
             .OnDelete(DeleteBehavior.Cascade);

            // N-to-1: Enrollment → Course
            e.HasOne(en => en.Course)
             .WithMany(c => c.Enrollments)
             .HasForeignKey(en => en.CourseId)
             .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
