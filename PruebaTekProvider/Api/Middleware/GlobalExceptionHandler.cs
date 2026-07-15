using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace PruebaTekProvider.Api.Middleware
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly IProblemDetailsService _problemDetails;
        private readonly ILogger<GlobalExceptionHandler> _logger;

        public GlobalExceptionHandler(IProblemDetailsService problemDetails, ILogger<GlobalExceptionHandler> logger)
        {
            _problemDetails = problemDetails;
            _logger = logger;
        }

        public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken ct)
        {
            _logger.LogError(exception, "Excepción no controlada en {Method} {Path}",
                context.Request.Method, context.Request.Path);

            context.Response.StatusCode = StatusCodes.Status500InternalServerError;

            return await _problemDetails.TryWriteAsync(new ProblemDetailsContext
            {
                HttpContext = context,
                ProblemDetails = new ProblemDetails
                {
                    Status = StatusCodes.Status500InternalServerError,
                    Title = "Error interno del servidor",
                    Detail = "Ocurrió un error inesperado. El incidente ha sido registrado."
                }
            });
        }
    }
}
