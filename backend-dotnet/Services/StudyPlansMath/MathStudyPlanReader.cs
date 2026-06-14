using System.Text.Json;
using AutoMapper;
using backend_dotnet.Data;
using backend_dotnet.Dtos.StudyPlans;
using backend_dotnet.Models;
using backend_dotnet.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend_dotnet.Services
{
    
    public class MathStudyPlanReader : IStudyPlanReader
    {
        public NotebookType Type => NotebookType.Math;
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        public MathStudyPlanReader(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<FullStudyPlanResponse> BuildAsync(StudyPlan studyPlan)
        {
            var exercises = JsonSerializer.Deserialize<List<MathExercise>>(studyPlan.ContentPayload!, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }) ?? new ();

            var sub = await _context.ExerciseSubmissions
                .Where(es=>es.StudyPlanId == studyPlan.Id)
                .OrderBy(es=>es.CreatedAt)
                .ToListAsync();
            
            var response = _mapper.Map<FullStudyPlanResponse>(studyPlan);
            response.Exercises = exercises.Select(e=> new MathExerciseResponse
            {
                Id=e.Id,
                Hint=e.Hint,
                Prompt = e.Prompt,
                Submissions = sub.Where(s=>s.ExerciseId == e.Id)
                    .Select(s=> _mapper.Map<ExerciseSubmissionResponse>(s))
                    .ToList()
            }).ToList();
            return response;
        }

    }
}