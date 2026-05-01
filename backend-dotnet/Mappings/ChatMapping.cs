using AutoMapper;
using backend_dotnet.Dtos.Chats;
using backend_dotnet.Models;

namespace backend_dotnet.Mappings
{
	public class ChatMapping : Profile
	{
		public ChatMapping()
		{
			CreateMap<ChatHistory, ChatHistoryResponse>();
		}
	}
}
