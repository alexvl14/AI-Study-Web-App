using AutoMapper;
using backend_dotnet.Data;
using backend_dotnet.Dtos.Files;
using backend_dotnet.Models;
using backend_dotnet.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Text;
using UglyToad.PdfPig;
using UglyToad.PdfPig.Content;

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

			string relativePath = $"uploads/notebook_{notebookId}";
			string absolutePath = Path.Combine(Directory.GetCurrentDirectory(), relativePath);

			if (!Directory.Exists(absolutePath))
			{
				Directory.CreateDirectory(absolutePath);
			}

			(string extractedText, string extension, byte[] bytes) = request.ContentType switch
			{
				"text/plain" => await ProcessTextFileAsync(request),
				"application/pdf" => await ProcessPdfFileAsync(request),
				_ => await ConvertAndProcessDocumentAsync(request),
			};

			string uniqueFileName = $"{Guid.NewGuid()}_{request.FileName}";
			uniqueFileName = Path.ChangeExtension(uniqueFileName, extension);

			relativePath = Path.Combine(relativePath, uniqueFileName);
			absolutePath = Path.Combine(absolutePath, uniqueFileName);

			await File.WriteAllBytesAsync(absolutePath, bytes);
			var uploadedFile = new UploadedData
			{
				NotebookId = notebookId,
				FileName = request.FileName,
				FilePath = relativePath,
				ContentType = request.ContentType == "text/plain" ? "text/plain" : "application/pdf",
				TextContent = extractedText,
				FileSizeBytes = bytes.Length
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
				throw new UnauthorizedAccessException("You do not own this file.");
			}
			return file;
		}

		//return extracted text, extension, file
		private async Task<(string, string, byte[])> ConvertAndProcessDocumentAsync(IFormFile file)
		{
			using var stream = file.OpenReadStream();
			using var streamContent = new StreamContent(stream);
			using var client = _httpClientFactory.CreateClient("PythonBackend");
			using var formData = new MultipartFormDataContent();

			formData.Add(streamContent, "file", file.FileName);

			var response = await client.PostAsync("/parse_to_pdf", formData);

			if (!response.IsSuccessStatusCode)
			{
				var errorMsg = await response.Content.ReadAsStringAsync();
				throw new Exception($"Python backend responded with status code {response.StatusCode} : {errorMsg}");
			}

			using var documentStream = await response.Content.ReadAsStreamAsync();

			byte[] pdfBytes;
			using(var ms = new MemoryStream())
			{
				await documentStream.CopyToAsync(ms);
				pdfBytes = ms.ToArray();
			}

			if (pdfBytes.Length == 0)
			{
				throw new Exception($"Python backend return a success status, but the data is missing");
			}
			string extractedText = ReadTextFromPdf(pdfBytes);
			return (extractedText, ".pdf",pdfBytes);

		}
		private async Task<(string, string, byte[])> ProcessTextFileAsync(IFormFile file)
		{
			string extractedText;
			byte[] txtBytes;
			using (var stream = file.OpenReadStream())
			{
				using (var streamReader = new StreamReader(stream, System.Text.Encoding.UTF8, leaveOpen: true))
				{
					extractedText = await streamReader.ReadToEndAsync();
				}

				stream.Position = 0;
				using(var ms = new MemoryStream())
				{
					await stream.CopyToAsync(ms);
					txtBytes = ms.ToArray();
				}
			}
			return (extractedText, ".txt", txtBytes);
		}
		private async Task<(string, string, byte[])> ProcessPdfFileAsync(IFormFile file)
		{
			using var documentStream = file.OpenReadStream();
			byte[] pdfBytes;
			using (var ms = new MemoryStream())
			{
				await documentStream.CopyToAsync(ms);
				pdfBytes = ms.ToArray();
			}
			string extractedText = ReadTextFromPdf(pdfBytes);
			return (extractedText, ".pdf",  pdfBytes);
		}
		private string ReadTextFromPdf(byte[] pdfBytes)
		{
			StringBuilder stringBuilder = new StringBuilder();
			using var document = UglyToad.PdfPig.PdfDocument.Open(pdfBytes);
			foreach(var page in document.GetPages())
			{
				stringBuilder.Append(page.Text);
			}
			return stringBuilder.ToString();
		}


	}
}
