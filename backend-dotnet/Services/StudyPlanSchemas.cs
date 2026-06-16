using Google.GenAI.Types;

namespace backend_dotnet.Services
{
    
    public static class StudyPlanSchemas
    {
        public static Schema Syllabus() => new Schema
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

		public static Schema MathContent(int numberOfExercises)=> new Schema
		{
			Type = Google.GenAI.Types.Type.Object,
			Properties = new Dictionary<string, Schema>
			{
				["content"]= new Schema
				{
					Type = Google.GenAI.Types.Type.String,
					Title = "Content",
					Description = "The module's theory as beautifully formatted markdown, based strictly on the context."
				},
				["exercises"] = new Schema
				{
					Type=Google.GenAI.Types.Type.Array,
					Description = $"A set of {numberOfExercises} practice problems testing the theory. Do NOT include solutions.",
					Items = new Schema
					{
						Type = Google.GenAI.Types.Type.Object,
						Properties = new Dictionary<string, Schema>
						{
							{
								"prompt",new Schema{Type = Google.GenAI.Types.Type.String, Title="Prompt"}
							},
							{
								"hint", new Schema{Type= Google.GenAI.Types.Type.String, Title="Hint"}
							}
						},
						Required = new List<string>{"prompt", "hint"}
					}
				}
			},
			Required = new List<string> {"content", "exercises"}
		};

		public static Schema MathGradeResult()=>new Schema
		{
			Type=Google.GenAI.Types.Type.Object,
			Properties = new Dictionary<string, Schema>
			{
				["isCorrect"] = new Schema
				{
					Type = Google.GenAI.Types.Type.Boolean,
					Description = "True only if the student's final answer AND working are mathematically correct."
				},
				["feedback"] = new Schema
				{
					Type = Google.GenAI.Types.Type.String,
					Description = "Step-by-step feedback in markdown: confirm correct steps, identify the first error, give a hint. Do NOT just give the final answer."
				}
			},
			Required = new List<string> {"isCorrect", "feedback"}
		};

    }
}