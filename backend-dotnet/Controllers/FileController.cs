using backend_dotnet.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_dotnet.Controllers
{
	[ApiController]
	[Authorize]
	[Route("api/file")]
	public class FileController : BaseApiController
	{
		private readonly IFilesService _fileService;

		public FileController(IFilesService filesService)
		{
			_fileService = filesService;
		}

		[HttpGet]
		[Route("getAll/{notebookId}")]
		public async Task<IActionResult> GetFilesForNotebook(int notebookId)
		{
			var notebooks = await _fileService.GetFilesForNotebook(UserId, notebookId);
			return Ok(notebooks);
		}

		[HttpPost]
		[Route("upload/{notebookId}")]

		public async Task<IActionResult> UploadFile(int notebookId, IFormFile file)
		{
			await _fileService.UploadFile(UserId, notebookId, file);
			return Ok("The file was uploaded successfully.");
		}

	}
}
