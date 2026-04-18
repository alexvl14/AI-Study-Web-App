using backend_dotnet.Dtos.Notebooks;
using backend_dotnet.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend_dotnet.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	[Authorize]
	public class NotebookController : BaseApiController
	{
		private readonly INotebookService _notebookService;

		public NotebookController(INotebookService notebookService)
		{
			_notebookService = notebookService;
		}

		[HttpGet("getAll")]
		public async Task<IActionResult> GetAllNotebooks()
		{
			var notebooks =  await _notebookService.GetAllNotebooksByUser(UserId);

			return Ok(notebooks);
		}

		[HttpPost("create")]
		public async Task<IActionResult> CreateNotebook(CreateNotebookRequest request)
		{
			await _notebookService.CreateNotebook(UserId, request);
			return Ok("Notebook created successfully");
		}

		[HttpDelete("delete/{notebookId}")]

		public async Task<IActionResult> DeleteNotebook(int notebookId)
		{
			await _notebookService.DeleteNotebook(UserId, notebookId);
			return Ok("Notebook was deleted successfully");
		}

		[HttpPatch("update/{notebookId}")]
		public async Task<IActionResult> UpdateNotebook(int notebookId, UpdateNotebookRequest request)
		{
			await _notebookService.UpdateNotebook(UserId,notebookId,request);
			return Ok("Notebook updated successfully");
		}

		[HttpGet("open/{notebookId}")]
		public async Task<IActionResult> OpenNotebook(int notebookId)
		{
			var notebookDetails = await _notebookService.GetNotebook(UserId, notebookId);
			return Ok(notebookDetails);
		}
	}
}
