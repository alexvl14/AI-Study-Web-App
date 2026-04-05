using System.ComponentModel.DataAnnotations;

namespace backend_dotnet.Models
{
	public class QuizQuestion
	{
		[Key]
		public int Id { get; set; }
		public int StudyPlanId { get; set; }
		
		[Required]
		public string QuestionText { get; set; } = string.Empty;

		public StudyPlan? StudyPlan { get; set; }
		public ICollection<QuizOption> Options { get; set; } = new List<QuizOption>();
	}
}
