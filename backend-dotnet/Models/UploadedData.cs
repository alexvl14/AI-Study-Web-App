using System.ComponentModel.DataAnnotations;

namespace backend_dotnet.Models
{
	public class UploadedData
	{
		[Key]
		public int Id { get; set; }
		public int NotebookId { get; set; }
		[Required]
		[MaxLength(200)]
		public string FileName { get; set; } = string.Empty;
		[Required]
		[MaxLength(500)]
		public string FilePath { get; set; } = string.Empty;
		[Required]
		[MaxLength(100)]
		public string ContentType { get; set; } = string.Empty;
		public string TextContent { get; set; } = string.Empty;
		public long FileSizeBytes { get; set; }
		public DateTime DateUploaded { get; set; } = DateTime.UtcNow;

		public ICollection<TextChunk> TextChunks { get; set; } = new List<TextChunk>();
		public Notebook? Notebook { get; set; }
	}
}
