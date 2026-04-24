using backend_dotnet.Models;

namespace backend_dotnet.Services.Interfaces
{
	public interface IEmbeddingService
	{
		public Task<List<TextChunk>> ProcessEmbedding(string text, int fileId);
	}
}
