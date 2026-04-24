using backend_dotnet.Models;
using backend_dotnet.Services.Interfaces;
using System.Text;

namespace backend_dotnet.Services
{
	public class DocumentParser : IDocumentParser
	{
		private readonly IHttpClientFactory _httpClientFactory;
		public DocumentParser(IHttpClientFactory httpClientFactory)
		{
			_httpClientFactory = httpClientFactory;
		}
		public async Task<(string extractedText, string extension, byte[] bytes)> ParseFile(IFormFile request)
		{
			return request.ContentType switch
			{
				"text/plain" => await ProcessTextFileAsync(request),
				"application/pdf" => await ProcessPdfFileAsync(request),
				_ => await ConvertAndProcessDocumentAsync(request),
			};
		}

		public async Task SaveFileToDisk(byte[] bytes,string fileName,string extension ,int notebookId)
		{
			string relativePath = $"uploads/notebook_{notebookId}";
			string absolutePath = Path.Combine(Directory.GetCurrentDirectory(), relativePath);

			string uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
			uniqueFileName = Path.ChangeExtension(uniqueFileName, extension);

			relativePath = Path.Combine(relativePath, uniqueFileName);
			absolutePath = Path.Combine(absolutePath, uniqueFileName);

			await File.WriteAllBytesAsync(absolutePath, bytes);
		}
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
			using (var ms = new MemoryStream())
			{
				await documentStream.CopyToAsync(ms);
				pdfBytes = ms.ToArray();
			}

			if (pdfBytes.Length == 0)
			{
				throw new Exception($"Python backend return a success status, but the data is missing");
			}
			string extractedText = ReadTextFromPdf(pdfBytes);
			return (extractedText, ".pdf", pdfBytes);

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
				using (var ms = new MemoryStream())
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
			return (extractedText, ".pdf", pdfBytes);
		}
		private string ReadTextFromPdf(byte[] pdfBytes)
		{
			StringBuilder stringBuilder = new StringBuilder();
			using var document = UglyToad.PdfPig.PdfDocument.Open(pdfBytes);
			foreach (var page in document.GetPages())
			{
				stringBuilder.Append(page.Text);
			}
			return stringBuilder.ToString();
		}

	}
}
