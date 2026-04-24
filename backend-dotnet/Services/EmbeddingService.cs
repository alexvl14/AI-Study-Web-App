using backend_dotnet.Models;
using backend_dotnet.Services.Interfaces;


namespace backend_dotnet.Services
{
	public class EmbeddingService : IEmbeddingService
	{
		private readonly IHttpClientFactory _httpClientFactory;
		public EmbeddingService(IHttpClientFactory httpClientFactory)
		{
			_httpClientFactory = httpClientFactory;
		}
		public async Task<List<TextChunk>> ProcessEmbeddings(string text, int fileId)
		{
			var chunks = SplitToChunks(text);
			var result = await GetEmbedding(chunks);
			var textChunks = new List<TextChunk>();
			
			for(int i =0; i < chunks.Count; i++)
			{
				textChunks.Add(new TextChunk
				{
					UploadedFileId = fileId,
					Text = chunks[i],
					Embedding = new Pgvector.Vector(result.Embeddings[i])
				});
			}
			return textChunks;
		}

		public async Task<Pgvector.Vector> ProcessSingleEmbedding(string text)
		{
			var result = await GetEmbedding(new List<string> { text});
			return new Pgvector.Vector(result.Embeddings[0]);
		}
		
		private async Task<EmbedResponse> GetEmbedding(List<string> chunks)
		{
			using var client = _httpClientFactory.CreateClient("PythonBackend");
			var data = new { texts = chunks };
			var response = await client.PostAsJsonAsync("/embed", data);

			if (!response.IsSuccessStatusCode)
			{
				throw new Exception("An error occurred while trying to embed the text!");
			}
			var result = await response.Content.ReadFromJsonAsync<EmbedResponse>();
			if (result == null || result.Embeddings == null)
			{
				throw new Exception("The embedding appeared successful but no embeddings were returned!");
			}
			return result;
			
		}
		private List<string> SplitToChunks(string text, int chunkSize=500, int overlap=50)
		{
			var textChunks = new List<string>();

			for(int i =0; i < text.Length; i+= (chunkSize - overlap))
			{
				int length = Math.Min(chunkSize, text.Length - i);
				textChunks.Add(text.Substring(i, length));
			}
			return textChunks;
		}

		public record EmbedResponse
		{
			public float[][] Embeddings { get; set; } = Array.Empty<float[]>();
		}
	}
}
