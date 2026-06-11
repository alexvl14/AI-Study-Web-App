using AutoMapper;
using backend_dotnet.Data;
using backend_dotnet.Mappings;
using backend_dotnet.Services;
using backend_dotnet.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Moq;
using backend_dotnet.Models;
using FluentAssertions;
namespace Tests.Services
{
    
    public class ChatServiceTests : TestBase
    {
        
        private readonly IMapper _mapper;
        private readonly Mock<IEmbeddingService> _mockEmbedding;
        private readonly Mock<ILLMConnectService> _mockLLMConnect;

        public ChatServiceTests()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<ChatMapping>();
            }, new LoggerFactory());
            _mapper = config.CreateMapper();
            _mockEmbedding = new Mock<IEmbeddingService>();
            _mockLLMConnect = new Mock<ILLMConnectService>();
        }   

        private ChatService CreateService(ApplicationDbContext context)
            =>new ChatService(context, _mockEmbedding.Object, _mockLLMConnect.Object, _mapper);
        
        [Fact]
        public async Task GetHistoryAsync_NotebookHasMessages_ReturnsMessagesBeforeLastIdDescending()
        {
            using var context = CreateInMemoryDbContext();
            await context.Notebooks.AddAsync(new Notebook { Id = 1, UserId = "user_a", Title = "Test" });
            await context.ChatHistories.AddRangeAsync(
                new ChatHistory { Id = 1, NotebookId = 1, SenderRole = Sender.User, Message = "msg 1" },
                new ChatHistory { Id = 2, NotebookId = 1, SenderRole = Sender.AI,   Message = "msg 2" },
                new ChatHistory { Id = 3, NotebookId = 1, SenderRole = Sender.User, Message = "msg 3" },
                new ChatHistory { Id = 4, NotebookId = 1, SenderRole = Sender.AI,   Message = "msg 4" }
            );
            await context.SaveChangesAsync();

            var service = CreateService(context);

            var result = await service.GetHistoryAsync("user_a", 1, lastMessageId: 4);

            result.Should().HaveCount(3);
            result.First().Message.Should().Be("msg 3");
            result.Last().Message.Should().Be("msg 1");
        }
        [Fact]
        public async Task GetHistoryAsync_UserDoesNotOwnNotebook_ThrowsUnauthorizedAccessException()
        {
            using var context = CreateInMemoryDbContext();
            await context.Notebooks.AddAsync(new Notebook { Id = 1, UserId = "user_a", Title = "Test" });
            await context.SaveChangesAsync();

            var service = CreateService(context);

            var act = async () => await service.GetHistoryAsync("user_b", 1, lastMessageId: 100);

            await act.Should().ThrowAsync<UnauthorizedAccessException>()
                .WithMessage("Owner mismatch");
        }
        
    }
}