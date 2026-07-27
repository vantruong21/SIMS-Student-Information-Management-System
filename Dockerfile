# 1. Build Stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY ["backend/SIMS.Api/SIMS.Api.csproj", "./"]
RUN dotnet restore "SIMS.Api.csproj"

# Copy everything else and build
COPY backend/SIMS.Api/ ./
RUN dotnet publish "SIMS.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# 2. Runtime Stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expose port (Render uses port 80 or 10000 by default, ASP.NET Core 8 defaults to 8080)
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "SIMS.Api.dll"]
