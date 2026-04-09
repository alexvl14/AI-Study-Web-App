using AutoMapper;
using backend_dotnet.Dtos.Notebooks;
using backend_dotnet.Models;

namespace backend_dotnet.Mappings
{
	public class NotebookProfile : Profile
	{
		public NotebookProfile()
		{
			CreateMap<CreateNotebookRequest, Notebook>();

			CreateMap<Notebook, GetNotebooksResponse>();

			CreateMap<Notebook, NotebookDetailsResponse>()
				.ForMember(dest => dest.Files, opt => opt.MapFrom(src => src.UploadedFiles))
				.ForMember(dest => dest.RecentChat, opt => opt.MapFrom(src => src.ChatMessages));
			CreateMap<UploadedData, FileResponse>();
			CreateMap<StudyPlan, StudyPlanResponse>();
			CreateMap<ChatHistory, ChatHistoryResponse>();

			CreateMap<UpdateNotebookRequest, Notebook>();
		}
	}
}
