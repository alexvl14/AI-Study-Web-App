using AutoMapper;
using backend_dotnet.Data;
using backend_dotnet.Dtos.StudyPlans;
using backend_dotnet.Extensions;
using backend_dotnet.Models;
using backend_dotnet.Services.Interfaces;
using Google.GenAI.Types;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace backend_dotnet.Services
{
	public class StudyPlanService : IStudyPlanService
	{
		private readonly ApplicationDbContext _context;
		private readonly ILLMConnectService _lLMConnectService;
		private readonly IMapper _mapper;
		public StudyPlanService(ApplicationDbContext context, ILLMConnectService lLMConnectService,
			IMapper mapper)
		{
			_context = context;
			_lLMConnectService = lLMConnectService;
			_mapper = mapper;
		}

		public async Task<SyllabusResponse> GenerateSyllabusAsync(string userId, int notebookId, int textChunksFromFile = 10)
		{
			var notebook = await _context.ValidateNotebookOwnershipAsync(userId, notebookId);

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
4. For each module, provide a clear, professional 'title' and a brief (max 1000 char) 'description' explaining what the student will learn. 
They will be used later to create the content of the modules.
5. Base the curriculum strictly on the provided material. Do not invent topics that are not supported by the excerpts.
6. Format your response strictly according to the required JSON schema.

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
				studyPlan.DifficultyLevel = Difficulty.Medium;
			}

			await _context.StudyPlans.AddRangeAsync(study_plans);
			await _context.SaveChangesAsync();
			return response;



		}
	}
}
