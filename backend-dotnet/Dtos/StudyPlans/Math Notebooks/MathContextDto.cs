namespace backend_dotnet.Dtos.StudyPlans
{
    
    public class MathContextDto // for LLM schema
    {
        public string Content { get; set; }= string.Empty;
        public List<MathExercise> Exercises { get; set; } = new ();
    }

    public class MathExercise // for LLM schema
    {
        public string Id { get; set; } = string.Empty;
        public string Prompt { get; set; } = string.Empty;
        public string Hint { get; set; } = string.Empty;
    }
}