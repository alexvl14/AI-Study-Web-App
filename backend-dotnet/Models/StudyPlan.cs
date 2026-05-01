using System.ComponentModel.DataAnnotations;

namespace backend_dotnet.Models
{
	public class StudyPlan
	{
		[Key]
		public int Id { get; set; }
		public int NotebookId { get; set; }

		public int SequenceOrder { get; set; }
		[Required]
		[MaxLength(50)]
		public string Title { get; set; } = string.Empty;
		public bool IsGenerated { get; set; } = false;
		public Difficulty DifficultyLevel { get; set; }
		
		[MaxLength(1000)]
		public string Description { get; set; } = string.Empty;
		
		[Required]
		public string Content { get; set; } = string.Empty;
		
		public bool IsStarted { get; set; } = false;
		public TimeSpan TimeItTookToFinish { get; set; }
		public int QuizResults { get; set; }

		public Notebook Notebook { get; set; } = null!;
		public ICollection<QuizQuestion> Questions { get; set; } = new List<QuizQuestion>();
	}

	public enum Difficulty
	{
		Easy,
		Medium,
		Hard,
	}
}
