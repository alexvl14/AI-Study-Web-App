using AutoMapper;
using backend_dotnet.Dtos.Files;
using backend_dotnet.Models;

namespace backend_dotnet.Mappings
{
	public class FileProfile : Profile
	{
		public FileProfile() 
		{
			CreateMap<UploadedData, GetFilesForNotebookResponse>();
		}
	}
}
