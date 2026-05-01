using backend_dotnet.Models;
using backend_dotnet.Services.Interfaces;
using Google.GenAI;
using Google.GenAI.Types;
namespace backend_dotnet.Services
{
	public class LLMConnectService : ILLMConnectService
	{
		private readonly string _apiKey;
		private readonly string model;
		public LLMConnectService(IConfiguration configuration)
		{
			_apiKey = configuration["ExternalServices:Gemini:ApiKey"] ?? 
				throw new ArgumentNullException("Unable to find Gemini api key!");
			model = configuration["ExternalServices:Gemini:Model"] ?? 
				throw new ArgumentNullException("Unable to find model in configuration!");
			
		}
		public async Task<string> GenerateTextAsync(string prompt) => await ExecuteGeminiRequestAsync(prompt);

		public async Task<string> GenerateStructuredDataAsync(string prompt, Schema expectedSchema) =>
			await ExecuteGeminiRequestAsync(prompt, new GenerateContentConfig { 
				ResponseMimeType = "application/json",
				ResponseSchema = expectedSchema
			});

		private async Task<string> ExecuteGeminiRequestAsync(string prompt, GenerateContentConfig config = null)
		{
			var client = new Client(apiKey:_apiKey);
			var response = await client.Models.GenerateContentAsync(
				model: model,
				contents: prompt,
				config: config
			);
			return response.Text ?? throw new Exception("Encountered un error while trying to generate a response!");
		}
	}
}
