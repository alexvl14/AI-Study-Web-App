using AutoMapper;
using backend_dotnet.Dtos.StudyPlans;
using backend_dotnet.Models;

namespace backend_dotnet.Mappings
{
	public class StudyPlanMappings : Profile
	{
		public StudyPlanMappings()
		{

			CreateMap<SyllabusItem, StudyPlan>();
		}
	}
}
