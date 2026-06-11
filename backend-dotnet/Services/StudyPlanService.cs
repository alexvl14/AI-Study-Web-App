using AutoMapper;
using backend_dotnet.Data;
using backend_dotnet.Dtos.StudyPlans;
using backend_dotnet.Extensions;
using backend_dotnet.Models;
using backend_dotnet.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Services
{
	public class StudyPlanService : IStudyPlanService
	{
		private readonly ApplicationDbContext _context;

		private readonly IMapper _mapper;
		private readonly IStudyPlanGeneratorRegistry _registry;
		public StudyPlanService(ApplicationDbContext context, 
			IMapper mapper,
			IStudyPlanGeneratorRegistry registry)
		{
			_context = context;
			_mapper = mapper;
			_registry = registry;
		}

		public async Task<ICollection<GetStudyPlanResponse>> GenerateSyllabusAsync(string userId, int notebookId)
		{
			var notebook = await _context.ValidateNotebookOwnershipAsync(userId, notebookId);
			
			var generator = _registry.Resolve(notebook.Type);
			var studyPlans = await generator.GenerateSyllabusAsync(notebook);	
			
			foreach(var studyPlan in studyPlans)
			{
				studyPlan.NotebookId = notebookId;
			}
			await _context.StudyPlans.AddRangeAsync(studyPlans);
			await _context.SaveChangesAsync();
			return _mapper.Map<ICollection<GetStudyPlanResponse>>(studyPlans);
		}

		public async Task GenerateStudyPlanContextAsync(string userId, int notebookId, int studyPlanId)
		{
			var notebook = await _context.ValidateNotebookOwnershipAsync(userId, notebookId);
			var studyPlan = await ValidateStudyPlanOwnershipCheck(notebookId, studyPlanId);

			if(studyPlan.IsGenerated )return;

			var generator = _registry.Resolve(notebook.Type);
			await generator.GenerateContentAsync(notebook, studyPlan);

			await _context.SaveChangesAsync();
		}

		public async Task<FullStudyPlanResponse> GetStudyPlanAsync(string userId, int notebookId, int studyPlanId)
		{
			await _context.ValidateNotebookOwnershipAsync(userId, notebookId);
			var studyPlan = await _context.StudyPlans
				.Include(sp => sp.Questions)
				.ThenInclude(q => q.Options)
				.FirstOrDefaultAsync(sp=>sp.Id == studyPlanId && sp.NotebookId == notebookId);
			
			if(studyPlan == null)
			{
				throw new KeyNotFoundException("Module not found for this notebook!");
			}

			if (!studyPlan.IsGenerated)
			{
				throw new Exception("Generate the module first!");
			}
			var mappedStudyPlan = _mapper.Map<FullStudyPlanResponse>(studyPlan);
			return mappedStudyPlan;

		}

		public async Task<TimeSpan> UpdateTimeSpendAsync(string userId, int notebookId, int studyPlanId, int secondsSpent)
		{
			await _context.ValidateNotebookOwnershipAsync(userId, notebookId);

			var studyPlan = await ValidateStudyPlanOwnershipCheck(notebookId, studyPlanId);

			if (!studyPlan.IsFinished)
			{
				studyPlan.TimeItTookToFinish += TimeSpan.FromSeconds(secondsSpent);
				await _context.SaveChangesAsync();
			}
			return studyPlan.TimeItTookToFinish;
		}

		public async Task<int> SubmitQuizAsync(string userId, int notebookId, int studyPlanId, QuizSubmitRequest request)
		{
			await _context.ValidateNotebookOwnershipAsync(userId, notebookId);
			var studyPlan = await _context.StudyPlans
				.Include(sp=>sp.Questions)
				.ThenInclude(s => s.Options)
				.FirstOrDefaultAsync(sp=>sp.NotebookId == notebookId && sp.Id == studyPlanId);
			if(studyPlan == null)
			{
				throw new KeyNotFoundException("Module not found for this notebook!");
			}
			int score = 0;
			foreach(KeyValuePair<int,int> answer in request.answers)
			{
				var question = studyPlan.Questions.FirstOrDefault(q => q.Id == answer.Key);
				if(question == null)
				{
					throw new KeyNotFoundException("Invalid question id!");
				}
				var selectedOption = question.Options.FirstOrDefault(o=>o.Id == answer.Value);
				if(selectedOption != null)
				{
					selectedOption.IsSelectedByUser = true;
					if (selectedOption.IsCorrect)
					{
						score++;
					}
				}
			}
			studyPlan.IsQuizCompleted = true;
			studyPlan.QuizResults = score;
			studyPlan.IsFinished = true;
			await _context.SaveChangesAsync();
			return score;
		}

		private async Task<StudyPlan> ValidateStudyPlanOwnershipCheck(int notebookId, int studyPlanId)
		{	
			var studyPlan = await _context.StudyPlans.FindAsync(studyPlanId);
			if(studyPlan == null)
			{
				throw new KeyNotFoundException("Module not found!");
			}
			if(studyPlan.NotebookId != notebookId)
			{
				throw new UnauthorizedAccessException("The module doesn't belong to the notebook!");
			}
			return studyPlan;
		}

		
	}
}
