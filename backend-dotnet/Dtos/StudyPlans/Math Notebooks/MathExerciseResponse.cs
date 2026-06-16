namespace backend_dotnet.Dtos.StudyPlans
{
    
    public class MathExerciseResponse
    {
        
        public string Id { get; set; } = string.Empty;
        public string Prompt { get; set; } = string.Empty;
        public string Hint { get; set; } = string.Empty;
        public ICollection<ExerciseSubmissionResponse> Submissions { get; set; } = new List<ExerciseSubmissionResponse>();
    }
    public class ExerciseSubmissionResponse
    {
        public bool IsCorrect { get; set; }
        public string Feedback { get; set; } = string.Empty;
    }
}