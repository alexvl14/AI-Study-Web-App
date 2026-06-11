using System.ComponentModel.DataAnnotations;
using backend_dotnet.Models;
namespace backend_dotnet.Dtos.Notebooks
{
	public class CreateNotebookRequest
	{
		[Required]
		[MaxLength(50)]
		public string Title { get; set; } = string.Empty;
		[MaxLength(100)]
		public string Description { get; set; } = string.Empty;

		public NotebookType Type { get; set; } = NotebookType.General;
	}
}
