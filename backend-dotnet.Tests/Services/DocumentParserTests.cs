using backend_dotnet.Services;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Moq;
namespace Tests.Services
{
    
    public class DocumentParserTests : TestBase
    {
        private readonly Mock<IHttpClientFactory> _mockHttpClient;
        public DocumentParserTests()
        {
            _mockHttpClient = new Mock<IHttpClientFactory>();

        }

        [Fact]
        public async Task ProcessTextFileAsync_ProvideTxtIFormFile_ReturnExtractedTextExtensionAndBytes()
        {
            var bytes = System.Text.Encoding.UTF8.GetBytes("Test text");
            var stream = new MemoryStream(bytes);

            var formFile = new FormFile(stream, 0,stream.Length, "file", "test.txt")
            {
                Headers= new HeaderDictionary(),
                ContentType= "text/plain"
            };

            var service = new DocumentParserService(_mockHttpClient.Object);

            var result = await service.ParseFile(formFile);
            result.extractedText.Should().Be("Test text");
            result.extension.Should().Be(".txt");
            result.bytes.Should().Equal(bytes);
        }

        [Fact]

        public async Task ProcessPdfFile_ProvidePdfIFormFile_ReturnExtractedTextExtensionAndBytes()
        {
            string pdfPath = Path.Combine(AppContext.BaseDirectory, "TestFiles", "PdfTest.pdf");
            byte[] bytes = await File.ReadAllBytesAsync(pdfPath);

            var stream = new MemoryStream(bytes);
            var formFile = new FormFile(stream, 0, stream.Length, "file", "PdfTest.pdf")
            {
                Headers= new HeaderDictionary(),
                ContentType="application/pdf"
            };

            var service = new DocumentParserService(_mockHttpClient.Object);
            var result = await service.ParseFile(formFile);

            result.bytes.Should().Equal(bytes);
            result.extension.Should().Be(".pdf");
            result.extractedText.Should().Be("Test pdf file ");

        }
    }
}