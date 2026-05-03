using backend_dotnet.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_dotnet.Controllers
{
	[ApiController]
	[Authorize]
	[Route("api/notebooks/{notebookId}")]
	public class StudyPlanController : BaseApiController
	{
		private readonly IStudyPlanService _studyPlanService;
		public StudyPlanController(IStudyPlanService studyPlanService)
		{
			_studyPlanService = studyPlanService;
		}

		[HttpGet]
		[Route("generateSyllabus")]
		public async Task<IActionResult> GenerateSyllabus(int notebookId)
		{
			return Ok(await _studyPlanService.GenerateSyllabusAsync(UserId, notebookId));
		}
	}
}
