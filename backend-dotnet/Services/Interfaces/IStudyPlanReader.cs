using backend_dotnet.Dtos.StudyPlans;
using backend_dotnet.Models;

namespace backend_dotnet.Services.Interfaces
{
    
    public interface IStudyPlanReader
    {
        public NotebookType Type {get;}
        public Task<FullStudyPlanResponse> BuildAsync(StudyPlan studyPlan);
    }
}