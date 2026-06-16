using AutoMapper;
using backend_dotnet.Dtos.StudyPlans;
using backend_dotnet.Models;
using backend_dotnet.Services.Interfaces;

namespace backend_dotnet.Services
{
    
    public class GeneralStudyPlanReader : IStudyPlanReader
    {
        public NotebookType Type => NotebookType.General;
        private readonly IMapper _mapper;

        public GeneralStudyPlanReader(IMapper mapper)
        {
            _mapper = mapper;
        }

        public Task<FullStudyPlanResponse> BuildAsync(StudyPlan studyPlan)
        {
            return Task.FromResult(_mapper.Map<FullStudyPlanResponse>(studyPlan));
        }
    }
}