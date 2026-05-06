using AutoMapper;
using backend_dotnet.Data;
using backend_dotnet.Dtos.StudyPlans;
using backend_dotnet.Extensions;
using backend_dotnet.Models;
using backend_dotnet.Services.Interfaces;
using Google.GenAI.Types;
using Microsoft.EntityFrameworkCore;
using System.Collections;
using System.Text.Json;

namespace backend_dotnet.Services
{
	public class StudyPlanService : IStudyPlanService
	{
		private readonly ApplicationDbContext _context;
		private readonly ILLMConnectService _lLMConnectService;
		private readonly IEmbeddingService _embeddingService;
		private readonly IMapper _mapper;
		public StudyPlanService(ApplicationDbContext context, 
			ILLMConnectService lLMConnectService,
			IEmbeddingService embeddingService,
			IMapper mapper)
		{
			_context = context;
			_lLMConnectService = lLMConnectService;
			_embeddingService = embeddingService;
			_mapper = mapper;
		}

		public async Task<ICollection<GetStudyPlanResponse>> GenerateSyllabusAsync(string userId, int notebookId, int textChunksFromFile = 10)
		{
			var notebook = await _context.ValidateNotebookOwnershipAsync(userId, notebookId);
			//deleting the old ones
			var existingStudyPlans = await _context.StudyPlans
				.Where(sp => sp.NotebookId == notebookId).ToListAsync();
			if(existingStudyPlans.Any())
			{
				_context.StudyPlans.RemoveRange(existingStudyPlans);
			}

			var files = await _context.UploadedFiles
				.Where(f => f.NotebookId == notebookId)
				.Include(f => f.TextChunks.OrderBy(tc => tc.Id).Take(textChunksFromFile))
				.ToListAsync();

			string prompt = $@"
You are an expert curriculum designer and academic tutor. 
Your task is to analyze the following excerpts from educational materials and design a comprehensive, logical, and highly structured Study Syllabus.

INSTRUCTIONS:
1. Review the provided text to understand the core subject, themes, and scope of the material.
2. Break the material down into a structured sequence of 10 to 20 distinct Study Modules.
3. Modules must flow in a logical, pedagogical order (e.g., foundational concepts first, advanced applications later).
4. For each module, provide a clear, professional 'title'(max 150 char) and a brief (max 1000 char) 'description' explaining what the student will learn. 
They will be used later to create the content of the modules.
5. Base the curriculum strictly on the provided material. Do not invent topics that are not supported by the excerpts.
6. Format your response strictly according to the required JSON schema.
7. Analyze the topic's complexity and assign an integer: 0 (Easy), 1 (Medium), or 2 (Hard)

TEXT EXCERPTS FOR ANALYSIS:
--------------------------------------------------
{ string.Join("\n", files.SelectMany(f => f.TextChunks.Select(tc => tc.Text))) }
--------------------------------------------------
This were the first few pages of every document provided as a study material.
If the text is not descriptive enough to build a syllabus, return an empty array [] for the modules.
";
			var syllabusSchema = new Schema
			{
				Type =Google.GenAI.Types.Type.Object,
				Properties = new Dictionary<string, Schema>
				{
					["modules"] = new Schema
					{
						Type = Google.GenAI.Types.Type.Array,
						Items = new Schema
						{
							Type = Google.GenAI.Types.Type.Object,
							Properties = new Dictionary<string, Schema>
							{
								{
									"sequenceOrder", new Schema{Type= Google.GenAI.Types.Type.Integer, Title="sequenceOrder"}
								},
								{
									"title", new Schema{Type = Google.GenAI.Types.Type.String, Title = "Title"}
								},
								{
									"description", new Schema{ Type = Google.GenAI.Types.Type.String, Title="Description"}
								},
								{
									"difficultyLevel", new Schema{Type=Google.GenAI.Types.Type.Integer, Title="DifficultyLevel"}
								}
							},
							Required = new List<string> {"sequenceOrder", "title", "description"}
						}
					}
				},
				Required = new List<string> {"modules"}
			};

			string aiResponse = await _lLMConnectService.GenerateStructuredDataAsync(prompt, syllabusSchema);
			var response = JsonSerializer.Deserialize<SyllabusResponse>(aiResponse, new JsonSerializerOptions
			{
				PropertyNameCaseInsensitive = true
			});

			if(response?.Modules == null ||  response.Modules.Count == 0)
			{
				throw new Exception("Not enough data is provided to generate a syllabus!");
			}
			var study_plans = _mapper.Map<ICollection<StudyPlan>>(response.Modules);

			foreach(var studyPlan in study_plans)
			{
				studyPlan.NotebookId = notebookId;
			}

			await _context.StudyPlans.AddRangeAsync(study_plans);
			await _context.SaveChangesAsync();
			return _mapper.Map<ICollection<GetStudyPlanResponse>>(study_plans);
		}

