using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using backend_dotnet.Models;

namespace backend_dotnet.Data
{
    public class ApplicationDbContext : IdentityDbContext<IdentityUser>
    {
        public DbSet<Notebook> Notebooks { get; set; }
        public DbSet<UploadedData> UploadedFiles { get; set; }
        public DbSet<StudyPlan> StudyPlans { get; set; }
        public DbSet<QuizQuestion> QuizQuestions { get; set; }
        public DbSet<QuizOption> QuizOptions { get; set; }
        public DbSet<ChatHistory> ChatHistories { get; set; }

        public DbSet<TextChunk> TextChunks { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);

			if (Database.ProviderName == "Microsoft.EntityFrameworkCore.InMemory")
			{
				builder.Entity<TextChunk>().Ignore(tc => tc.Embedding);
			}
			else
			{
				builder.HasPostgresExtension("vector");
			}
		}
    }
}