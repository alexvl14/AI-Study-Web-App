using backend_dotnet.Models;

namespace backend_dotnet.Services.Interfaces
{
    
    public interface IStudyPlanGeneratorRegistry
    {
        IStudyPlanGenerator Resolve(NotebookType type);
    }
}