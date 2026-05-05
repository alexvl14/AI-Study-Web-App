using backend_dotnet.Dtos.StudyPlans;
using backend_dotnet.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_dotnet.Controllers
{
	[ApiController]
	[Authorize]
	[Route("api/notebooks/{notebookId}/study-plans/")]
	public class StudyPlanController : BaseApiController
	{
		private readonly IStudyPlanService _studyPlanService;
		public StudyPlanController(IStudyPlanService studyPlanService)
		{
			_studyPlanService = studyPlanService;
		}

		[HttpPost]
		[Route("generateSyllabus")]
		public async Task<IActionResult> GenerateSyllabus(int notebookId)
		{
			return Ok(await _studyPlanService.GenerateSyllabusAsync(UserId, notebookId));
		}

		[HttpPost]
		[Route("{studyPlanId}/generate-context")]
		public async Task<IActionResult> GenerateStudyPlanContext(int notebookId, int studyPlanId)
		{
			await _studyPlanService.GenerateStudyPlanContextAsync(UserId, notebookId, studyPlanId);
			return Ok(new { message =  "Context generated successfully" });
		}

		[HttpGet]
		[Route("{studyPlanId}")]

		public async Task<IActionResult> GetStudyPlan(int notebookId, int studyPlanId)
		{
			return Ok(await _studyPlanService.GetStudyPlanAsync(UserId, notebookId, studyPlanId));
		}

		[HttpPost]
		[Route("{studyPlanId}/timer")]
		public async Task<IActionResult> UpdateTimer(int notebookId, int studyPlanId, [FromQuery] int secondsSpent)
		{
			var timeSpan = await _studyPlanService.UpdateTimeSpendAsync(UserId, notebookId, studyPlanId, secondsSpent);
			return Ok(new { message = "Timer updated successfully" , time=timeSpan});
		}

		[HttpPost]
		[Route("{studyPlanId}/quiz")]

		public async Task<IActionResult> SubmitQuiz(int notebookId, int studyPlanId, 
			[FromBody] QuizSubmitRequest request)
		{
			int score = await _studyPlanService.SubmitQuizAsync(UserId, notebookId, studyPlanId, request);
			return Ok(new { score = score });

		}

	}
}
