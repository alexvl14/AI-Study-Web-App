using backend_dotnet.Models;
using backend_dotnet.Services.Interfaces;

namespace backend_dotnet.Services
{
    
    public class StudyPlanGeneratorRegistry : IStudyPlanGeneratorRegistry
    {
        private readonly IEnumerable<IStudyPlanGenerator> _generators;
        public StudyPlanGeneratorRegistry(IEnumerable<IStudyPlanGenerator> generators)
        {
            _generators = generators;   
        }

        public IStudyPlanGenerator Resolve(NotebookType type)
        {
           return _generators.Single(g=>g.Type== type);
        }
    }
}