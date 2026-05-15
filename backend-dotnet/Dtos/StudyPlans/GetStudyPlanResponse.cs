namespace backend_dotnet.Dtos.StudyPlans
{
	public class GetStudyPlanResponse
	{
		public int Id { get; set; }
		public int SequenceOrder { get; set; }
		public string Title { get; set; } = string.Empty;
		public string Description { get; set; } = string.Empty;
		public int DifficultyLevel { get; set; }
		public int IsGenerated { get; set; }
		public bool IsFinished { get; set; }
		public TimeSpan TimeItTookToFinish { get; set; } = TimeSpan.Zero;
	}
}
