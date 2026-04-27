using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend_dotnet.Migrations
{
    /// <inheritdoc />
    public partial class EnforeRequiredRelationshipFroTextChunk : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TextChunks_UploadedFiles_UploadedDataId",
                table: "TextChunks");

            migrationBuilder.DropIndex(
                name: "IX_TextChunks_UploadedDataId",
                table: "TextChunks");

            migrationBuilder.DropColumn(
                name: "UploadedDataId",
                table: "TextChunks");

            migrationBuilder.CreateIndex(
                name: "IX_TextChunks_UploadedFileId",
                table: "TextChunks",
                column: "UploadedFileId");

            migrationBuilder.AddForeignKey(
                name: "FK_TextChunks_UploadedFiles_UploadedFileId",
                table: "TextChunks",
                column: "UploadedFileId",
                principalTable: "UploadedFiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TextChunks_UploadedFiles_UploadedFileId",
                table: "TextChunks");

            migrationBuilder.DropIndex(
                name: "IX_TextChunks_UploadedFileId",
                table: "TextChunks");

            migrationBuilder.AddColumn<int>(
                name: "UploadedDataId",
                table: "TextChunks",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TextChunks_UploadedDataId",
                table: "TextChunks",
                column: "UploadedDataId");

            migrationBuilder.AddForeignKey(
                name: "FK_TextChunks_UploadedFiles_UploadedDataId",
                table: "TextChunks",
                column: "UploadedDataId",
                principalTable: "UploadedFiles",
                principalColumn: "Id");
        }
    }
}
