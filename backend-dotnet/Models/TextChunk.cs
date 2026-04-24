using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Pgvector;

namespace backend_dotnet.Models
{
	public class TextChunk
	{
		[Key]
		public int Id { get; set; }

		[Required]
		public int UploadedFileId { get; set; }

		[Required]
		public string Text { get; set; } = string.Empty;

		[Column(TypeName = "vector(384)")]
		public Vector? Embedding { get; set; }

		public UploadedData? UploadedData { get; set; }
	}
}
