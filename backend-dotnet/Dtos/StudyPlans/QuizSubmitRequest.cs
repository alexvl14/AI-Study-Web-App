namespace backend_dotnet.Dtos.StudyPlans
{
	public class QuizSubmitRequest
	{
		public Dictionary<int, int> answers { get; set; } = new Dictionary<int, int>();	
	}
}
