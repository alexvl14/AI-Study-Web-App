
namespace backend_dotnet.Dtos.Files
{
	public class GetFilesForNotebookResponse
	{
		public int Id { get; set; }
		public string FileName { get; set; } = string.Empty;
		public string ContentType { get; set; } = string.Empty;
		public long FileSizeBytes { get; set; }
		public DateTime DateUploaded { get; set; } = DateTime.UtcNow;
	}
}
