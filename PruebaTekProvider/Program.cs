using FastEndpoints;
using FastEndpoints.Swagger;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PruebaTekProvider.Api.Authorization;
using PruebaTekProvider.Api.Middleware;
using PruebaTekProvider.Core.Tek.Application;
using PruebaTekProvider.Infrastructure.Data;
using PruebaTekProvider.Infrastructure.Tek;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddFastEndpoints();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("BASE")));

var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey))
    throw new InvalidOperationException("Falta configurar Jwt:Key (appsettings.Development.json, User Secrets o variable de entorno Jwt__Key).");
var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false,
        ValidateAudience = false,        
        NameClaimType = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
        RoleClaimType = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    };
});


builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173", // (React)   
            "http://localhost:8080",                        
            "http://127.0.0.1:5173"
            )
            .AllowAnyMethod()              // GET, POST, PUT, DELETE
            .AllowAnyHeader()              // Authorization, Content-Type, etc.
            .AllowCredentials();           // Permitir cookies/credenciales si es necesario
    });
});


builder.Services.AddScoped<IClienteService,ClienteService>();
builder.Services.AddScoped<IClienteRepository,ClienteRepository>();

builder.Services.AddAuthorization();
builder.Services.AddSingleton<Microsoft.AspNetCore.Authorization.IAuthorizationPolicyProvider,
                              PermissionPolicyProvider>();
builder.Services.AddScoped<Microsoft.AspNetCore.Authorization.IAuthorizationHandler,
                           PermissionAuthorizationHandler>();

// Swagger de FastEndpoints (NSwag); incluye soporte JWT Bearer en la UI.
builder.Services.SwaggerDocument();

// Orden importa: primero el de concurrencia (409); si no aplica, cae al global (500).
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<ConcurrencyExceptionHandler>();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

var app = builder.Build();

//app.UseMiddleware<IdempotencyMiddleware>();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        dbContext.Database.Migrate(); // Esto crea las tablas si no existen        
    }
    catch (Exception)
    {
        throw;
    }
}

app.UseHttpsRedirection();
app.UseExceptionHandler();
app.UseCors("PermitirFrontend");
app.UseAuthentication(); // ✅ Primero autenticamos

app.UseAuthorization();
app.UseFastEndpoints(c => c.Errors.UseProblemDetails()); // errores 400 en formato ProblemDetails

if (app.Environment.IsDevelopment())
{
    app.UseSwaggerGen(); // UI en /swagger
}

app.Run();