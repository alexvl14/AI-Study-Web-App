namespace backend_dotnet.Services.Interfaces
{
	public interface ILLMConnectService
	{
		public Task<string> GenerateTextAsync(string prompt);
	}
}
