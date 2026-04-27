using System.ComponentModel.DataAnnotations;

namespace backend_dotnet.Models
{
	public class Notebook
	{
		[Key]
		public int Id { get; set; }
		[Required]
		public string UserId { get; set; } = string.Empty;

		[Required]
		[MaxLength(50)]
		public string Title { get; set; } = string.Empty;
		[Required]
		[MaxLength(100)]
		public string Description { get; set; } = string.Empty;
		public DateTime LastOpenedDateTime { get; set; } = DateTime.UtcNow;

		public User UserNav { get; set; } = null!;
		public ICollection<StudyPlan> StudyPlans { get; set; } = new List<StudyPlan>();
		public ICollection<UploadedData> UploadedFiles { get; set; } = new List<UploadedData>();
		public ICollection<ChatHistory> ChatMessages { get; set; } = new List<ChatHistory>();
	}
}
