using backend_dotnet.Dtos.StudyPlans;

namespace backend_dotnet.Services.Interfaces
{
	public interface IStudyPlanService
	{
		public Task<ICollection<GetStudyPlanResponse>> GenerateSyllabusAsync(string userId, int notebookId);
		public Task GenerateStudyPlanContextAsync(string userId, int notebookId, int studyPlanId);
		public Task<FullStudyPlanResponse> GetStudyPlanAsync(string userId, int notebookId, int studyPlanId);
		public Task<TimeSpan> UpdateTimeSpendAsync(string userId, int notebookId, int studyPlanId, int secondsSpent);
		public Task<int> SubmitQuizAsync(string userId, int notebookId, int studyPlanId, QuizSubmitRequest request);
	}
}
