using backend_dotnet.Models;

namespace backend_dotnet.Dtos.StudyPlans
{
	public class StudyPlanDto
	{
		public string Content { get; set; } = string.Empty;
		public List<QuizQuestionDto> Quiz { get; set; } = new List<QuizQuestionDto>();
	}
	public class QuizQuestionDto
	{
		public string QuestionText { get; set; } = string.Empty;
		public List<QuizOptionDto> Options { get; set; } = new List<QuizOptionDto>();
	}
	public class QuizOptionDto
	{
		public string OptionText { get; set; } = string.Empty;
		public bool IsCorrect { get; set; }
	}

}
