using AutoMapper;
using backend_dotnet.Mappings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tests.Services
{
	public class NotebookServiceTests
	{

		private readonly IMapper _mapper;
		public NotebookServiceTests()
		{
			var config = new MapperConfiguration(cfg =>
			{
				cfg.AddProfile<NotebookProfile>();
			});
			_mapper = config.CreateMapper();
		}
	}
}
