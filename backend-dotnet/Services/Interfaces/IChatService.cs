using backend_dotnet.Dtos.Chats;

namespace backend_dotnet.Services.Interfaces
{
	public interface IChatService
	{
		public Task<string> SendMessageAsync(string userId, int notebookId,  SendMessageRequest request);

		public Task<ICollection<ChatHistoryResponse>> GetHistoryAsync(string userId, int notebookId, int lastMessageId, int limit=15);
	}
}
