using backend_dotnet.Data;
using backend_dotnet.Models;
using backend_dotnet.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Pgvector.EntityFrameworkCore;

namespace backend_dotnet.Services
{
	public class ChatService : IChatService
	{
		private readonly ApplicationDbContext _context;
		private readonly IEmbeddingService _embeddingService;
		private readonly ILLMConnectService _lLMConnectService;
		public ChatService(ApplicationDbContext context, 
			IEmbeddingService embeddingService,
			ILLMConnectService lLMConnectService)
		{
			_context = context;
			_embeddingService = embeddingService;
			_lLMConnectService = lLMConnectService;
		}
		public async Task<string> SendMessageAsync(string userId, int notebookId, string message)
		{
			await ValidateOwnershipAsync(userId, notebookId);

			await _context.ChatHistories.AddAsync(new ChatHistory
			{
				NotebookId = notebookId,
				SenderRole = Sender.User,
				Message = message,
			});

			var relevantContext = await GetRelevantContextAsync(notebookId, message);
			var chatHistory= await _context.ChatHistories
				.Where(ch=>ch.NotebookId == notebookId)
				.OrderBy(ch=>ch.SendDateTime)
				.Take(5)
				.ToListAsync();

			string prompt = $@"
					You are an expert AI tutor.
					Your task is to answer the user's question using ONLY the provided context.
					Do NOT use outside knowledge.
					If the answer cannot be found in the context, respond EXACTLY with:
					'I cannot find the answer in your notebooks.'
					---------------------
					CONTEXT:
					{string.Join("\n\n", relevantContext)}
					---------------------
					RECENT CHAT HISTORY:
					{string.Join("\n", chatHistory.Select(ch => $"{ch.SenderRole}: {ch.Message}"))}
					---------------------
					USER QUESTION:
					{message}
					---------------------
					INSTRUCTIONS:
					- Answer clearly and concisely.
					- Base your answer strictly on the context.
					- If helpful, reference specific parts of the context.
					- Do not make assumptions or add information not present in the context.
					- Prefer short explanations unless more detail is necessary.

					ANSWER:
					";

			string llmResponse = await _lLMConnectService.GenerateTextAsync(prompt);

			await _context.ChatHistories.AddAsync(new ChatHistory
			{
				NotebookId= notebookId,
				SenderRole = Sender.AI,
				Message = llmResponse,
			});
			await _context.SaveChangesAsync();
			return llmResponse;
		}

		private async Task<List<string>> GetRelevantContextAsync(int notebookId, string message, int numberOfChunks=5)
		{
			var questionVector = await _embeddingService.ProcessSingleEmbedding(message);

			var relevantParagraphs = await _context.TextChunks
				.Include(c=>c.UploadedData)
				.Where(c=>c.UploadedData.NotebookId == notebookId)
				.OrderBy(c=>c.Embedding!.CosineDistance(questionVector))
				.Take(5)
				.Select(c=>c.Text)
				.ToListAsync();

			return relevantParagraphs;
		}
		
		public async Task<Notebook> ValidateOwnershipAsync(string userId, int notebookId)
		{
			var notebook = await _context.Notebooks.FindAsync(notebookId);

			if(notebook == null)
			{
				throw new KeyNotFoundException("Notebook not found.");
			}
			else if(notebook.UserId != userId)
			{
				throw new UnauthorizedAccessException("Owner mismatch");
			}
			return notebook;
		}
	}
}
