using AutoMapper;
using backend_dotnet.Data;
using backend_dotnet.Mappings;
using Microsoft.Extensions.Logging;
using backend_dotnet.Models;
using backend_dotnet.Services;
using Moq;
using FluentAssertions;
using backend_dotnet.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Test.Services;
namespace Tests.Services
{

    public class FileServiceTests : TestBase
    {
        private readonly IMapper _mapper;
        private readonly Mock<IDocumentParserService> _mockParser;
        private readonly Mock<IEmbeddingService> _mockEmbedding;

        public FileServiceTests()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<FileProfile>();
                
            }, new LoggerFactory());
            _mapper = config.CreateMapper();
            _mockParser = new Mock<IDocumentParserService>();
            _mockEmbedding = new Mock<IEmbeddingService>();
        }
 
        private FileService CreateService(ApplicationDbContext context)
            =>new FileService(context, _mapper, _mockParser.Object, _mockEmbedding.Object);

        [Fact]
        public async Task DeleteFileFromNotebook_FileExistsAndOwnedByUser_DeletesFileFromDisc()
        {
            using var context = CreateInMemoryDbContext();
            int notebookId = 999; 
            int fileId = 1;
            string relativePath  = $"uploads/notebook_{notebookId}/test.txt";
            string userID = "user_a";

            await context.Notebooks.AddAsync(new Notebook{Id=notebookId, UserId=userID,Title="Test"});
            await context.UploadedFiles.AddAsync(new UploadedData{ 
            Id=fileId,
            NotebookId=notebookId, 
            FilePath= relativePath,
            ContentType="text/plain",
            FileName="test.txt"});
            await context.SaveChangesAsync();

            string filePath = Path.Combine(Directory.GetCurrentDirectory(),relativePath);
            Directory.CreateDirectory(Path.GetDirectoryName(filePath)!);
            await File.WriteAllTextAsync(filePath, "Hello");

            var service = CreateService(context); 
           
           await service.DeleteFileFromNotebook(userID, fileId);
            
            context.UploadedFiles.Find(fileId).Should().BeNull();
            File.Exists(filePath).Should().BeFalse();
        }
        [Fact]
        public async Task DeleteFileFromNotebook_FileExistsUserMismatch_ThrowsUnauthorizedAcessException()
        {
            using var context = CreateInMemoryDbContext();
    
            await context.Notebooks.AddAsync(new Notebook{Id=1, UserId="user_a",Title="Test"});
            await context.UploadedFiles.AddAsync(new UploadedData{ 
            Id=1,
            NotebookId=1, 
            FilePath= "",
            ContentType="text/plain",
            FileName="text.txt"});
            await context.SaveChangesAsync();

            var service = CreateService(context);

            var arc = async () => await service.DeleteFileFromNotebook("user_b", 1);

            await arc.Should().ThrowAsync<UnauthorizedAccessException>();
        }

        [Fact]
        public async Task GetFilesForNotebook_NotebookExistsAndHasFiles_ReturnsFilesForNotebook()
        {
            using var context = CreateInMemoryDbContext();

            await context.Notebooks.AddRangeAsync(
                new Notebook{Id = 1, UserId="user_a", Title="N1"},
                new Notebook{Id=2, UserId="user_b", Title="N2"}
            );
            await context.UploadedFiles.AddRangeAsync(
                new UploadedData{Id=1, NotebookId=1, FileName="file1.txt"},
                new UploadedData{Id=2, NotebookId=1, FileName="file2.txt"},
                new UploadedData{Id=3, NotebookId=2, FileName="file3.txt"}
            );
            await context.SaveChangesAsync();

            var service = CreateService(context);

            var result = await service.GetFilesForNotebook("user_a", 1);

            result.Should().NotBeNull();
            result.Count.Should().Be(2);
        }

        [Fact]

        public async Task UploadFile_NotebookExistAndUserIsOwner_FileUploaded()
        {
            using var context = CreateInMemoryDbContext();

            int notebookId=10;            
   
            await context.Notebooks.AddAsync(new Notebook{Id=notebookId, UserId="user_a", Title="test"});
            await context.SaveChangesAsync(); 

            var mockFile = new Mock<IFormFile>();
            mockFile.Setup(x=>x.FileName).Returns("lecture.txt");
            mockFile.Setup(x=>x.ContentType).Returns("text/plain");

            byte[] fileBytes = System.Text.Encoding.UTF8.GetBytes("Some text content");
            _mockParser
                .Setup(x=>x.ParseFile(mockFile.Object))
                .ReturnsAsync(("Some text content", ".txt", fileBytes));
            _mockEmbedding
                .Setup(x=>x.ProcessEmbeddings(It.IsAny<string>(), It.IsAny<int>()))
                .ReturnsAsync(new List<TextChunk>());

            var service = CreateService(context);

            var result = await service.UploadFile("user_a", notebookId, mockFile.Object);

            result.Should().NotBeNull();
            result.FileName.Should().Be("lecture.txt");

            var savedFile = context.UploadedFiles.FirstOrDefault();
            savedFile.Should().NotBeNull();
            savedFile!.NotebookId.Should().Be(notebookId);
            savedFile!.TextContent.Should().Be("Some text content");
            File.Exists(Path.Combine(Directory.GetCurrentDirectory(), savedFile.FilePath)).Should().BeTrue();
            
            var dirPath = Path.Combine(Directory.GetCurrentDirectory(), $"uploads/notebook_{notebookId}");
            if (Directory.Exists(dirPath))
            {
                Directory.Delete(dirPath,true);
            }
        }

        [Fact]
        public async Task DownloadFile_FileExistsAndUserIsOwner_ReturnFileStream()
        {
            using var context = CreateInMemoryDbContext();

            await context.Notebooks.AddAsync(new Notebook{Id=1, UserId="user_a", Title="Test"});
            await context.UploadedFiles.AddAsync(
                new UploadedData
                {
                    Id=1,
                    NotebookId=1,
                    ContentType = "text/plain",
                    TextContent="Some text content",
                    FilePath=$"uploads/notebook_1/test.txt",
                    FileName="test.txt"
                }
            );
            await context.SaveChangesAsync();

            var aboslutePath = Path.Combine(Directory.GetCurrentDirectory(), $"uploads/notebook_1/test.txt");
            Directory.CreateDirectory(Path.GetDirectoryName(aboslutePath)!);
            await File.WriteAllTextAsync(aboslutePath, "Some text content");

            var service = CreateService(context);
            var result = await service.DownloadFile("user_a", 1);

            result.Stream.Should().NotBeNull();
            result.ContentType.Should().Be("text/plain");
            result.FileName.Should().Be("test.txt");

            result.Stream.Dispose();
            Directory.Delete(Path.GetDirectoryName(aboslutePath)!, true); 
        }


    }

}