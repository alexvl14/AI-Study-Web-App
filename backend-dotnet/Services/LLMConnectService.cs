using backend_dotnet.Services.Interfaces;
using Google.GenAI;
namespace backend_dotnet.Services
{
	public class LLMConnectService : ILLMConnectService
	{
		private readonly string _apiKey;
		public LLMConnectService(IConfiguration configuration)
		{
			_apiKey = configuration["ExternalServices:GeminiApiKey"] ?? 
				throw new ArgumentNullException("Unable to find Gemini api key!");
		}
		public async Task<string> GenerateTextAsync(string prompt)
		{
			var client = new Client(apiKey:  _apiKey);
			var response = await client.Models.GenerateContentAsync(
				model: "gemini-2.5-flash-lite", contents:prompt);

			return response.Text ?? throw new Exception("Encountered un error while trying to generate a response!");
		}
	}
}
