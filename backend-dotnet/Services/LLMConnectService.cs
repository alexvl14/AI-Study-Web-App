using backend_dotnet.Dtos.StudyPlans;
using backend_dotnet.Models;
using backend_dotnet.Services.Interfaces;
using Google.GenAI;
using Google.GenAI.Types;
namespace backend_dotnet.Services
{
	public class LLMConnectService : ILLMConnectService
	{
		private readonly string _apiKey;
		private readonly string _model;
		public LLMConnectService(IConfiguration configuration)
		{
			_apiKey = configuration["ExternalServices:Gemini:ApiKey"] ?? 
				throw new ArgumentNullException("Unable to find Gemini api key!");
			_model = configuration["ExternalServices:Gemini:Model"] ?? 
				throw new ArgumentNullException("Unable to find model in configuration!");
			
		}
		public async Task<string> GenerateTextAsync(string prompt) => await ExecuteGeminiRequestAsync(prompt);

		public async Task<string> GenerateStructuredDataAsync(string prompt, Schema expectedSchema) =>
			await ExecuteGeminiRequestAsync(prompt, new GenerateContentConfig { 
				ResponseMimeType = "application/json",
				ResponseSchema = expectedSchema
			});

		public async Task<string> GenerateStructuredDataWithImageAsync(
			string prompt, Schema expectedSchema, IReadOnlyList<ImageData> images)
		{
			var parts = new List<Part>{Part.FromText(prompt)};
			foreach(var img in images)
			{
				parts.Add(Part.FromBytes(img.Bytes, img.MimeType));
			}
			var content = new Content{Role="user",Parts=parts};
			var config = new GenerateContentConfig
			{
				ResponseSchema = expectedSchema,
				ResponseMimeType = "application/json"
			};
			var client = new Client(apiKey: _apiKey);
			var response = await client.Models.GenerateContentAsync(
				model:_model,
				contents : content,
				config: config
				);
			return response.Text ?? throw new Exception("Encountered un error while trying to generate a response!");
			
		}
		private async Task<string> ExecuteGeminiRequestAsync(string prompt, GenerateContentConfig config = null!)
		{
			var client = new Client(apiKey:_apiKey);
			var response = await client.Models.GenerateContentAsync(
				model: _model,
				contents: prompt,
				config: config
			);
			return response.Text ?? throw new Exception("Encountered un error while trying to generate a response!");
		}
	}
}