		public async Task GenerateStudyPlanContextAsync(string userId, int notebookId, int studyPlanId, int numberOfQuestions =5)
		{
			var studyPlan = await ValidateStudyPlanOwnershipCheck(userId, notebookId, studyPlanId);
			if (studyPlan == null)
			{
				throw new KeyNotFoundException($"Study plan with id : {studyPlanId} was not found!");
			}
			if (studyPlan.IsGenerated)
			{
				return;
			}

			var embededDescription  = await _embeddingService.ProcessSingleEmbedding(studyPlan.Description);
			var relevantContext = await _context.GetRelevantContextAsync(notebookId,embededDescription);

			var contentSchema = new Schema
			{
				Type = Google.GenAI.Types.Type.Object,
				Properties = new Dictionary<string, Schema>
				{
					["content"] = new Schema
					{
						Type = Google.GenAI.Types.Type.String,
						Description = "The highly readable, beautifully formatted markdown " +
						"educational lesson based strictly on the context."

					},
					["quiz"] = new Schema
					{
						Type = Google.GenAI.Types.Type.Array,
						Description = $"A {numberOfQuestions}-question multiple choice quiz testing the user on the markdownContent",
						Items = new Schema
						{
							Type = Google.GenAI.Types.Type.Object,
							Properties = new Dictionary<string, Schema>
							{
								["questionText"] = new Schema
								{
									Type = Google.GenAI.Types.Type.String
								},
								["options"] = new Schema
								{
									Type = Google.GenAI.Types.Type.Array,
									Items = new Schema
									{
										Type = Google.GenAI.Types.Type.Object,
										Properties = new Dictionary<string, Schema>
										{
											["optionText"] = new Schema
											{
												Type = Google.GenAI.Types.Type.String
											},
											["isCorrect"] = new Schema
											{
												Type = Google.GenAI.Types.Type.Boolean
											}
										},
										Required = new List<string> { "optionText", "isCorrect"}
									}
									
								}
							},
							Required = new List<string> { "questionText", "options"}
						}
						
					}
				},
				Required = new List<string> { "content", "quiz"}
			};

			string prompt = $@"You are an expert academic tutor. 
Your task is to write a comprehensive educational lesson AND generate a multiple-choice quiz based strictly on the provided context material.
LESSON OBJECTIVE:
Title: {studyPlan.Title}
Description: {studyPlan.Description}
INSTRUCTIONS:
1. 'content': Write a complete educational lesson structured beautifully using Markdown (Headings, bullet points, bold text).
2. 'quiz': Generate exactly {numberOfQuestions} multiple choice questions that test the student on the lesson you just wrote.
3. CRITICAL: Provide exactly 4 options per question. Only ONE option can have 'isCorrect' set to true.
4. CRITICAL: Base the entire lesson and quiz STRICTLY on the provided context. Do not invent facts not present in the context.
CONTEXT MATERIAL FOR THE LESSON:
--------------------------------------------------
{string.Join("\n\n", relevantContext)}
--------------------------------------------------";

			var aiResponse = await _lLMConnectService.GenerateStructuredDataAsync(prompt, contentSchema);
			var response = JsonSerializer.Deserialize<StudyPlanDto>(aiResponse,new JsonSerializerOptions
			{
				PropertyNameCaseInsensitive = true
			});
			if(string.IsNullOrWhiteSpace(response?.Content) || response.Quiz.Count == 0)
			{
				throw new Exception("An error occurred while generating module");
			}

			studyPlan.Content = response.Content;
			studyPlan.IsGenerated = true;

			var mappedQuestion = _mapper.Map<ICollection<QuizQuestion>>(response.Quiz);

			foreach(var question in mappedQuestion)
			{
				studyPlan.Questions.Add(question);
			}

			await _context.SaveChangesAsync();
		}

		public async Task<StudyPlanResponse> GetStudyPlanAsync(string userId, int notebookId, int studyPlanId)
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
			var mappedStudyPlan = _mapper.Map<StudyPlanResponse>(studyPlan);
			return mappedStudyPlan;

		}

		public async Task<TimeSpan> UpdateTimeSpendAsync(string userId, int notebookId, int studyPlanId, int secondsSpent)
		{
			var studyPlan = await ValidateStudyPlanOwnershipCheck(userId, notebookId, studyPlanId);

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

		private async Task<StudyPlan> ValidateStudyPlanOwnershipCheck(string userId,int notebookId, int studyPlanId)
		{
			await _context.ValidateNotebookOwnershipAsync(userId, notebookId);
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
