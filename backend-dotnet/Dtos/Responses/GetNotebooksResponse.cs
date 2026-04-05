namespace backend_dotnet.Dtos.Responses
{
	public class GetNotebooksResponse
	{
		public int Id { get; set; }
		public string Title { get; set; } = string.Empty;
		public string Description { get; set; } = string.Empty;
		public DateTime LastOpenedDateTime { get; set; } = DateTime.UtcNow;
	}
}
