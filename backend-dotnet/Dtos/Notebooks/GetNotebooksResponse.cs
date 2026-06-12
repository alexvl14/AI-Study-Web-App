using backend_dotnet.Models;

namespace backend_dotnet.Dtos.Notebooks
{
	public class GetNotebooksResponse
	{
		public int Id { get; set; }
		public string Title { get; set; } = string.Empty;
		public NotebookType Type {get; set;}
		public string Description { get; set; } = string.Empty;
		public DateTime LastOpenedDateTime { get; set; } = DateTime.UtcNow;

	}
}
