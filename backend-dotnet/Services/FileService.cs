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
		private readonly IHttpClientFactory _httpClientFactory;
		public FileService(ApplicationDbContext context, IMapper mapper, IHttpClientFactory httpClientFactory)
		{
			_context = context;
			_mapper = mapper;
			_httpClientFactory = httpClientFactory;
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
			absolutePath = Path.Combine(absolutePath, Path.ChangeExtension(fileName, ".pdf"));

			using var memoryStream = request.OpenReadStream();
			var (extractedText, pdfBytes) = await ParseFileToPdfAndText(memoryStream, request.FileName);

			await File.WriteAllBytesAsync(absolutePath, pdfBytes);

			var uploadedFile = new UploadedData
			{
				NotebookId = notebookId,
				FileName = fileName,
				FilePath = $"{relativePath}/{fileName}",
				ContentType = request.ContentType,
				TextContent = extractedText,
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

		private async Task<(string, byte[])> ParseFileToPdfAndText(Stream fileStream, string fileName)
		{
			using var streamContent = new StreamContent(fileStream);

			using var client = _httpClientFactory.CreateClient("PythonBackend");
			using var formData = new MultipartFormDataContent();

			formData.Add(streamContent, "file", fileName);

			var response = await client.PostAsync("/extract-text-pdf", formData);


			if (!response.IsSuccessStatusCode)
			{
				var errorMsg = await response.Content.ReadAsStringAsync();
				throw new Exception($"Python backend responded with status code {response.StatusCode} : {errorMsg}");
			}

			var jsonString = await response.Content.ReadAsStringAsync();
			var convertedResponse = System.Text.Json.JsonSerializer.Deserialize<ConvertedApiResponse>(
				jsonString,
				new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true }
				);
			string extractedText = convertedResponse.Text;
			string base64Pdf = convertedResponse.PdfBase64;

			if (string.IsNullOrEmpty(base64Pdf))
			{
				throw new Exception($"Python backend return a success status, but the data is missing");
			}
			byte[] pdfBytes = Convert.FromBase64String(base64Pdf);
			return (extractedText, pdfBytes);

		}
	}
}
