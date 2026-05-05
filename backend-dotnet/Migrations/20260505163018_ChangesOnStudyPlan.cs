using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_dotnet.Migrations
{
    /// <inheritdoc />
    public partial class ChangesOnStudyPlan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsStarted",
                table: "StudyPlans",
                newName: "IsQuizCompleted");

            migrationBuilder.AddColumn<bool>(
                name: "IsFinished",
                table: "StudyPlans",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsFinished",
                table: "StudyPlans");

            migrationBuilder.RenameColumn(
                name: "IsQuizCompleted",
                table: "StudyPlans",
                newName: "IsStarted");
        }
    }
}
