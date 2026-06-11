using backend_dotnet.Models;

namespace backend_dotnet.Services.Interfaces
{
    
    public interface IStudyPlanGenerator
    {
        NotebookType Type {get;}

        Task<ICollection<StudyPlan>> GenerateSyllabusAsync(Notebook notebook);
        Task GenerateContentAsync(Notebook notebook, StudyPlan studyPlan);
    }
}