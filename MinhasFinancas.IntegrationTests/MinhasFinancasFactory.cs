using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using MinhasFinancas.Infrastructure.Data;
using System;
using System.Linq;

namespace MinhasFinancas.IntegrationTests;

public class MinhasFinancasFactory : WebApplicationFactory<MinhasFinancas.API.Controllers.TransacoesController>
{
  private SqliteConnection? _connection;

  static MinhasFinancasFactory()
  {
    Environment.SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", "Testing");
  }

  protected override void ConfigureWebHost(IWebHostBuilder builder)
  {
    builder.ConfigureServices(services =>
    {
      var descriptor = services.SingleOrDefault(
              d => d.ServiceType == typeof(DbContextOptions<MinhasFinancasDbContext>));

      if (descriptor != null) services.Remove(descriptor);

      _connection = new SqliteConnection("Data Source=:memory:");
      _connection.Open();

      services.AddDbContext<MinhasFinancasDbContext>(options =>
          {
          options.UseSqlite(_connection);
        });

      var sp = services.BuildServiceProvider();
      using var scope = sp.CreateScope();
      var db = scope.ServiceProvider.GetRequiredService<MinhasFinancasDbContext>();
      db.Database.EnsureCreated();
    });
  }

  protected override void Dispose(bool disposing)
  {
    if (disposing)
    {
      _connection?.Close();
      _connection?.Dispose();
    }
    base.Dispose(disposing);
  }
}