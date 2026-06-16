using backend_dotnet.Models;
using backend_dotnet.Services.Interfaces;

namespace backend_dotnet.Services
{
    
    public class StudyPlanReaderRegistry: IStudyPlanReaderRegistry{
        private readonly IEnumerable<IStudyPlanReader> _readers;
        public StudyPlanReaderRegistry(IEnumerable<IStudyPlanReader> readers)
        {
            _readers = readers;   
        }
        public IStudyPlanReader Resolve(NotebookType type)
        {
            return _readers.Single(r=>r.Type == type);
        }
    }
}