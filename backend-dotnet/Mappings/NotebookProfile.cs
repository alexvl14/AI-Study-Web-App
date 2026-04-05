using AutoMapper;
using backend_dotnet.Dtos.Requests;
using backend_dotnet.Dtos.Responses;
using backend_dotnet.Models;

namespace backend_dotnet.Mappings
{
	public class NotebookProfile : Profile
	{
		public NotebookProfile()
		{
			CreateMap<CreateNotebookRequest, Notebook>();

			CreateMap<Notebook, GetNotebooksResponse>();
		}
	}
}
