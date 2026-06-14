using backend_dotnet.Dtos.StudyPlans;
using Google.GenAI.Types;

namespace backend_dotnet.Services.Interfaces
{
	public interface ILLMConnectService
	{
		public Task<string> GenerateTextAsync(string prompt);

		public Task<string> GenerateStructuredDataAsync(string prompt, Schema expectedSchema);
		public Task<string> GenerateStructuredDataWithImageAsync(string prompt, Schema expectedSchema,
		IReadOnlyList<ImageData> images);
	}
}
