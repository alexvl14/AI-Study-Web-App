
using backend_dotnet.Dtos.StudyPlans;
using backend_dotnet.Models;

namespace backend_dotnet.Services.Interfaces
{
    
    public interface IMathAssessor
    {
        public Task<MathGradeResult> GradeAsync(MathExercise exercise, IReadOnlyList<ImageData> images);
    }
}