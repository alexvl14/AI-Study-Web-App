using System.ComponentModel.DataAnnotations;

namespace backend_dotnet.Dtos.Chats
{
	public class SendMessageRequest
	{
		[Required]
		[MaxLength(1000, ErrorMessage = "Please keep your questions under 1,000 characters. ")]
		public string Message { get; set; } = string.Empty;

	}
}
