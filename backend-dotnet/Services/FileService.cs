using AutoMapper;
using backend_dotnet.Data;
using backend_dotnet.Dtos.Files;
using backend_dotnet.Extensions;
using backend_dotnet.Models;
using backend_dotnet.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Services
{
	public class FileService : IFilesService
	{
		private readonly ApplicationDbContext _context;
		private readonly IMapper _mapper;

		private readonly IDocumentParserService _documentParser;
		private readonly IEmbeddingService _embeddingService;
		public FileService(ApplicationDbContext context, 
			IMapper mapper, 
			IDocumentParserService documentParser, IEmbeddingService embeddingService)
		{
			_context = context;
			_mapper = mapper;
			_documentParser = documentParser;
			_embeddingService = embeddingService;
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
				.Where(f => f.Notebook!.UserId == userId && f.NotebookId == notebookId)
				.ToListAsync();

			return _mapper.Map<ICollection<GetFilesForNotebookResponse>>(files);
		}

		public async Task<GetFilesForNotebookResponse> UploadFile(string userId, int notebookId, IFormFile request)
		{
			var notebook = await _context.ValidateNotebookOwnershipAsync(userId, notebookId);

			(string extractedText, string extension, byte[] bytes) = await _documentParser.ParseFile(request);

			(string relativePath,string absolutePath) = await SaveFileToDisk(notebookId, bytes, request.FileName, extension);

			using var transaction = await _context.Database.BeginTransactionAsync();
			try
			{
				var uploadedFile = new UploadedData
				{
					NotebookId = notebookId,
					FileName = request.FileName,
					FilePath = relativePath,
					ContentType = request.ContentType == "text/plain" ? "text/plain" : "application/pdf",
					TextContent = extractedText,
					FileSizeBytes = bytes.Length
				};

				await _context.UploadedFiles.AddAsync(uploadedFile);
				await _context.SaveChangesAsync();

				//text embedding
				var textChunks = await _embeddingService.ProcessEmbeddings(extractedText, uploadedFile.Id);
				await _context.TextChunks.AddRangeAsync(textChunks);
				await _context.SaveChangesAsync();

				await transaction.CommitAsync();
				return _mapper.Map<GetFilesForNotebookResponse>(uploadedFile);
			}
			catch(Exception)
			{
				if (File.Exists(absolutePath))
				{
					File.Delete(absolutePath);
				}
				throw;
			}
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


		//helper functions
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
				throw new UnauthorizedAccessException("Owner mismatch");
			}
			return file;
		}

		private async Task<(string, string)> SaveFileToDisk(int notebookId, byte[] bytes, string fileName, string extension)
		{
			string relativePath = $"uploads/notebook_{notebookId}";
			string absolutePath = Path.Combine(Directory.GetCurrentDirectory(), relativePath);
			if (!Directory.Exists(absolutePath))
			{
				Directory.CreateDirectory(absolutePath);
			}

			string uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
			uniqueFileName = Path.ChangeExtension(uniqueFileName, extension);

			relativePath = Path.Combine(relativePath, uniqueFileName);
			absolutePath = Path.Combine(absolutePath, uniqueFileName);
			await File.WriteAllBytesAsync(absolutePath, bytes);
			return (relativePath,absolutePath);
		}
	}
}
