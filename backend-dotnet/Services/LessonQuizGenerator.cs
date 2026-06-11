using System.Text.Json;
using AutoMapper;
using backend_dotnet.Data;
using backend_dotnet.Dtos.StudyPlans;
using backend_dotnet.Extensions;
using backend_dotnet.Models;
using backend_dotnet.Services.Interfaces;
using Google.GenAI.Types;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Services
{

    public class LessonQuizGenerator : IStudyPlanGenerator
    {
        public NotebookType Type => NotebookType.General;
        private readonly ApplicationDbContext _context;
        private readonly ILLMConnectService _lLMConnectService;
        private readonly IMapper _mapper;
        private readonly IEmbeddingService _embeddingService;

        public LessonQuizGenerator(ApplicationDbContext context, ILLMConnectService lLMConnectService,
        IMapper mapper, IEmbeddingService embeddingService)
        {
            _context = context; 
            _lLMConnectService = lLMConnectService;
            _mapper = mapper;
            _embeddingService = embeddingService;
        }

        public async Task GenerateContentAsync(Notebook notebook, StudyPlan studyPlan)
        {
            const int numberOfQuestions = 5;
			var embededDescription  = await _embeddingService.ProcessSingleEmbedding(studyPlan.Description);
			var relevantContext = await _context.GetRelevantContextAsync(notebook.Id,embededDescription);

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
			
			var mappedQuestion = _mapper.Map<ICollection<QuizQuestion>>(response.Quiz);
			foreach(var question in mappedQuestion)
			{
				studyPlan.Questions.Add(question);
			}

			studyPlan.IsGenerated = true;
        }

        public async  Task<ICollection<StudyPlan>> GenerateSyllabusAsync(Notebook notebook)
        {

			//deleting the old ones
			var existingStudyPlans = await _context.StudyPlans
				.Where(sp => sp.NotebookId == notebook.Id).ToListAsync();

			if(existingStudyPlans.Any())
			{
				_context.StudyPlans.RemoveRange(existingStudyPlans);
			}

			var notebookOverview = await GetNotebookOverview(notebook.Id);

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
{ string.Join("\n", notebookOverview) }
--------------------------------------------------
These are representative excerpts taken systematically from throughout the provided study materials.
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
			return  _mapper.Map<ICollection<StudyPlan>>(response.Modules);
        }
    
        private async Task<List<string>> GetNotebookOverview(int notebookId, 
			int initialTake=10, int windowSize=3, int maxChunksPerFile=30, int maxFileCount=10)
		{
			var textChunksIdQuery = await _context.TextChunks
				.Where(tc=>tc.UploadedData.NotebookId == notebookId)
				.Select(tc=> new { tc.Id, tc.UploadedFileId})
				.ToListAsync();

			var idsToFetch = new List<int>();
			var groupedChunks = textChunksIdQuery.GroupBy(tc => tc.UploadedFileId).Take(maxFileCount);

			foreach (var group in groupedChunks)
			{
				var fileChunks = group.OrderBy(tc => tc.Id).Select(tc => tc.Id).ToList();
				idsToFetch.AddRange(fileChunks.Take(initialTake));

				int allowedExtraChunks = maxChunksPerFile - initialTake;

				var remainingIds = fileChunks.Skip(initialTake).ToList();

				if (remainingIds.Count > 0 && allowedExtraChunks >= windowSize)
				{
					int numberOfWindows = allowedExtraChunks / windowSize;
					int stepSize = remainingIds.Count / numberOfWindows;
					stepSize = Math.Max(stepSize, windowSize);

					for (int i = 0; i < remainingIds.Count; i+=stepSize)
					{
						idsToFetch.AddRange(remainingIds.Skip(i).Take(windowSize));
					}
				}
			}
			var text = await _context.TextChunks
				.Where(tc => idsToFetch.Contains(tc.Id))
				.OrderBy(tc=>tc.Id)
				.Select(tc => tc.Text)
				.ToListAsync();
			return text;

		}


    }
}