using System.Text.Json;
using AutoMapper;
using backend_dotnet.Data;
using backend_dotnet.Dtos.StudyPlans;
using backend_dotnet.Extensions;
using backend_dotnet.Models;
using backend_dotnet.Services.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Services
{
	public class StudyPlanService : IStudyPlanService
	{
		private readonly ApplicationDbContext _context;
		private readonly IMapper _mapper;
		private readonly IStudyPlanGeneratorRegistry _registry;
		private readonly IFilesService _fileService;
		private readonly IQuizAssessor _quizAssesor; //general plans
		private readonly IMathAssessor _mathAssessor; // math plans
		private readonly IStudyPlanReaderRegistry _readerRegistry;
		public StudyPlanService(ApplicationDbContext context, 
			IMapper mapper,
			IStudyPlanGeneratorRegistry registry,
			IFilesService filesService,
			IQuizAssessor quizAssessor,
			IMathAssessor mathAssessor,
			IStudyPlanReaderRegistry readerRegistry)
		{
			_context = context;
			_mapper = mapper;
			_registry = registry;
			_fileService = filesService;
			_quizAssesor = quizAssessor;
			_mathAssessor = mathAssessor;
			_readerRegistry = readerRegistry;
		}
		private static readonly HashSet<string> AllowedImageTypes = new(StringComparer.OrdinalIgnoreCase)
		{
			"image/png", "image/jpeg", "image/webp", "image/heic", "image/heif"
		};
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
			var notebook = await _context.ValidateNotebookOwnershipAsync(userId, notebookId);
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
			var reader = _readerRegistry.Resolve(notebook.Type);

			return await reader.BuildAsync(studyPlan);

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

		//general plans
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
			int score = _quizAssesor.Assess(studyPlan, request);
			await _context.SaveChangesAsync();
			return score;
		}
		//math plans

		public async Task<VerifyExerciseResponse> VerifyExerciseAsync(string userId, int notebookId, int studyPlanId, 
		string exerciseId, IReadOnlyList<IFormFile> files)
		{
			//notebook and stiudy plan verification
			var notebook = await _context.ValidateNotebookOwnershipAsync(userId, notebookId);
			if(notebook.Type != NotebookType.Math)
			{
				throw new ArgumentException("This endpoint is only for math notebooks!");
			}
			var studyPlan = await ValidateStudyPlanOwnershipCheck(notebookId, studyPlanId);
			if (string.IsNullOrWhiteSpace(studyPlan.ContentPayload))
			{
				throw new KeyNotFoundException("This study plans does not contain any generated exercises!");
			}

			var mathExercises = JsonSerializer.Deserialize<ICollection<MathExercise>>(studyPlan.ContentPayload,
			new JsonSerializerOptions{PropertyNameCaseInsensitive=true});
			if(mathExercises == null || mathExercises.Count == 0)
			{
				throw new KeyNotFoundException("Something went wrong");
			}
			var exercise = mathExercises.FirstOrDefault(mx=>mx.Id == exerciseId);
			if(exercise == null)
			{
				throw new KeyNotFoundException("Something whent wrong when trying to retrive the exercise!");
			}
			//file verification
			if (files.Count == 0)
    			throw new ArgumentException("Please attach at least one photo of your solution.");
			if (files.Count > 3)
    			throw new ArgumentException("You can attach at most 3 photos per submission.");
			var invalid = files.FirstOrDefault(f => !AllowedImageTypes.Contains(f.ContentType));
			if (invalid is not null)
    			throw new ArgumentException(
        			$"'{invalid.FileName}' is not a supported image. Please upload a photo (PNG, JPG, WEBP, or HEIC).");

			//saving files and adding the new reccord
			var saved = await _fileService.SaveImages(notebookId,files);
			var images = saved.Select(s=> new ImageData(s.Bytes, s.MimeType)).ToList();
			var paths = saved.Select(s=>s.RelativePath).ToList();
			var grade = await _mathAssessor.GradeAsync(exercise, images); 
			var submission = new ExerciseSubmission
			{
				StudyPlanId = studyPlanId,
				ExerciseId = exercise.Id,
				ImagePath = JsonSerializer.Serialize<List<string>>(paths),
				IsCorrect = grade.IsCorrect,
				Feedback = grade.Feedback
			};
			await _context.ExerciseSubmissions.AddAsync(submission);
			await _context.SaveChangesAsync();
			return _mapper.Map<VerifyExerciseResponse>(submission);
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
