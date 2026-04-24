using backend_dotnet.Models;

namespace backend_dotnet.Services.Interfaces
{
	public interface IEmbeddingService
	{
		public Task<List<TextChunk>> ProcessEmbeddings(string text, int fileId);

		public Task<Pgvector.Vector> ProcessSingleEmbedding(string text);
	}
}
