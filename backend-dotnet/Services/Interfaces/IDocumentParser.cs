namespace backend_dotnet.Services.Interfaces
{
	public interface IDocumentParser
	{
		public Task<(string extractedText, string extension, byte[] bytes)> ParseFile(IFormFile file);

		public Task SaveFileToDisk(byte[] bytes, string fileName, string extension, int notebookId);

	}
}
