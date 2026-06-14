using System.Text.Json;
using backend_dotnet.Dtos.StudyPlans;
using backend_dotnet.Models;
using backend_dotnet.Services.Interfaces;

namespace backend_dotnet.Services.StudyPlansMath
{
    
    public class MathAssessor : IMathAssessor
    {
        private readonly ILLMConnectService _lLMConnectService;

        public MathAssessor(ILLMConnectService lLMConnectService)
        {
            _lLMConnectService = lLMConnectService;
        }

        public async Task<MathGradeResult> GradeAsync(MathExercise exercise, IReadOnlyList<ImageData> images)
        {
            string prompt = @$"You are an expert mathematics examiner grading a student's handwritten solution.

The attached image(s) are photos of a student's handwritten work for the problem below. There may be 1–3 photos; treat them together as one continuous solution.

THE PROBLEM:
{exercise.Prompt}

REFERENCE HINT (the intended approach — for YOUR guidance only, do NOT reveal it verbatim):
{exercise.Hint}

HOW TO GRADE:
1. First, solve the problem yourself to establish the correct method and final answer.
2. Read the student's handwriting carefully and transcribe their working step by step.
3. Check each step for mathematical validity — not just the final answer. A correct final answer reached by flawed or unjustified steps is NOT fully correct.
4. Identify the FIRST place their reasoning goes wrong, if any. Everything after a first error is often a downstream consequence — focus the student there.
5. Accept any mathematically valid method, even if it differs from the reference hint. There is often more than one correct approach.

SET isCorrect:
- true ONLY if the final answer is correct AND every step is mathematically valid and sufficiently justified.
- false otherwise.

WRITE feedback (Markdown):
- Briefly confirm the steps they got right, by name (e.g. 'factoring was correct').
- If there's an error, point to the FIRST one and explain WHY it's wrong, then give a nudge toward the fix — a hint or the relevant rule. Do NOT give the full corrected solution or the final answer; they will re-attempt.
- Keep the tone encouraging and concise.

EDGE CASES:
- If the image is blank, unreadable, or shows work unrelated to this problem, set isCorrect=false and say what you see and what you need (e.g. 'I can't read the lower-right steps — please retake the photo with better lighting').

Respond strictly in the required JSON format.";

            var result = await _lLMConnectService.GenerateStructuredDataWithImageAsync(prompt, 
            StudyPlanSchemas.MathGradeResult(), images);

            var grade = JsonSerializer.Deserialize<MathGradeResult>( result,new JsonSerializerOptions{
                PropertyNameCaseInsensitive = true
            });
            if(grade == null)
            {
                throw new Exception("Something whent wrong!");
            }
            return grade;

        }
    }
}