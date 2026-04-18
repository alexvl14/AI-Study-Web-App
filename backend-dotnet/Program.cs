using backend_dotnet.Data;
using Microsoft.EntityFrameworkCore;
using backend_dotnet.Models;
using backend_dotnet.Mappings;
using backend_dotnet.Services.Interfaces;
using backend_dotnet.Services;

var builder = WebApplication.CreateBuilder(args);

// Services



builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Mapping
builder.Services.AddAutoMapper(cfg => cfg.AddProfile<NotebookProfile>());

//PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Identity
builder.Services.AddIdentityApiEndpoints<User>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

//connection with python 
var pythonAddress = builder.Configuration["ExternalServices:PythonBackendUrl"];
builder.Services.AddHttpClient(pythonAddress, client =>
{
    client.BaseAddress = new Uri(pythonAddress);
    client.Timeout = TimeSpan.FromSeconds(2);

});

//Services
builder.Services.AddScoped<INotebookService, NotebookService>();

var app = builder.Build();

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
