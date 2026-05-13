using AutoMapper;
using backend_dotnet.Data;
using backend_dotnet.Dtos.Notebooks;
using backend_dotnet.Extensions;
using backend_dotnet.Models;
using backend_dotnet.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Services
{
	public class NotebookService : INotebookService
	{
		private readonly ApplicationDbContext _context;
		private readonly IMapper _mapper;
		public NotebookService(ApplicationDbContext context, IMapper mapper)
		{
			_context = context;
			_mapper = mapper;
		}

		public async Task<ICollection<GetNotebooksResponse>> GetAllNotebooksByUser(string userId)
		{
			var notebooks = await _context.Notebooks.Where(n=>n.UserId == userId).ToListAsync();
			
			return _mapper.Map<ICollection<GetNotebooksResponse>>(notebooks);
		}
		public async Task CreateNotebook(string userId, CreateNotebookRequest request)
		{
			var notebook = _mapper.Map<Notebook>(request);
			notebook.UserId = userId;

			_context.Notebooks.Add(notebook);
			await _context.SaveChangesAsync();
		}
		
		public async Task<NotebookDetailsResponse> GetNotebook(string userId, int notebookId)
		{
			var notebook = await _context.Notebooks
				.Include(n => n.StudyPlans)
				.Include(n => n.UploadedFiles)
				.Include(n => n.ChatMessages.OrderByDescending(c => c.SendDateTime).Take(15))
				.FirstOrDefaultAsync(n => n.UserId == userId && n.Id == notebookId);

			if (notebook == null)
			{
				throw new KeyNotFoundException("Notebook with this owner and id was not found!");
			}

			notebook.LastOpenedDateTime = DateTime.UtcNow;
			await _context.SaveChangesAsync();

			return _mapper.Map<NotebookDetailsResponse>(notebook);
		}

		public async Task DeleteNotebook(string userId, int notebookId)
		{
			var notebook = await _context.ValidateNotebookOwnershipAsync(userId, notebookId);

			string directoryPath = Path.Combine(Directory.GetCurrentDirectory(), $"uploads/notebook_{notebookId}");
			if (Directory.Exists(directoryPath))
			{
				Directory.Delete(directoryPath, true);
			}

			_context.Notebooks.Remove(notebook);
			await _context.SaveChangesAsync();
		} 

		public async Task UpdateNotebook(string userId, int notebookId, UpdateNotebookRequest request)
		{
			var notebook = await _context.ValidateNotebookOwnershipAsync(userId, notebookId);

			_mapper.Map(request,notebook);
			
			await _context.SaveChangesAsync();
		}

	}
}
