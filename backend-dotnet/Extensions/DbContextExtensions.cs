using backend_dotnet.Data;
using backend_dotnet.Models;
using Microsoft.EntityFrameworkCore;
using Pgvector;
using Pgvector.EntityFrameworkCore;

namespace backend_dotnet.Extensions
{
	public static class DbContextExtensions
	{
		public static async Task<Notebook> ValidateNotebookOwnershipAsync
			(this ApplicationDbContext context, string userId, int notebookId)
		{
			var notebook = await context.Notebooks.FindAsync(notebookId);
			if (notebook == null)
			{
				throw new KeyNotFoundException("Notebook not found.");
			}
			if (notebook.UserId != userId)
			{
				throw new UnauthorizedAccessException("Owner mismatch");
			}

			return notebook;
		}

		public static async Task<ICollection<string>> GetRelevantContextAsync(this ApplicationDbContext context,
			int notebookId,Vector embededText, int numberOfChunks=10)
		{
			var relevantChunks = await context.TextChunks
				.Include(tc => tc.UploadedData)
				.Where(tc => tc.UploadedData.NotebookId == notebookId)
				.OrderBy(tc => tc.Embedding!.CosineDistance(embededText))
				.Take(numberOfChunks)
				.Select(tc=>tc.Text)
				.ToListAsync();
			return relevantChunks;
		}
	}
}
