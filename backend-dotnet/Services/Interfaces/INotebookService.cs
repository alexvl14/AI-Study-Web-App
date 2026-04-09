using backend_dotnet.Dtos.Notebooks;
namespace backend_dotnet.Services.Interfaces
{
	public interface INotebookService
	{
		public Task<ICollection<GetNotebooksResponse>> GetAllNotebooksByUser(string userId);

		public Task CreateNotebook(string userId, CreateNotebookRequest request);

		public Task<NotebookDetailsResponse> GetNotebook(string userId, int notebookId);

		public Task DeleteNotebook(string userId, int notebookId);

		public Task UpdateNotebook(string userId, int notebookId, UpdateNotebookRequest request);
	}
}
