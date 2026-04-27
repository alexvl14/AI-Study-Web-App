using System.ComponentModel.DataAnnotations;

namespace backend_dotnet.Models
{
	public class QuizOption
	{
		[Key]
		public int Id { get; set; }
		public int QuestionId { get; set; }
		
		[Required]
		public string OptionText { get; set; } = string.Empty;
		public bool IsCorrect { get; set; }
		public bool IsSelectedByUser { get; set; }

		public QuizQuestion Question { get; set; } = null!;
	}
}
