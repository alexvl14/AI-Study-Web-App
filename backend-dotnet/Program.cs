using backend_dotnet.Data;
using Microsoft.EntityFrameworkCore;
using backend_dotnet.Models;
using backend_dotnet.Mappings;
using backend_dotnet.Services.Interfaces;
using backend_dotnet.Services;
using backend_dotnet.Middlewares;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Mapping
builder.Services.AddAutoMapper(cfg => {
    cfg.AddProfile<NotebookProfile>();
    cfg.AddProfile<FileProfile>();
    cfg.AddProfile<ChatMapping>();
    cfg.AddProfile<StudyPlanMappings>();
});

//PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"), 
    o=>o.UseVector()));

// Identity
builder.Services.AddIdentityApiEndpoints<User>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

//connection with python 
var pythonAddress = builder.Configuration["ExternalServices:Python:ServiceUrl"];
var pythonApiKey = builder.Configuration["ExternalServices:Python:ApiKey"];
builder.Services.AddHttpClient("PythonBackend", client =>
{
    client.BaseAddress = new Uri(pythonAddress);
    client.Timeout = TimeSpan.FromSeconds(30);
    client.DefaultRequestHeaders.Add("DotNet-API-KEY", pythonApiKey);
});

//Services
builder.Services.AddScoped<INotebookService, NotebookService>();
builder.Services.AddScoped<IFilesService, FileService>();
builder.Services.AddScoped<IDocumentParserService, DocumentParserService>();
builder.Services.AddScoped<IEmbeddingService, EmbeddingService>();
builder.Services.AddScoped<ILLMConnectService, LLMConnectService>();
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<IStudyPlanService, StudyPlanService>();

//Error Handling 
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();


var app = builder.Build();
app.UseExceptionHandler();
//apply migrations automatically 
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    if (context.Database.GetPendingMigrations().Any())
    {
        context.Database.Migrate();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapIdentityApi<User>();

app.Run();
