using backend_dotnet.Dtos.StudyPlans;

namespace backend_dotnet.Services.Interfaces
{
	public interface IStudyPlanService
	{
		public Task<SyllabusResponse> GenerateSyllabusAsync(string userId, int notebookId, int textChunksFromFile = 10);
		public Task GenerateStudyPlanContextAsync(string userId, int notebookId, int studyPlanId, int numberOfQuestions = 5);
		public Task<StudyPlanResponse> GetStudyPlanAsync(string userId, int notebookId, int studyPlanId);
		public Task<TimeSpan> UpdateTimeSpendAsync(string userId, int notebookId, int studyPlanId, int secondsSpent);
		public Task<int> SubmitQuizAsync(string userId, int notebookId, int studyPlanId, QuizSubmitRequest request);
	}
}
