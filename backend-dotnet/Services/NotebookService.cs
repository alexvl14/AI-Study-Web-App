using AutoMapper;
using backend_dotnet.Data;
using backend_dotnet.Dtos.Requests;
using backend_dotnet.Dtos.Responses;
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
		
		public async Task GetNotebook(string userId)
		{
			throw new NotImplementedException();
		}

		public async Task DeleteNotebook(string userId, int notebookId)
		{
			var notebook = await GetNotebookWithOwnershipCheck(userId, notebookId);

			_context.Notebooks.Remove(notebook);
			await _context.SaveChangesAsync();
		} 



		private async Task<Notebook> GetNotebookWithOwnershipCheck(string userId, int notebookId)
		{
			var notebook = await _context.Notebooks.FindAsync(notebookId);
			if(notebook == null)
			{
				throw new KeyNotFoundException("Notebook not found.");
			}
			if (notebook.UserId != userId)
			{
				throw new UnauthorizedAccessException("Owner mismatch.");
			}
			return notebook;

		}

	}
}
