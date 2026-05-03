using backend_dotnet.Dtos.Chats;
using backend_dotnet.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_dotnet.Controllers
{
	[ApiController]
	[Authorize]
	[Route("api/notebook/{notebookId}/chat")]
	public class ChatController : BaseApiController
	{
		private readonly IChatService _chatService;
		public ChatController(IChatService chatService)
		{
			_chatService = chatService;
		}

		[HttpPost]
		public async Task<IActionResult> SendMessage(int notebookId,[FromBody] SendMessageRequest request)
		{
			string aiResponse = await _chatService.SendMessageAsync(UserId, notebookId, request);
			return Ok(new { response = aiResponse});
		}

		[HttpGet]
		public async Task<IActionResult> GetHistory(int notebookId, [FromQuery] int lastMessageId)
		{
			var history = await _chatService.GetHistoryAsync(UserId,notebookId,lastMessageId);
			return Ok(history);
		}
	}
}
