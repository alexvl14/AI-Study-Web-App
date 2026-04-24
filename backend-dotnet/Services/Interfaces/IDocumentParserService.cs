namespace backend_dotnet.Services.Interfaces
{
	public interface IDocumentParserService
	{
		public Task<(string extractedText, string extension, byte[] bytes)> ParseFile(IFormFile file);

	}
}
