using backend_dotnet.Dtos.StudyPlans;
using backend_dotnet.Models;
using backend_dotnet.Services.Interfaces;

namespace backend_dotnet.Services
{

    public class QuizAssessor : IQuizAssessor
    {
        public int Assess(StudyPlan studyPlan, QuizSubmitRequest request)
        {
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
            return score;
        }
    }
}