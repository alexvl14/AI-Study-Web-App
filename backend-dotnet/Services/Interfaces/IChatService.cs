namespace backend_dotnet.Services.Interfaces
{
	public interface IChatService
	{
		public Task<string> SendMessageAsync(string userId, int notebookId, string text);

	}
}
