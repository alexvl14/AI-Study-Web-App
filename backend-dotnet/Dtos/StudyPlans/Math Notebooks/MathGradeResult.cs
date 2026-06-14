namespace backend_dotnet.Dtos.StudyPlans
{
    public class MathGradeResult // for LLM Schema
    {
        public bool IsCorrect { get; set; }
        public string Feedback { get; set; } = string.Empty;   
    }
}