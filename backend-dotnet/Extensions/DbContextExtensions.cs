using backend_dotnet.Data;
using backend_dotnet.Models;

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
	}
}
