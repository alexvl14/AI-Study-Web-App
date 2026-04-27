using backend_dotnet.Dtos.Chats;

namespace backend_dotnet.Services.Interfaces
{
	public interface IChatService
	{
		public Task<string> SendMessageAsync(string userId, int notebookId,  SendMessageRequest request);

	}
}
