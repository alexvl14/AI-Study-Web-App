using backend_dotnet.Dtos.StudyPlans;
using backend_dotnet.Models;

namespace backend_dotnet.Services.Interfaces
{
    
    public interface IQuizAssessor
    {
        int Assess(StudyPlan studyPlan, QuizSubmitRequest request);
    }
}