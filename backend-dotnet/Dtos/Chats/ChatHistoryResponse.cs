using backend_dotnet.Models;

namespace backend_dotnet.Dtos.Chats
{
	public record ChatHistoryResponse(int Id, string Message, Sender SenderRole, DateTime SendDateTime);
}
