using System.ComponentModel.DataAnnotations;

namespace backend_dotnet.Models
{
	public class ChatHistory
	{
		[Key]
		public int Id { get; set; }
		public int NotebookId { get; set; }
		public Sender SenderRole { get; set; }
		
		[Required]
		public string Message { get; set; } = string.Empty;
		public DateTime SendDateTime { get; set; }

		public Notebook? Notebook { get; set; }
	}

	public enum Sender
	{
		User,
		AI
	}
}
