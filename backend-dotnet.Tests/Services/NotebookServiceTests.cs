using AutoMapper;
using backend_dotnet.Data;
using backend_dotnet.Mappings;
using Microsoft.EntityFrameworkCore;
using backend_dotnet.Models;
using backend_dotnet.Services;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using backend_dotnet.Dtos.Notebooks;

namespace Tests.Services
{
	public class NotebookServiceTests
	{

		private readonly IMapper _mapper;
		public NotebookServiceTests()
		{
			var config = new MapperConfiguration(cfg =>
			{
				cfg.AddProfile<NotebookProfile>();
			}, new LoggerFactory());
			_mapper = config.CreateMapper();
		}
		private ApplicationDbContext CreateInMemoryDbContext()
		{
			var options = new DbContextOptionsBuilder<ApplicationDbContext>()
				.UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
				.Options;
			return new ApplicationDbContext(options);	
		}


		[Fact]
		public async Task GetAllNotebooksByUser_UserHasNotebooks_ReturnsOnlyUsersNotebooksMappedToDto()
		{
			using var context = CreateInMemoryDbContext();

			await context.Notebooks.AddRangeAsync(
				new Notebook { Id = 1, UserId = "user_a", Title = "Notebook 1" },
				new Notebook { Id = 2, UserId = "user_a", Title = "Notebook 2" },
				new Notebook { Id = 3, UserId = "user_b", Title = "Notebook 3" }
			);
			await context.SaveChangesAsync();

			var service = new NotebookService(context, _mapper);

			var result = await service.GetAllNotebooksByUser("user_a");

			result.Should().NotBeNull();
			result.Should().HaveCount(2);
			result.Select(n => n.Title).Should().Contain(new[] { "Notebook 1", "Notebook 2" });
			result.Select(n => n.Title).Should().NotContain("Notebook 3");

		}

		[Fact]
		public async Task CreateNotebook_ValidRequest_SavesNotebookToDatabase()
		{
			using var context = CreateInMemoryDbContext();

			var service = new NotebookService(context, _mapper);
			var request = new CreateNotebookRequest { Title = "New Notebook" };

			await service.CreateNotebook("user_a", request);

			var savedNotebook = await context.Notebooks.FirstOrDefaultAsync(n=>n.UserId == "user_a");

			savedNotebook.Should().NotBeNull();
			savedNotebook!.Title.Should().Be("New Notebook");
		}

		[Fact]

		public async Task GetNotebook_NotebookExist_ReturnMappedDetails_UpdatesLastOpenedDateTime()
		{

			using var context = CreateInMemoryDbContext();
			await context.Notebooks.AddAsync(
				new Notebook { Id = 1, UserId = "user_a", Title = "N1" }
				);
			await context.SaveChangesAsync();

			var service = new NotebookService(context, _mapper);
			var result = await service.GetNotebook("user_a", 1);

			result.Should().NotBeNull();
			result.Title.Should().Be("N1");

			var updatedNotebook = await context.Notebooks.FirstOrDefaultAsync(n => n.Id == 1);
			updatedNotebook!.LastOpenedDateTime.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(5));
		}

		[Fact] 
		public async Task GetNotebook_NotebookDoesNotExist_ThrowsKeyNotFoundException()
		{
			using var context = CreateInMemoryDbContext();

			var service = new NotebookService(context, _mapper);
			var act = async () => await service.GetNotebook("user_a", 11);

			await act.Should().ThrowAsync<KeyNotFoundException>()
				.WithMessage("Notebook with this owner and id was not found!");
		}

		[Fact]
		public async Task DeleteNotebook_NotebookExistsAndOwnedByUser_DeletesFromDbAndCleanUpDirectory()
		{
			using var context = CreateInMemoryDbContext();
			int notebookId = 999;
			await context.Notebooks
				.AddAsync(new Notebook { Id = notebookId, UserId = "user_a", Title="N1"});
			await context.SaveChangesAsync();

			var directoryPath = Path.Combine(Directory.GetCurrentDirectory(),
				$"uploads/notebook_{notebookId}");
			Directory.CreateDirectory(directoryPath);

			var service = new NotebookService(context, _mapper);
			await service.DeleteNotebook("user_a", notebookId);

			context.Notebooks.Find(notebookId).Should().BeNull();
			Directory.Exists(directoryPath).Should().BeFalse();

		}
		[Fact]
		public async Task DeleteNotebook_NotebookExistsUsersMismatch_ThrowsUnauthorizedAccessException()
		{
			using var context = CreateInMemoryDbContext();
			int notebookId = 999;
			await context.Notebooks
				.AddAsync(new Notebook { Id = notebookId, UserId = "user_owner", Title = "N1" });
			await context.SaveChangesAsync();

			var service = new NotebookService(context, _mapper);

			var arc = async () => await service.DeleteNotebook("user_stranger", notebookId);
			await arc.Should().ThrowAsync<UnauthorizedAccessException>()
				.WithMessage("Owner mismatch");
		}

		[Fact]

		public async Task UpdateNotebook_ValidRequestAndOwner_UpdatesDatabase()
		{
			using var context = CreateInMemoryDbContext();
			await context.Notebooks.AddAsync(new Notebook { Id=1, UserId="user_a", Title="N1", Description= "D"});
			await context.SaveChangesAsync();

			var service = new NotebookService(context, _mapper);
			var request = new UpdateNotebookRequest { 
				Title = "Updated Title", Description = "Updated Description" };
			await service.UpdateNotebook("user_a", 1, request);

			var updatedNotebook = context.Notebooks.Find(1);
			updatedNotebook.Should().NotBeNull();
			updatedNotebook!.Title.Should().Be("Updated Title");
			updatedNotebook!.Description.Should().Be("Updated Description");

		}

		[Fact]

		public async Task UpdatedNotebook_OwnerMismatch_ThrowsUnauthorizedAccessException()
		{
			using var context = CreateInMemoryDbContext();
			await context.Notebooks.AddAsync(
				new Notebook { Id = 1, UserId = "user_owner", Title = "N1" });
			await context.SaveChangesAsync();

			var service = new NotebookService(context, _mapper);

			var arc = async () => await service.UpdateNotebook("user_stranger", 1, new UpdateNotebookRequest
			{
				Title = "Updated Title",
				Description = "Updated Description"
			});

			await arc.Should().ThrowAsync<UnauthorizedAccessException>()
				.WithMessage("Owner mismatch");
		}
	}
}
