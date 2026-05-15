using System.ComponentModel.DataAnnotations;

namespace backend_dotnet.Dtos.Notebooks
{
	public class CreateNotebookRequest
	{
		[Required]
		[MaxLength(50)]
		public string Title { get; set; } = string.Empty;
		[MaxLength(100)]
		public string Description { get; set; } = string.Empty;
	}
}
