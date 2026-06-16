namespace backend_dotnet.Dtos.StudyPlans
{
    
    public class VerifyExerciseResponse
    {
        public int Id { get; set; }
        public string ExerciseId { get; set; } = string.Empty;
        public bool IsCorrect { get; set; }
        public string Feedback { get; set; } = string.Empty;
        public DateTime CreatedAt;
    }
}