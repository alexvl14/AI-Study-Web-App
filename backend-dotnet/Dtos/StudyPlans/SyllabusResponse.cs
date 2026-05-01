namespace backend_dotnet.Dtos.StudyPlans
{
	public class SyllabusResponse
	{
		public ICollection<SyllabusItem> Modules { get; set; } = new List<SyllabusItem>();
	}

}
