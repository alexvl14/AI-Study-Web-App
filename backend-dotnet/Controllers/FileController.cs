using backend_dotnet.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend_dotnet.Controllers
{
	[ApiController]
	[Authorize]
	[Route("api/notebooks/{notebookId}/files")]
	public class FileController : BaseApiController
	{
		private readonly IFilesService _fileService;

		public FileController(IFilesService filesService)
		{
			_fileService = filesService;
		}

		[HttpGet]
		public async Task<IActionResult> GetFilesForNotebook(int notebookId)
		{
			var notebooks = await _fileService.GetFilesForNotebook(UserId, notebookId);
			return Ok(notebooks);
		}

		[HttpPost]

		public async Task<IActionResult> UploadFile(int notebookId, IFormFile file)
		{
			await _fileService.UploadFile(UserId, notebookId, file);
			return Ok("The file was uploaded successfully.");
		}

		[HttpDelete]
		[Route("{fileId}")]
		public async Task<IActionResult> DeleteFile(int fileId)
		{
			await _fileService.DeleteFileFromNotebook(UserId, fileId);
			return Ok("File deleted successfully!");
		}

		[HttpGet]
		[Route("{fileId}")]
		public async Task<IActionResult> GetFile(int fileId, [FromQuery] bool download = false) 
		{
			var (stream, content_type, fileName) = await _fileService.DownloadFile(UserId, fileId);

			if (download)
			{
				return File(stream, content_type, fileName);
			}
			return File(stream, content_type);
		}

	}
}
