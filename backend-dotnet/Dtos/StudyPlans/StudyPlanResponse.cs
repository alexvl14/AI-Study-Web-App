using backend_dotnet.Models;

namespace backend_dotnet.Dtos.StudyPlans
{
	public class StudyPlanResponse
	{
		public int Id { get; set; }
		public int SequenceOrder { get; set; }
		public string Title { get; set; } = string.Empty;
		public Difficulty DifficultyLevel { get; set; }
		public string Content { get; set; } = string.Empty;
		public bool IsQuizCompleted { get; set; }
		public bool IsFinished { get; set; }
		public TimeSpan TimeItTookToFinish { get; set; } = TimeSpan.Zero;
		public ICollection<QuizQuestionResponse> Questions { get; set; } = new List<QuizQuestionResponse>();
	}

	public class QuizQuestionResponse
	{
		public int Id { get; set; }
		public string QuestionText { get; set; } = string.Empty;
		public ICollection<QuizOptionResponse> Options { get; set; } = new List<QuizOptionResponse>();
	}
	public class QuizOptionResponse
	{
		public int Id { get; set; }
		public string OptionText { get; set; } = string.Empty;
		public bool IsCorrect { get; set; }
		public bool IsSelectedByUser { get; set; }
	}
}
