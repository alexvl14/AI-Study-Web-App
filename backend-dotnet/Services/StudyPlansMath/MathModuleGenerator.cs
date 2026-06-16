using System.Text.Json;
using AutoMapper;
using backend_dotnet.Data;
using backend_dotnet.Dtos.StudyPlans;
using backend_dotnet.Extensions;
using backend_dotnet.Models;
using backend_dotnet.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Services.StudyPlansMath
{
    
    public class MathModuleGenerator : IStudyPlanGenerator
    {
        public NotebookType Type => NotebookType.Math;
        private readonly ApplicationDbContext _context;
        private readonly ILLMConnectService _lLMConnectService;
        private readonly IMapper _mapper;
        private readonly IEmbeddingService _embeddingService;

        public MathModuleGenerator(ApplicationDbContext context, ILLMConnectService lLMConnectService,
        IMapper mapper, IEmbeddingService embeddingService)
        {
            _context = context;
            _lLMConnectService = lLMConnectService; 
            _mapper = mapper;
            _embeddingService = embeddingService;
        }

        public async Task<ICollection<StudyPlan>> GenerateSyllabusAsync(Notebook notebook)
        {

            var notebookOverview = await _context.GetNotebookOverviewAsync(notebook.Id);
            if(notebookOverview.Count == 0)
            {
                return new List<StudyPlan>();
            }
            var existingTitles = await _context.StudyPlans
            .AsNoTracking()
            .Where(sp=>sp.NotebookId == notebook.Id)
            .Select(sp=>sp.Title)
            .ToListAsync(); 
            string titles = existingTitles.Count > 0 ? string.Join(",", existingTitles) :
             "(none yet — this is the first syllabus; generate a full set of modules)";

            string prompt = $@"
You are an expert mathematics curriculum designer and academic tutor.
Your task is to analyze the following excerpts from mathematical study materials and design a structured, pedagogically ordered Math Study Syllabus composed of distinct learning modules.

Each module you create will later be expanded into a lesson containing THEORY (definitions, explanations, worked concepts) and a set of PRACTICE EXERCISES the student solves by hand. Design every module with that in mind: each should be a coherent mathematical topic or technique that can be both explained and practiced.

INSTRUCTIONS:
1. Review the excerpts to understand the mathematical scope: the core concepts, definitions, theorems, methods, and problem types present in the material.
2. Break the material into a logical sequence of distinct Study Modules.
3. Order modules pedagogically: prerequisites and foundational concepts first, advanced techniques and applications later.
4. For each module provide:
   - 'title' (max 150 characters): a specific mathematical topic, e.g. 'Solving Quadratic Equations by Factoring'.
   - 'description' (max 1000 characters): what the student will learn and the kinds of problems they will practice. This text is used later to generate the module's theory and exercises, so be concrete about the techniques and problem types involved.
   - 'difficultyLevel': an integer for the topic's complexity — 0 (Easy), 1 (Medium), or 2 (Hard).
   - 'sequenceOrder': an integer for the module's position in the overall progression.
5. Base the curriculum STRICTLY on the provided material. Do not invent topics, methods, or problem types that the excerpts do not support.

EXISTING MODULES — DO NOT DUPLICATE:
The modules listed below already exist for this notebook. Do NOT create modules covering the same or substantially overlapping topics. Generate ONLY new modules that extend, deepen, or complement what already exists. If the existing modules already cover the available material and no meaningful new module can be added, return an empty array [].
--------------------------------------------------
{titles}
--------------------------------------------------

TEXT EXCERPTS FOR ANALYSIS:
--------------------------------------------------
{string.Join("\n", notebookOverview)}
--------------------------------------------------
These are representative excerpts taken systematically from throughout the provided study materials.
If the text is not descriptive enough to build a syllabus, return an empty array [] for the modules.

Format your response strictly according to the required JSON schema.
";

            string aiResponse = await _lLMConnectService.GenerateStructuredDataAsync(prompt,
             StudyPlanSchemas.Syllabus());

            var response = JsonSerializer.Deserialize<SyllabusResponse>(aiResponse, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            if(response == null || response.Modules == null || response.Modules.Count == 0)
            {
                throw new Exception("Not enought data is provided to generate new study plans"); 
            }
            var plans =  _mapper.Map<ICollection<StudyPlan>>(response.Modules);
            foreach(var p in plans)
            {
                p.SequenceOrder += existingTitles.Count;
            }
            return plans;
        }

        public async Task GenerateContentAsync(Notebook notebook, StudyPlan studyPlan)
        {
            int numberOfExercises = 5;
            var embededDescription = await _embeddingService.ProcessSingleEmbedding(studyPlan.Description);
            var relevantContext = await _context.GetRelevantContextAsync(notebook.Id, embededDescription, 20);

            string prompt = $@"You are an expert mathematics tutor.
Your task is to write the THEORY for one study module AND generate a set of practice exercises, based strictly on the provided context material.

MODULE:
Title: {studyPlan.Title}
Description: {studyPlan.Description}

INSTRUCTIONS:
1. 'content': Write a clear, complete explanation of this module's theory in Markdown — definitions, key formulas (use LaTeX-style notation), and at least one worked example showing the method step by step.
2. 'exercises': Generate exactly {numberOfExercises} practice problems that test the theory you just wrote. Vary the difficulty. State each problem fully in 'prompt' so the student can solve it on paper.
3. 'hint': For each exercise, give a SHORT hint — the key idea, formula, or first step — WITHOUT giving away the full solution.
4. CRITICAL: Do NOT include full solutions or final answers. The student solves these by hand; they will be graded later from a photo of their work.
5. CRITICAL: Base everything STRICTLY on the provided context. Do not invent methods the context does not support.

CONTEXT MATERIAL:
--------------------------------------------------
{string.Join("\n\n", relevantContext)}
--------------------------------------------------";

            var aiResponse = await _lLMConnectService.GenerateStructuredDataAsync(prompt,
             StudyPlanSchemas.MathContent(numberOfExercises));
            var response = JsonSerializer.Deserialize<MathContextDto>(aiResponse, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            if(string.IsNullOrWhiteSpace(response?.Content) || response.Exercises.Count == 0)
            {
                throw new Exception("An error occurred while generating the content");
            }
            for(int i =0; i < response.Exercises.Count; i++)
            {
                response.Exercises[i].Id = $"ex{i+1}";
            }
            studyPlan.Content = response.Content;
            studyPlan.ContentPayload = JsonSerializer.Serialize(response.Exercises);
            studyPlan.IsGenerated = true;
        }

    }
}