using Microsoft.EntityFrameworkCore;
using SIMS.Api.Data;
using SIMS.Api.Services.Interfaces;

namespace SIMS.Api.Services;

public class IdGeneratorService : IIdGeneratorService
{
    private readonly ApplicationDbContext _db;

    public IdGeneratorService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<string> GenerateNextIdAsync<TEntity>(string prefix) where TEntity : class
    {
        // 1. Get all IDs from this table that start with the prefix
        // Since we cannot run complex string parsing in MySQL EF Core easily without raw SQL,
        // we pull the IDs starting with prefix to memory.
        var property = _db.Model.FindEntityType(typeof(TEntity))?.FindProperty("Id");
        if (property == null || property.ClrType != typeof(string))
            throw new InvalidOperationException("TEntity must have a string Id property.");

        // We use raw SQL to fetch just the IDs for performance
        var tableName = _db.Model.FindEntityType(typeof(TEntity))?.GetTableName();
        var ids = await _db.Database.SqlQueryRaw<string>($"SELECT Id FROM `{tableName}` WHERE Id LIKE '{prefix}%'").ToListAsync();

        if (ids.Count == 0)
        {
            return $"{prefix}01";
        }

        // 2. Extract numbers and find max
        var maxNum = ids
            .Select(id =>
            {
                var numStr = id.Substring(prefix.Length);
                return int.TryParse(numStr, out int num) ? num : 0;
            })
            .Max();

        // 3. Return next ID padded to at least 2 digits
        return $"{prefix}{(maxNum + 1):D2}";
    }
}
