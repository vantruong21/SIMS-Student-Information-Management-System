using SIMS.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace SIMS.Api.Services.Interfaces;

public interface IIdGeneratorService
{
    Task<string> GenerateNextIdAsync<TEntity>(string prefix) where TEntity : class;
}
