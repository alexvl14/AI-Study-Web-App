using backend_dotnet.Dtos.Requests;
using backend_dotnet.Dtos.Responses;
namespace backend_dotnet.Services.Interfaces
{
	public interface INotebookService
	{
		public Task<ICollection<GetNotebooksResponse>> GetAllNotebooksByUser(string userId);

		public Task CreateNotebook(string userId, CreateNotebookRequest request);

		public Task<string> GetNotebook(int notebookId, string notebook);

		public Task DeleteNotebook(string userId, int notebookId);

		public Task UpdateNotebook(string userId, string notebook);
	}
}
