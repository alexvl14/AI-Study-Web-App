using backend_dotnet.Data;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace Test.Services
{
    
    public abstract class TestBase
    {
        protected ApplicationDbContext CreateInMemoryDbContext()
        {
            var connection = new SqliteConnection("DataSource=:memory:;Foreign Keys=False");
            connection.Open();

            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseSqlite(connection)
                .Options;

            var context = new ApplicationDbContext(options);
            context.Database.EnsureCreated();
            return context;
        }
    }
}