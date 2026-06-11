

using System.ComponentModel.DataAnnotations;

namespace backend_dotnet.Models
{
    
    public class ExerciseSubmission
    {
        [Key]
        public int Id { get; set; }
        public int StudyPlanId { get; set; }
        public string ExerciseId { get; set; }= string.Empty;
        public string ImagePath { get; set; }=string.Empty;
        public string ExtractedWork { get; set; } = string.Empty;
        public bool IsCorrect {get; set;}
        public string Feedback { get; set; }= string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public StudyPlan StudyPlan { get; set; } = null!;
    }
}