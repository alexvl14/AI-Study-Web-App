using AutoMapper;
using backend_dotnet.Data;
using backend_dotnet.Dtos.Files;
using backend_dotnet.Models;
using backend_dotnet.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Services
{
	public class FileService : IFilesService
	{
		private readonly ApplicationDbContext _context;
		private readonly IMapper _mapper;
		public FileService(ApplicationDbContext context, IMapper mapper)
		{
			_context = context;
			_mapper = mapper;
		}

		public async Task DeleteFileFromNotebook(string userId, int fileId)
		{
			var file = await GetFileWithOwnershipCheck(userId, fileId);

			string fullPath = Path.Combine(Directory.GetCurrentDirectory(), file.FilePath);
			if (File.Exists(fullPath))
			{
				File.Delete(fullPath);
			}

			_context.UploadedFiles.Remove(file);
			await _context.SaveChangesAsync();
		}

		public async Task<ICollection<GetFilesForNotebookResponse>> GetFilesForNotebook(string userId, int notebookId)
		{
			var files = await _context.UploadedFiles
				.AsNoTracking()
				//.Include(f => f.Notebook)
				.Where(f => f.Notebook.UserId == userId && f.NotebookId == notebookId)
				.ToListAsync();

			return _mapper.Map<ICollection<GetFilesForNotebookResponse>>(files);
		}

		public async Task UploadFile(string userId, int notebookId, IFormFile request)
		{
			var notebook = await _context.Notebooks.FirstOrDefaultAsync(n=>n.UserId == userId && n.Id == notebookId);
			if(notebook == null)
			{
				throw new KeyNotFoundException("Notebook not found!");
			}

			string relativePath = $"/uploads/notebook_{notebookId}";
			string absolutePath = Path.Combine(Directory.GetCurrentDirectory(), relativePath);



			if(!Directory.Exists(absolutePath))
			{
				Directory.CreateDirectory(absolutePath);
			}

			string fileName = $"{Guid.NewGuid()}_{request.FileName}";
			absolutePath = Path.Combine(absolutePath, fileName);

			using (var stream = new FileStream(absolutePath, FileMode.Create))
			{
				await request.CopyToAsync(stream);
			}
			//The text Content !!!!!!!
			var uploadedFile = new UploadedData
			{
				NotebookId = notebookId,
				FileName = fileName,
				FilePath = $"{relativePath}/{fileName}",
				ContentType = request.ContentType,
				FileSizeBytes = request.Length
			};

			_context.UploadedFiles.Add(uploadedFile);
			await _context.SaveChangesAsync();
			
		}
		public async Task<(FileStream Stream, string ContentType, string FileName)> DownloadFile(string userId, int fileId)
		{
			var file = await GetFileWithOwnershipCheck(userId, fileId);

			string absolutePath = Path.Combine(Directory.GetCurrentDirectory(), file.FilePath);

			if (!File.Exists(absolutePath))
			{
				throw new FileNotFoundException("The physical file is missing!");
			}
			var stream = new FileStream(absolutePath, FileMode.Open, FileAccess.Read);

			return (stream, file.ContentType, file.FileName);
		}

		private async Task<UploadedData> GetFileWithOwnershipCheck(string userId, int fileId)
		{
			var file = await _context.UploadedFiles
				.Include(f => f.Notebook)
				.FirstOrDefaultAsync(f => f.Id == fileId);
			
			if(file == null)
			{
				throw new KeyNotFoundException("File not found!");
			}
			if(file.Notebook?.UserId != userId)
			{
				throw new UnauthorizedAccessException("You do not own this file.");
			}
			return file;
		}

		private async Task ParseFileToPdf(FileStream file)
		{
			
		}
	}
}
