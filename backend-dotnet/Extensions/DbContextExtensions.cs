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

		public static async Task<List<string>> GetNotebookOverviewAsync(
			this ApplicationDbContext context, int notebookId, 
			int initialTake=10, int windowSize=3, int maxChunksPerFile=30, int maxFileCount=10)
		{
			var textChunksIdQuery = await context.TextChunks
				.Where(tc=>tc.UploadedData.NotebookId == notebookId)
				.Select(tc=> new { tc.Id, tc.UploadedFileId})
				.ToListAsync();

			var idsToFetch = new List<int>();
			var groupedChunks = textChunksIdQuery.GroupBy(tc => tc.UploadedFileId).Take(maxFileCount);

			foreach (var group in groupedChunks)
			{
				var fileChunks = group.OrderBy(tc => tc.Id).Select(tc => tc.Id).ToList();
				idsToFetch.AddRange(fileChunks.Take(initialTake));

				int allowedExtraChunks = maxChunksPerFile - initialTake;

				var remainingIds = fileChunks.Skip(initialTake).ToList();

				if (remainingIds.Count > 0 && allowedExtraChunks >= windowSize)
				{
					int numberOfWindows = allowedExtraChunks / windowSize;
					int stepSize = remainingIds.Count / numberOfWindows;
					stepSize = Math.Max(stepSize, windowSize);

					for (int i = 0; i < remainingIds.Count; i+=stepSize)
					{
						idsToFetch.AddRange(remainingIds.Skip(i).Take(windowSize));
					}
				}
			}
			var text = await context.TextChunks
				.Where(tc => idsToFetch.Contains(tc.Id))
				.OrderBy(tc=>tc.Id)
				.Select(tc => tc.Text)
				.ToListAsync();
			return text;

		}
	}
}
