using backend_dotnet.Dtos.StudyPlans;

namespace backend_dotnet.Services.Interfaces
{
	public interface IStudyPlanService
	{
		public Task<SyllabusResponse> GenerateSyllabusAsync(string userId, int notebookId, int textChunksFromFile = 10);
	}
}
