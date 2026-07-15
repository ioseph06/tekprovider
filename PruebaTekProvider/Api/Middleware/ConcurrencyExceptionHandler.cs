using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace PruebaTekProvider.Api.Middleware
{
    public class ConcurrencyExceptionHandler : IExceptionHandler
    {
        private readonly IProblemDetailsService _problemDetails;

        public ConcurrencyExceptionHandler(IProblemDetailsService problemDetails)
            => _problemDetails = problemDetails;

        public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken ct)
        {
            if (exception is not DbUpdateConcurrencyException)
                return false;   // no es de concurrencia → que lo maneje otro

            context.Response.StatusCode = StatusCodes.Status409Conflict;

            return await _problemDetails.TryWriteAsync(new ProblemDetailsContext
            {
                HttpContext = context,
                ProblemDetails = new ProblemDetails
                {
                    Status = StatusCodes.Status409Conflict,
                    Title = "Conflicto de concurrencia",
                    Detail = "El registro fue modificado por otra operación. Recarga los datos y vuelve a intentarlo."
                }
            });
        }
    }
}
