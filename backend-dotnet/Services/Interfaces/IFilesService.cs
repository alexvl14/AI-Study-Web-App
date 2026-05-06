using backend_dotnet.Dtos.Files;

namespace backend_dotnet.Services.Interfaces
{
	public interface IFilesService
	{
		public Task<ICollection<GetFilesForNotebookResponse>> GetFilesForNotebook(string userId, int notebookId);

		public Task DeleteFileFromNotebook(string userId, int fileId);

		public Task<GetFilesForNotebookResponse> UploadFile(string userId, int notebookId, IFormFile request);

		public Task<(FileStream Stream, string ContentType, string FileName)> DownloadFile(string userId, int fileId);

	}
}
