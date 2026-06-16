using backend_dotnet.Models;

namespace backend_dotnet.Services.Interfaces
{
    
    public interface IStudyPlanReaderRegistry
    {
        IStudyPlanReader Resolve(NotebookType type);
    }
}