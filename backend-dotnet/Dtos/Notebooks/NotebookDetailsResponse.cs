using backend_dotnet.Dtos.Chats;
using backend_dotnet.Dtos.StudyPlans;
using backend_dotnet.Models;

namespace backend_dotnet.Dtos.Notebooks
{
	public class NotebookDetailsResponse
	{
		public int Id { get; set; }
		public string Title { get; set; } = string.Empty;
		public string Description { get; set; } = string.Empty;

		public ICollection<FileResponse> Files { get; set; } = new List<FileResponse>();
		public ICollection<GetStudyPlanResponse> StudyPlans { get; set; } = new List<GetStudyPlanResponse>();
		public ICollection<ChatHistoryResponse> RecentChat { get; set; } = new List<ChatHistoryResponse>();

	}

	public record FileResponse(int Id, string FileName, string ContentType);
	

}
