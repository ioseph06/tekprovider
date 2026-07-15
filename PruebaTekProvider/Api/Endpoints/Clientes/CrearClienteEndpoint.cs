using FastEndpoints;
using PruebaTekProvider.Core.Tek.Application;
using Perms = PruebaTekProvider.Core.Shared.Permissions;

namespace PruebaTekProvider.Api.Endpoints.Clientes
{
    public class CrearClienteEndpoint(IClienteService clienteService) : Endpoint<CrearClienteDto, ClienteDto>
    {
        private readonly IClienteService _clienteService = clienteService;

        public override void Configure()
        {
            Post("api/v1/cliente");
            Policies(Perms.Cliente.Crear);
        }

        public override async Task HandleAsync(CrearClienteDto req, CancellationToken ct)
        {
            var result = await _clienteService.CrearAsync(req);
            if (!result.IsSuccess)
            {
                AddError(result.Error!);
                await Send.ErrorsAsync(400, ct);
                return;
            }

            await Send.CreatedAtAsync<ObtenerClienteEndpoint>(
                new { id = result.Value!.Id }, result.Value, cancellation: ct);
        }
    }
}
